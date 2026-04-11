"""FastAPI-Einstiegspunkt.

Startet den HTTP-Server und den Background-Job-Worker im selben Prozess
(über FastAPI lifespan).
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.db import close_pool, init_pool
from app.queue.worker import Worker
from app.routes import form, health, whatsapp


def _configure_logging() -> None:
    level = get_settings().log_level.upper()
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    _configure_logging()
    log = logging.getLogger("zahnfunnel")
    log.info("zahnfunnel starting up")
    await init_pool()
    worker = Worker()
    worker.start()
    app.state.worker = worker
    try:
        yield
    finally:
        log.info("zahnfunnel shutting down")
        await worker.stop()
        await close_pool()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Zahnfunnel",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.include_router(health.router)
    app.include_router(form.router)
    app.include_router(whatsapp.router)
    return app


app = create_app()
