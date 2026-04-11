"""Einmaliges OAuth-Setup für den Gmail-Sender.

Benutzung:
  1. credentials.json aus Google Cloud Console -> secrets/gmail_credentials.json
  2. python -m app.scripts.gmail_authorize
  3. Browser öffnet sich, mit Praxis-Mail einloggen, Zugriff erlauben
  4. secrets/gmail_token.json wird erzeugt — die App liest es beim Senden.

Token bleibt gültig solange Google den Refresh-Token nicht widerruft
(typisch: monatelang). Wenn das Token abläuft, dieses Skript nochmal laufen lassen.
"""
from __future__ import annotations

import sys
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

from app.config import get_settings
from app.services.gmail_client import GMAIL_SCOPES


def main() -> int:
    s = get_settings()
    creds_path: Path = s.gmail_credentials_file
    token_path: Path = s.gmail_token_file

    if not creds_path.exists():
        print(f"ERROR: {creds_path} nicht gefunden.")
        print("  Lade die OAuth-Client-JSON aus der Google Cloud Console runter")
        print(f"  und lege sie unter {creds_path} ab.")
        return 1

    token_path.parent.mkdir(parents=True, exist_ok=True)

    flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), GMAIL_SCOPES)
    creds = flow.run_local_server(port=0)
    token_path.write_text(creds.to_json())
    print(f"OK — Token gespeichert unter {token_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
