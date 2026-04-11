"""WhatsApp Cloud API Client (Meta Graph API).

Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
"""
from __future__ import annotations

import logging
import re

import httpx

from app.config import get_settings

log = logging.getLogger(__name__)

# Meta-Regeln für Template-Body-Variablen: keine 4+ aufeinanderfolgenden
# Newlines/Spaces/Tabs, kein leading/trailing whitespace, max ~1024 Zeichen.
# Wenn wir das nicht cleanen, antwortet die Graph API mit Error 132000 /
# 131009 (parameter value invalid / missing) und der Send schlägt fehl.
_TEMPLATE_VAR_MAX_LEN = 1024


def clean_template_variable(text: str) -> str:
    """Make a string safe as value for a WhatsApp template {{n}} body variable."""
    if not text:
        return ""
    # Tabs → space
    text = text.replace("\t", " ")
    # 2+ newlines → einzelnes newline (Meta verbietet 4+ newlines explizit,
    # wir sind defensiv)
    text = re.sub(r"\n{2,}", "\n", text)
    # 2+ spaces → einzelnes space
    text = re.sub(r" {2,}", " ", text)
    # Leading/trailing whitespace weg
    text = text.strip()
    # Länge begrenzen
    if len(text) > _TEMPLATE_VAR_MAX_LEN:
        text = text[: _TEMPLATE_VAR_MAX_LEN - 1].rstrip() + "…"
    return text


def _graph_url() -> str:
    s = get_settings()
    return f"https://graph.facebook.com/{s.wa_graph_api_version}/{s.wa_phone_number_id}/messages"


def _headers() -> dict[str, str]:
    s = get_settings()
    return {
        "Authorization": f"Bearer {s.wa_access_token}",
        "Content-Type": "application/json",
    }


def _clean_recipient(phone: str) -> str:
    """Meta akzeptiert die Nummer mit oder ohne '+'. Wir senden sie ohne
    und entfernen alle Nicht-Ziffern, damit Tippfehler keinen 400 auslösen."""
    return re.sub(r"\D", "", phone or "")


async def send_text(*, to: str, body: str) -> dict:
    """Sende einfachen Text. Funktioniert NUR im 24h-Window (Lead hat zuerst geschrieben)."""
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": _clean_recipient(to),
        "type": "text",
        "text": {"preview_url": False, "body": body},
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(_graph_url(), json=payload, headers=_headers())
    if resp.status_code >= 400:
        log.error("whatsapp text send failed %s: %s", resp.status_code, resp.text)
        resp.raise_for_status()
    log.info("whatsapp text sent to %s", to)
    return resp.json()


async def send_template(*, to: str, body_variables: list[str]) -> dict:
    """Sende approved Template. Funktioniert auch ausserhalb des 24h-Windows."""
    s = get_settings()
    cleaned_vars = [clean_template_variable(v) for v in body_variables]
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": _clean_recipient(to),
        "type": "template",
        "template": {
            "name": s.wa_template_name,
            "language": {"code": s.wa_template_lang},
            "components": [
                {
                    "type": "body",
                    "parameters": [{"type": "text", "text": v} for v in cleaned_vars],
                }
            ],
        },
    }
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(_graph_url(), json=payload, headers=_headers())
    if resp.status_code >= 400:
        log.error("whatsapp template send failed %s: %s", resp.status_code, resp.text)
        resp.raise_for_status()
    log.info("whatsapp template '%s' sent to %s", s.wa_template_name, to)
    return resp.json()
