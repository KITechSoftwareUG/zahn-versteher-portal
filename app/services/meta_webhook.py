"""HMAC-Signaturprüfung für Meta/Facebook Webhook-Payloads.

Meta signiert jedes Webhook-POST mit dem App Secret und legt die Signatur in
den Header X-Hub-Signature-256 (Format: 'sha256=<hex>').

Ohne diese Prüfung kann JEDER, der unseren Webhook-URL erraten oder abfangen
kann, uns beliebige Payloads schicken und dadurch:
  - fake Leads in die DB injizieren
  - Auto-Replies an beliebige Nummern triggern (Kosten!)
  - Meta-Quality-Rating unseres Business-Accounts drücken

Also: KRITISCH.
"""
from __future__ import annotations

import hashlib
import hmac
import logging

log = logging.getLogger(__name__)


def verify_signature(*, raw_body: bytes, signature_header: str, app_secret: str) -> bool:
    """Prüft die Echtheit eines Meta-Webhook-POST.

    Args:
        raw_body: Der ROHE Request-Body (exakt wie empfangen, nicht re-serialisiert).
                  Wichtig: nach request.body() holen, bevor jemand request.json() aufruft.
        signature_header: Wert des Headers 'X-Hub-Signature-256'.
                          Erwartet: 'sha256=<hex>'.
        app_secret: Meta App Secret.

    Returns:
        True wenn die Signatur gültig ist, sonst False.
    """
    if not signature_header or not app_secret:
        return False
    if not signature_header.startswith("sha256="):
        return False
    received_hex = signature_header[len("sha256=") :]

    computed = hmac.new(
        app_secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    # Konstantzeit-Vergleich gegen Timing-Attacken
    return hmac.compare_digest(received_hex, computed)
