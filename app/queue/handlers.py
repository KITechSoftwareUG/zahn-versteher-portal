"""Job-Handler: führt den jeweiligen Job-Typ aus.

Jeder Handler bekommt das Payload (dict) und wirft bei Fehlern eine Exception —
der Worker übernimmt retry/backoff.
"""
from __future__ import annotations

import asyncio
import logging
from typing import Any

from app.db import fetch_lead
from app.services import anthropic_client, gmail_client, whatsapp_client

log = logging.getLogger(__name__)


async def handle_send_whatsapp_template(payload: dict[str, Any]) -> None:
    lead_id = int(payload["lead_id"])
    lead = await fetch_lead(lead_id)
    if lead is None:
        raise RuntimeError(f"lead {lead_id} not found")

    name = lead.get("name") or ""
    anliegen = lead.get("anliegen_summary") or ""
    telnr = lead.get("telnr") or ""

    if not telnr:
        raise RuntimeError(f"lead {lead_id} has no telnr")

    # 1. Personalisierten Kurztext generieren
    personalized = await anthropic_client.generate_whatsapp_text(
        name=name, anliegen_summary=anliegen
    )

    # 2. Template mit dem Text als einzige Body-Variable senden
    await whatsapp_client.send_template(to=telnr, body_variables=[personalized])


async def handle_send_mail(payload: dict[str, Any]) -> None:
    lead_id = int(payload["lead_id"])
    lead = await fetch_lead(lead_id)
    if lead is None:
        raise RuntimeError(f"lead {lead_id} not found")

    name = lead.get("name") or ""
    mail = lead.get("mail") or ""
    anliegen = lead.get("anliegen_summary") or ""

    if not mail:
        raise RuntimeError(f"lead {lead_id} has no mail")

    # 1. Subject + Body generieren
    subject, body = await anthropic_client.generate_mail(
        name=name, mail=mail, anliegen_summary=anliegen
    )

    # 2. Via Gmail API senden (SDK ist sync -> in Thread auslagern)
    await asyncio.to_thread(gmail_client.send_mail, to=mail, subject=subject, body=body)


HANDLERS = {
    "send_whatsapp_template": handle_send_whatsapp_template,
    "send_mail": handle_send_mail,
}


async def dispatch(job: dict[str, Any]) -> None:
    handler = HANDLERS.get(job["job_type"])
    if handler is None:
        raise RuntimeError(f"no handler for job_type={job['job_type']!r}")
    log.info("running job id=%s type=%s attempt=%s", job["id"], job["job_type"], job["attempts"])
    await handler(job["payload"])
