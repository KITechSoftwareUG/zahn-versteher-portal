"""Anthropic Claude Client für personalisierte Texte (WhatsApp-Kurztext + E-Mail).

Kontext: Zahnzusatzversicherungs-Funnel von ExpatVantage (Alexander Fürtbauer).
ExpatVantage ist eine Finanzberatung in Stuttgart, die sich auf Expats in
Deutschland spezialisiert hat — Steueroptimierung, Vermögensaufbau, Versicherungen.
Dieser Funnel ist ein Sub-Produkt: Zahnzusatzversicherungen für Menschen, die mit
der schwachen GKV-Erstattung beim Zahnersatz konfrontiert sind. Zielgruppe sind
sowohl Expats als auch deutsche Kunden.

Über das Formular werden zahnmedizinische Anamnese-Daten erfasst (laufende/geplante
Behandlungen, fehlende Zähne, Parodontitis, Kieferfehlstellungen). Die AI erstellt
basierend darauf eine persönliche Ansprache, die dem Lead signalisiert, dass sein
konkreter Fall verstanden wurde, und ihn zu einer kostenlosen Erstberatung einlädt.
"""
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
    "(max. 2 Sätze, max. 280 Zeichen) im Namen eines Finanzberaters von "
    "ExpatVantage, der sich auf Zahnzusatzversicherungen spezialisiert hat. "
    "Du sprichst den Lead mit Vornamen an, nimmst genau EIN konkretes Detail "
    "aus seiner zahnmedizinischen Anamnese auf und zeigst, dass du seinen Fall "
    "verstehst. Dann lädst du zu einer kurzen, kostenlosen Erstberatung ein, "
    "um den passenden Tarif zu finden. "
    "Sie-Form (formell). Kein Fachjargon, kein Verkaufsdruck, kein Versprechen "
    "konkreter Leistungen oder Preise. Maximal ein 🙂. "
    "Antworte NUR mit dem Nachrichtentext, ohne Vorwort, ohne Erklärung."
)

MAIL_SYSTEM_TEMPLATE = (
    "Du schreibst eine personalisierte deutsche E-Mail im Namen von "
    "{berater_name} von {berater_firma}, einer Finanzberatung in Stuttgart, "
    "spezialisiert auf {berater_typ} für Expats und deutsche Kunden. "
    "Der Empfänger hat über ein Online-Formular seine zahnmedizinische Situation "
    "geschildert, aber KEINE WhatsApp-Kontaktaufnahme gewünscht. "
    "Tonalität: professionell, warm, vertrauenswürdig, Sie-Form, kein Verkaufsdruck. "
    "Sprich den Lead mit Vornamen an, nimm 1–2 konkrete Punkte aus seiner "
    "Anamnese auf, zeige dass du seinen Fall verstehst, und lade ihn zu einer "
    "kostenlosen Erstberatung ein (telefonisch oder per Video). "
    "Keine konkreten Tarife oder Preise nennen — das kommt erst im Gespräch. "
    "Schließe mit 'Mit freundlichen Grüßen,\\n{berater_name}\\n{berater_firma}'. "
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
                "content": (
                    f"Berater: {settings.berater_name}\n"
                    f"Name des Leads: {name}\n"
                    f"Zahnmedizinische Anamnese: {anliegen_summary or '(keine Angabe)'}"
                ),
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
    system = MAIL_SYSTEM_TEMPLATE.format(
        berater_name=settings.berater_name,
        berater_firma=settings.berater_firma,
        berater_typ=settings.berater_typ,
    )
    message = await client.messages.create(
        model=settings.anthropic_model,
        max_tokens=1500,
        system=system,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Name des Leads: {name}\nMail: {mail}\n"
                    f"Zahnmedizinische Anamnese: {anliegen_summary or '(keine Angabe)'}"
                ),
            }
        ],
    )
    raw = "".join(block.text for block in message.content if block.type == "text").strip()

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
