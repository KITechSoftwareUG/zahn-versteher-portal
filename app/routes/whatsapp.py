"""Fall 2: WhatsApp-Webhook.

Meta schickt zwei Arten von Requests hierher:

1. GET mit hub.mode=subscribe — einmalige Webhook-Verifikation beim Setup.
   Wir spiegeln den challenge-Parameter, wenn verify_token übereinstimmt.

2. POST mit dem eigentlichen Payload — eingehende Nachrichten oder
   Status-Updates (delivered/read). Wir prüfen die X-Hub-Signature-256,
   filtern auf type='text' und reagieren nur auf neue Leads mit einer
   Standard-Auto-Antwort.
"""
from __future__ import annotations

import json
import logging

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse

from app.config import get_settings
from app.db import insert_lead, lead_exists_by_telnr
from app.services.meta_webhook import verify_signature
from app.services.normalize import normalize_phone_de
from app.services.whatsapp_client import send_text

log = logging.getLogger(__name__)
router = APIRouter()


@router.get("/webhook/whatsapp")
async def verify(
    hub_mode: str = Query(alias="hub.mode", default=""),
    hub_verify_token: str = Query(alias="hub.verify_token", default=""),
    hub_challenge: str = Query(alias="hub.challenge", default=""),
) -> PlainTextResponse:
    s = get_settings()
    if hub_mode == "subscribe" and hub_verify_token == s.wa_verify_token:
        log.info("whatsapp webhook verified")
        return PlainTextResponse(hub_challenge)
    log.warning("whatsapp webhook verification failed mode=%s", hub_mode)
    raise HTTPException(status_code=403, detail="verification failed")


def _auto_reply_text() -> str:
    s = get_settings()
    return (
        "Hallo und vielen Dank für Ihre Nachricht! 🙂\n\n"
        "Hier ist {name} von {firma}. Ich helfe Ihnen, die passende "
        "{typ} zu finden – unabhängig und ohne Verkaufsdruck.\n\n"
        "Damit ich Ihnen einen konkreten Tarif vorschlagen kann, erzählen "
        "Sie mir gerne kurz: Wie ist Ihre aktuelle zahnmedizinische "
        "Situation, und gibt es geplante Behandlungen?\n\n"
        "Alternativ können Sie unser Formular ausfüllen – dauert ca. 60 "
        "Sekunden und ich melde mich mit einem persönlichen Vorschlag.\n\n"
        "Herzliche Grüße,\n"
        "{name}\n"
        "{firma}"
    ).format(name=s.berater_name, firma=s.berater_firma, typ=s.berater_typ)


@router.post("/webhook/whatsapp")
async def receive(request: Request) -> dict:
    settings = get_settings()

    # 1. Signatur prüfen BEVOR wir irgendwas mit dem Body machen
    raw_body = await request.body()
    signature = request.headers.get("x-hub-signature-256", "")
    if not verify_signature(
        raw_body=raw_body,
        signature_header=signature,
        app_secret=settings.wa_app_secret,
    ):
        log.warning(
            "whatsapp webhook signature invalid (len=%s, header_present=%s)",
            len(raw_body),
            bool(signature),
        )
        # 401 statt 200 — sonst akzeptieren wir gefälschte Requests.
        # Meta retryt bei 401 nicht (sie erkennen den Ablehnungs-Status),
        # und echte Meta-Requests sind immer signiert.
        raise HTTPException(status_code=401, detail="invalid signature")

    # 2. Payload parsen
    try:
        body = json.loads(raw_body)
    except json.JSONDecodeError:
        log.warning("whatsapp webhook: invalid json body")
        return {"ok": True}

    log.debug("whatsapp webhook payload: %s", body)

    # 3. Verarbeiten — Meta envelope:
    #    {"object":"whatsapp_business_account","entry":[{"changes":[{"value": {...}}]}]}
    try:
        entries = body.get("entry", [])
        for entry in entries:
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages") or []
                contacts = value.get("contacts") or []
                for msg in messages:
                    await _handle_message(msg, contacts, raw=body)
    except Exception:  # noqa: BLE001
        log.exception("failed to process whatsapp webhook body")

    # Meta erwartet 200 OK für erfolgreiche Verarbeitung.
    return {"ok": True}


async def _handle_message(msg: dict, contacts: list[dict], *, raw: dict) -> None:
    if msg.get("type") != "text":
        log.debug("ignoring non-text message type=%s", msg.get("type"))
        return
    from_number = msg.get("from")
    if not from_number:
        return

    telnr = normalize_phone_de(from_number)
    text_body = (msg.get("text") or {}).get("body") or ""

    if await lead_exists_by_telnr(telnr):
        log.info("whatsapp msg from known lead %s — no auto-reply", telnr)
        return

    profile_name = ""
    if contacts:
        profile_name = (contacts[0].get("profile") or {}).get("name") or ""

    lead_id = await insert_lead(
        name=profile_name or None,
        alter_jahre=None,
        telnr=telnr,
        mail=None,
        einverstaendnis=None,
        quelle="whatsapp_direct",
        anliegen_summary=text_body or None,
        payload_raw=json.dumps(raw, ensure_ascii=False),
    )
    if lead_id is None:
        # Race: jemand anderes hat ihn gerade angelegt
        log.info("concurrent insert race, skipping auto-reply for %s", telnr)
        return

    log.info("new whatsapp_direct lead id=%s telnr=%s", lead_id, telnr)
    await send_text(to=telnr, body=_auto_reply_text())
