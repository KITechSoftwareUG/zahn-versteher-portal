"""Gmail API Client via OAuth.

Setup einmal pro Deployment:
  1. Google Cloud Console -> Gmail API aktivieren
  2. OAuth-Client-ID (Typ: Desktop App) -> JSON runterladen nach secrets/gmail_credentials.json
  3. `python -m app.scripts.gmail_authorize` ausführen -> secrets/gmail_token.json wird erzeugt
"""
from __future__ import annotations

import base64
import logging
from email.message import EmailMessage

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from app.config import get_settings

log = logging.getLogger(__name__)

GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def _load_credentials() -> Credentials:
    s = get_settings()
    if not s.gmail_token_file.exists():
        raise FileNotFoundError(
            f"gmail token not found at {s.gmail_token_file}. "
            "Run: python -m app.scripts.gmail_authorize"
        )
    creds = Credentials.from_authorized_user_file(str(s.gmail_token_file), GMAIL_SCOPES)
    if creds.expired and creds.refresh_token:
        log.info("refreshing gmail oauth token")
        creds.refresh(Request())
        s.gmail_token_file.write_text(creds.to_json())
    return creds


def _build_raw_message(*, to: str, subject: str, body: str, from_address: str, from_name: str) -> str:
    msg = EmailMessage()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_address}>" if from_name else from_address
    msg.set_content(body)
    return base64.urlsafe_b64encode(msg.as_bytes()).decode()


def send_mail(*, to: str, subject: str, body: str) -> dict:
    """Synchronous send (Gmail SDK is sync). Call from worker via asyncio.to_thread."""
    s = get_settings()
    creds = _load_credentials()
    service = build("gmail", "v1", credentials=creds, cache_discovery=False)
    raw = _build_raw_message(
        to=to,
        subject=subject,
        body=body,
        from_address=s.gmail_from_address,
        from_name=s.gmail_from_name,
    )
    result = (
        service.users()
        .messages()
        .send(userId="me", body={"raw": raw})
        .execute()
    )
    log.info("gmail sent to %s (id=%s)", to, result.get("id"))
    return result
