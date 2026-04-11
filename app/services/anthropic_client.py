"""Anthropic Claude Client für personalisierte Texte (WhatsApp-Kurztext + E-Mail)."""
from __future__ import annotations

import json
import logging
import re

from anthropic import AsyncAnthropic

from app.config import get_settings

log = logging.getLogger(__name__)

_client: AsyncAnthropic | None = None


def _get_client() -> AsyncAnthropic:
    global _client
    if _client is None:
        _client = AsyncAnthropic(api_key=get_settings().anthropic_api_key)
    return _client


WHATSAPP_SYSTEM = (
    "Du schreibst eine extrem kurze, freundliche WhatsApp-Erstnachricht "
    "(max. 2 Sätze, max. 280 Zeichen) im Namen einer Zahnarztpraxis. "
    "Du sprichst den Lead mit Vornamen an, nimmst genau EIN konkretes Detail "
    "aus seiner Anamnese auf und schlägst einen unverbindlichen Rückruf vor. "
    "Kein Fachjargon, kein Verkaufston, maximal ein 🙂. "
    "Antworte NUR mit dem Nachrichtentext, ohne Vorwort, ohne Erklärung."
)

MAIL_SYSTEM_TEMPLATE = (
    "Du schreibst eine personalisierte deutsche E-Mail im Namen der Zahnarztpraxis "
    "'{praxis_name}'{stadt_teil} an einen Lead, der KEINE WhatsApp-Kommunikation wünscht. "
    "Tonalität: professionell, warm, kein Verkauf. Sprich den Lead mit Vornamen an, "
    "nimm 1–2 Anamnese-Punkte konkret auf, biete einen unverbindlichen Rückruf oder "
    "Termin an, schliesse mit 'Mit freundlichen Grüssen, Praxis {praxis_name}'. "
    "Kein Markdown, keine Emojis. "
    "Antworte NUR mit gültigem JSON (ohne Codefence): "
    '{{"subject": "...", "body": "..."}}. Der Body darf \\n für Zeilenumbrüche nutzen.'
)


async def generate_whatsapp_text(*, name: str, anliegen_summary: str) -> str:
    client = _get_client()
    settings = get_settings()
    message = await client.messages.create(
        model=settings.anthropic_model,
        max_tokens=400,
        system=WHATSAPP_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": f"Name: {name}\nAnamnese: {anliegen_summary or '(keine Angabe)'}",
            }
        ],
    )
    text = "".join(block.text for block in message.content if block.type == "text").strip()
    log.info("generated whatsapp text (%d chars)", len(text))
    return text


async def generate_mail(*, name: str, mail: str, anliegen_summary: str) -> tuple[str, str]:
    """Returns (subject, body). Parses JSON from the model response."""
    client = _get_client()
    settings = get_settings()
    stadt_teil = f" in {settings.praxis_stadt}" if settings.praxis_stadt else ""
    system = MAIL_SYSTEM_TEMPLATE.format(
        praxis_name=settings.praxis_name, stadt_teil=stadt_teil
    )
    message = await client.messages.create(
        model=settings.anthropic_model,
        max_tokens=1500,
        system=system,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Name: {name}\nMail: {mail}\n"
                    f"Anamnese: {anliegen_summary or '(keine Angabe)'}"
                ),
            }
        ],
    )
    raw = "".join(block.text for block in message.content if block.type == "text").strip()

    # Robust JSON-Extraktion: falls das Modell doch mal Codefence o.ä. einstreut
    json_match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not json_match:
        raise ValueError(f"model returned no JSON: {raw[:200]}")
    data = json.loads(json_match.group(0))
    subject = str(data.get("subject", "")).strip()
    body = str(data.get("body", "")).strip()
    if not subject or not body:
        raise ValueError(f"model JSON missing subject/body: {data}")
    log.info("generated mail subject=%r body=%d chars", subject, len(body))
    return subject, body
