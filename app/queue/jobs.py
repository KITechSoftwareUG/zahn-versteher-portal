"""Job-Queue: Enqueue + Claim + Complete auf der Postgres-Tabelle `jobs`.

Wir verlassen uns auf `SELECT ... FOR UPDATE SKIP LOCKED`, damit mehrere Worker
gleichzeitig pollen könnten, ohne dass sich die Jobs überschneiden.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

from app.db import get_pool

log = logging.getLogger(__name__)

JobType = Literal["send_whatsapp_template", "send_mail"]


async def enqueue(
    *,
    job_type: JobType,
    payload: dict[str, Any],
    delay_minutes: int = 0,
    max_attempts: int = 3,
) -> int:
    run_at = datetime.now(timezone.utc) + timedelta(minutes=delay_minutes)
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute(
            """
            INSERT INTO jobs (job_type, payload, run_at, max_attempts)
            VALUES (%s, %s::jsonb, %s, %s)
            RETURNING id
            """,
            (job_type, json.dumps(payload), run_at, max_attempts),
        )
        row = await cur.fetchone()
        await conn.commit()
        job_id = row[0]  # type: ignore[index]
        log.info("enqueued job id=%s type=%s run_at=%s", job_id, job_type, run_at.isoformat())
        return job_id


async def claim_next() -> dict | None:
    """Claim one due job atomically. Returns the job row as dict, or None."""
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        # SKIP LOCKED + LIMIT 1 + FOR UPDATE -> atomares Claimen
        await cur.execute(
            """
            WITH claimed AS (
              SELECT id FROM jobs
              WHERE status = 'pending' AND run_at <= now()
              ORDER BY run_at ASC
              FOR UPDATE SKIP LOCKED
              LIMIT 1
            )
            UPDATE jobs
            SET status = 'running', attempts = attempts + 1
            FROM claimed
            WHERE jobs.id = claimed.id
            RETURNING jobs.id, jobs.job_type, jobs.payload, jobs.attempts, jobs.max_attempts
            """
        )
        row = await cur.fetchone()
        await conn.commit()
        if row is None:
            return None
        return {
            "id": row[0],
            "job_type": row[1],
            "payload": row[2],  # jsonb -> dict via psycopg
            "attempts": row[3],
            "max_attempts": row[4],
        }


async def mark_done(job_id: int) -> None:
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute("UPDATE jobs SET status = 'done' WHERE id = %s", (job_id,))
        await conn.commit()


async def reset_stale_jobs(*, stale_after_minutes: int = 10) -> int:
    """Recovery-Mechanismus: Jobs, die seit X Minuten auf 'running' hängen,
    wurden vermutlich durch einen Worker-Crash abgebrochen. Wir setzen sie
    zurück auf 'pending', damit sie erneut gepickt werden.

    Wird beim Worker-Start und periodisch aufgerufen. Ohne das würden
    abgebrochene Jobs ewig auf 'running' bleiben und nie verschickt werden.
    """
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute(
            """
            UPDATE jobs
            SET status = 'pending',
                last_error = coalesce(last_error, '') || ' [recovered from stale running]'
            WHERE status = 'running'
              AND updated_at < now() - make_interval(mins => %s)
            RETURNING id
            """,
            (stale_after_minutes,),
        )
        rows = await cur.fetchall()
        await conn.commit()
        if rows:
            log.warning("recovered %d stale 'running' jobs: %s", len(rows), [r[0] for r in rows])
        return len(rows)


async def mark_failed(job_id: int, error: str, *, is_final: bool) -> None:
    """Mark as failed. If final (max_attempts reached), set status='dead'.
    Otherwise requeue with backoff by setting status back to 'pending' and bumping run_at."""
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        if is_final:
            await cur.execute(
                "UPDATE jobs SET status = 'dead', last_error = %s WHERE id = %s",
                (error[:4000], job_id),
            )
        else:
            # Exponential backoff: 1m, 4m, 9m, ... (attempts^2)
            await cur.execute(
                """
                UPDATE jobs
                SET status = 'pending',
                    last_error = %s,
                    run_at = now() + (attempts * attempts) * interval '1 minute'
                WHERE id = %s
                """,
                (error[:4000], job_id),
            )
        await conn.commit()
