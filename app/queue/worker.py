"""Background-Worker: pollt die jobs-Tabelle und führt fällige Jobs aus."""
from __future__ import annotations

import asyncio
import logging
import time

from app.queue import handlers, jobs

log = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = 5.0
STALE_RECOVERY_INTERVAL_SECONDS = 300.0  # 5 min
STALE_AFTER_MINUTES = 10


class Worker:
    def __init__(self) -> None:
        self._task: asyncio.Task | None = None
        self._stop = asyncio.Event()
        self._last_stale_check = 0.0

    def start(self) -> None:
        if self._task is not None:
            return
        log.info("starting job worker (poll every %ss)", POLL_INTERVAL_SECONDS)
        self._stop.clear()
        self._task = asyncio.create_task(self._run(), name="job-worker")

    async def stop(self) -> None:
        if self._task is None:
            return
        log.info("stopping job worker")
        self._stop.set()
        try:
            await asyncio.wait_for(self._task, timeout=10.0)
        except asyncio.TimeoutError:
            log.warning("worker did not stop in time, cancelling")
            self._task.cancel()
        finally:
            self._task = None

    async def _run(self) -> None:
        # Beim Start: alle 'running' Jobs recovern (Worker könnte vorher gecrashed sein)
        try:
            await jobs.reset_stale_jobs(stale_after_minutes=STALE_AFTER_MINUTES)
        except Exception:  # noqa: BLE001
            log.exception("stale recovery at startup failed")
        self._last_stale_check = time.monotonic()

        while not self._stop.is_set():
            try:
                # Periodisch stale jobs wieder zurücksetzen
                if time.monotonic() - self._last_stale_check > STALE_RECOVERY_INTERVAL_SECONDS:
                    try:
                        await jobs.reset_stale_jobs(stale_after_minutes=STALE_AFTER_MINUTES)
                    except Exception:  # noqa: BLE001
                        log.exception("periodic stale recovery failed")
                    self._last_stale_check = time.monotonic()

                processed = await self._process_one()
                if not processed:
                    try:
                        await asyncio.wait_for(self._stop.wait(), timeout=POLL_INTERVAL_SECONDS)
                    except asyncio.TimeoutError:
                        pass
            except Exception:  # noqa: BLE001
                log.exception("worker loop iteration crashed")
                await asyncio.sleep(POLL_INTERVAL_SECONDS)

    async def _process_one(self) -> bool:
        job = await jobs.claim_next()
        if job is None:
            return False
        try:
            await handlers.dispatch(job)
            await jobs.mark_done(job["id"])
            log.info("job id=%s done", job["id"])
        except Exception as exc:  # noqa: BLE001
            is_final = job["attempts"] >= job["max_attempts"]
            log.exception(
                "job id=%s failed (attempt %s/%s, final=%s)",
                job["id"],
                job["attempts"],
                job["max_attempts"],
                is_final,
            )
            await jobs.mark_failed(job["id"], str(exc), is_final=is_final)
        return True
