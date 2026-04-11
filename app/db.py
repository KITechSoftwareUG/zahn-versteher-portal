"""Postgres connection pool und Helper.

Wir nutzen psycopg3 mit einem async connection pool, damit FastAPI-Routes und
der Background-Worker sich denselben Pool teilen können.
"""
from __future__ import annotations

import logging

from psycopg_pool import AsyncConnectionPool

from app.config import get_settings

log = logging.getLogger(__name__)

_pool: AsyncConnectionPool | None = None


async def init_pool() -> AsyncConnectionPool:
    global _pool
    if _pool is not None:
        return _pool
    settings = get_settings()
    log.info("opening postgres pool to %s:%s/%s", settings.postgres_host, settings.postgres_port, settings.postgres_db)
    _pool = AsyncConnectionPool(
        conninfo=settings.postgres_dsn,
        min_size=1,
        max_size=10,
        open=False,
        kwargs={"autocommit": False},
    )
    await _pool.open()
    await _pool.wait()
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        log.info("closing postgres pool")
        await _pool.close()
        _pool = None


def get_pool() -> AsyncConnectionPool:
    if _pool is None:
        raise RuntimeError("postgres pool not initialized — call init_pool() first")
    return _pool


async def fetch_lead(lead_id: int) -> dict | None:
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute(
            """
            SELECT id, name, alter_jahre, telnr, mail, einverstaendnis,
                   quelle, anliegen_summary, payload_raw, erstkontakt_am
            FROM leads WHERE id = %s
            """,
            (lead_id,),
        )
        row = await cur.fetchone()
        if row is None:
            return None
        cols = [desc.name for desc in cur.description]  # type: ignore[union-attr]
        return dict(zip(cols, row))


async def insert_lead(
    *,
    name: str | None,
    alter_jahre: str | None,
    telnr: str,
    mail: str | None,
    einverstaendnis: str | None,
    quelle: str,
    anliegen_summary: str | None,
    payload_raw: str | None,
) -> int | None:
    """Insert a lead. Returns the new id, or None if telnr already exists (dedup)."""
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute(
            """
            INSERT INTO leads
              (name, alter_jahre, telnr, mail, einverstaendnis, quelle, anliegen_summary, payload_raw)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (telnr) DO NOTHING
            RETURNING id
            """,
            (name, alter_jahre, telnr, mail, einverstaendnis, quelle, anliegen_summary, payload_raw),
        )
        row = await cur.fetchone()
        await conn.commit()
        return row[0] if row else None


async def lead_exists_by_telnr(telnr: str) -> bool:
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute("SELECT 1 FROM leads WHERE telnr = %s LIMIT 1", (telnr,))
        return (await cur.fetchone()) is not None
