"""Normalisierung von Lead-Eingaben (Telefonnummer, Anamnese-Zusammenfassung)."""
from __future__ import annotations

import re
from typing import Any


def normalize_phone_de(raw: str | None) -> str:
    """Format a German-centric phone number to E.164.

    Examples:
      '0151 1234567'   -> '+491511234567'
      '+49 151 1234567'-> '+491511234567'
      '00491511234567' -> '+491511234567'
      '491511234567'   -> '+491511234567'  (WhatsApp webhook gibt es so)
    """
    if not raw:
        return ""
    cleaned = re.sub(r"[\s\-()./]", "", str(raw))
    if cleaned.startswith("+"):
        return cleaned
    if cleaned.startswith("00"):
        return "+" + cleaned[2:]
    if cleaned.startswith("0"):
        return "+49" + cleaned[1:]
    # WA webhook liefert die Nummer ohne + aber mit Ländercode
    if cleaned.isdigit():
        return "+" + cleaned
    return cleaned


def build_anliegen_summary(payload: dict[str, Any]) -> str:
    """Extract medical anamnesis fields into a compact human-readable string.

    Feldnamen orientieren sich am Formular:
      - laufende_behandlungen, geplante_behandlungen
      - hkp_erstellt (ja/nein), behandlung_begonnen (ja/nein)
      - fehlende_zaehne, ersatz_typ, fehlend_seit
      - parodontitis_behandelt (ja/nein), zahnfleischerkrankung (ja/nein)
      - kieferfehlstellung (ja/nein), kfo_angeraten (ja/nein)
    """
    def g(key: str) -> Any:
        return payload.get(key)

    def yes(key: str) -> bool:
        val = g(key)
        return isinstance(val, str) and val.strip().lower() == "ja"

    parts: list[str] = []
    if yes("laufende_behandlungen"):
        parts.append("Laufende Zahnbehandlung")
    if yes("geplante_behandlungen"):
        parts.append("Behandlung geplant/angeraten")
    if yes("hkp_erstellt"):
        parts.append("HKP liegt vor")
    if yes("behandlung_begonnen"):
        parts.append("Behandlung begonnen, nicht abgeschlossen")
    if g("fehlende_zaehne"):
        parts.append(f"Fehlende Zähne: {g('fehlende_zaehne')}")
    if g("ersatz_typ"):
        parts.append(f"Ersatz: {g('ersatz_typ')}")
    if g("fehlend_seit"):
        parts.append(f"Fehlend seit: {g('fehlend_seit')}")
    if yes("parodontitis_behandelt"):
        parts.append("Parodontitis (2-5J behandelt)")
    if yes("zahnfleischerkrankung"):
        parts.append("Aktuelle Zahnfleischerkrankung")
    if yes("kieferfehlstellung"):
        parts.append("Kieferfehlstellung")
    if yes("kfo_angeraten"):
        parts.append("KFO angeraten")

    return " | ".join(parts)
