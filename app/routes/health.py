from fastapi import APIRouter

from app.db import get_pool

router = APIRouter()


@router.get("/health")
async def health() -> dict:
    pool = get_pool()
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute("SELECT 1")
        await cur.fetchone()
    return {"ok": True}
