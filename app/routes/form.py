"""Fall 1: Formular-Webhook.

Die Website postet ein JSON-Payload hierher. Wir normalisieren, schreiben den
Lead in die DB (mit Dedup auf telnr) und enqueuen je nach Einverständnis einen
WhatsApp- oder Mail-Job mit 3 Minuten Verzögerung.
"""
from __future__ import annotations

import hmac
import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Request

from app.config import get_settings
from app.db import insert_lead
from app.queue import jobs
from app.services.normalize import build_anliegen_summary, normalize_phone_de

log = logging.getLogger(__name__)
router = APIRouter()


def _check_api_key(request: Request) -> None:
    """Wenn FORM_API_KEY in der Config gesetzt ist, muss der Request den
    Header `X-Api-Key` mit exakt diesem Wert mitschicken. Sonst 401."""
    expected = get_settings().form_api_key
    if not expected:
        return  # Endpunkt offen
    provided = request.headers.get("x-api-key", "")
    if not hmac.compare_digest(provided, expected):
        log.warning("form endpoint: invalid or missing X-Api-Key")
        raise HTTPException(status_code=401, detail="invalid api key")


@router.post("/webhook/form")
async def receive_form(request: Request) -> dict[str, Any]:
    _check_api_key(request)
    settings = get_settings()
    try:
        body = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="invalid json")
    if not isinstance(body, dict):
        return {"ok": False, "error": "payload must be an object"}

    name = (body.get("name") or "").strip() or None
    alter_jahre = str(body.get("alter") or "").strip() or None
    telnr = normalize_phone_de(body.get("telnr"))
    mail = (body.get("mail") or "").strip().lower() or None
    einverstaendnis = str(body.get("einverstaendnis") or "").strip().lower() or None

    if not telnr:
        return {"ok": False, "error": "telnr missing"}

    anliegen = build_anliegen_summary(body)
    payload_raw = json.dumps(body, ensure_ascii=False)

    lead_id = await insert_lead(
        name=name,
        alter_jahre=alter_jahre,
        telnr=telnr,
        mail=mail,
        einverstaendnis=einverstaendnis,
        quelle="formular",
        anliegen_summary=anliegen or None,
        payload_raw=payload_raw,
    )

    if lead_id is None:
        log.info("duplicate lead skipped telnr=%s", telnr)
        return {"ok": True, "status": "duplicate"}

    log.info("new lead id=%s telnr=%s einverstaendnis=%s", lead_id, telnr, einverstaendnis)

    if einverstaendnis == "ja":
        await jobs.enqueue(
            job_type="send_whatsapp_template",
            payload={"lead_id": lead_id},
            delay_minutes=settings.contact_delay_minutes,
        )
        return {"ok": True, "status": "queued_whatsapp", "lead_id": lead_id}

    if mail:
        await jobs.enqueue(
            job_type="send_mail",
            payload={"lead_id": lead_id},
            delay_minutes=settings.contact_delay_minutes,
        )
        return {"ok": True, "status": "queued_mail", "lead_id": lead_id}

    log.warning("lead id=%s has neither einverstaendnis=ja nor mail — nothing queued", lead_id)
    return {"ok": True, "status": "no_action", "lead_id": lead_id}
