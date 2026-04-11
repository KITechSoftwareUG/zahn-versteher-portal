# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment context

Die produktive Anwendung (Landingpage + Formular) wird über **Lovable** deployed. Dieses Repo ist ausschließlich für die Entwicklung des GitHub-Codes gedacht — hier werden keine Deploy-Schritte ausgeführt. Änderungen landen per Git im Repo; Lovable zieht sich den Stand selbst.

## Commands

```bash
# Postgres starten (Init-Skripte in db/init/ laufen nur beim ersten up)
docker compose up -d

# Dev-Install
.venv/bin/pip install -e .

# App lokal starten
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

# Gmail OAuth einmalig (legt secrets/gmail_token.json an)
.venv/bin/python -m app.scripts.gmail_authorize

# Job-Queue inspizieren
docker exec zahnfunnel_postgres psql -U zahnfunnel -d zahnfunnel \
  -c "SELECT id, job_type, status, run_at, attempts, last_error FROM jobs ORDER BY id;"

# Jobs-Schema nachträglich einspielen, falls der Container vor 02_jobs.sql angelegt wurde
docker exec -i zahnfunnel_postgres psql -U zahnfunnel -d zahnfunnel < db/init/02_jobs.sql
```

Dev-Shortcut: `CONTACT_DELAY_MINUTES=0` in `.env` setzen, um die 3-Minuten-Verzögerung vor WhatsApp/Mail-Jobs auszuschalten.

Es gibt aktuell **keine Test-Suite** und keinen Linter im Repo — `pytest` ist als Dev-Dep eingetragen, aber es existieren keine Tests.

## Architektur (big picture)

Ein einziger FastAPI-Prozess bedient zwei Webhook-Eingänge **und** betreibt den Background-Worker im selben Event-Loop (via `lifespan` in [app/main.py](app/main.py)). Es gibt keinen separaten Worker-Container.

**Zwei Eingangspfade:**

1. **Formular** → [app/routes/form.py](app/routes/form.py) — `POST /webhook/form`
   - Optional HMAC-free Shared-Secret via Header `X-Api-Key` (nur wenn `FORM_API_KEY` gesetzt)
   - Telefonnummer wird in E.164 normalisiert ([app/services/normalize.py](app/services/normalize.py))
   - Lead-Insert mit `ON CONFLICT (telnr) DO NOTHING` — Duplikate werden stillschweigend verworfen
   - Bei `einverstaendnis=ja` → Job `send_whatsapp_template`, sonst bei vorhandener Mail → Job `send_mail`
   - Beide Jobs laufen mit Delay `CONTACT_DELAY_MINUTES` (Default 3)

2. **WhatsApp direkt** → [app/routes/whatsapp.py](app/routes/whatsapp.py) — `GET/POST /webhook/whatsapp`
   - `GET` beantwortet Meta-Verifikation (`hub.challenge`, nur bei korrektem `wa_verify_token`)
   - `POST` prüft **zuerst** `X-Hub-Signature-256` via `wa_app_secret` ([app/services/meta_webhook.py](app/services/meta_webhook.py)) und lehnt ungültige Requests mit 401 ab — nicht 200. Meta retried bei 401 nicht.
   - Nur `type=text` wird verarbeitet; unbekannte Absender bekommen eine statische Auto-Reply (24h-Window), bekannte werden ignoriert

**Job-Queue** (Postgres-basiert, in-process):

Zentrale Tabelle `jobs` ([db/init/02_jobs.sql](db/init/02_jobs.sql)), Status `pending | running | done | failed | dead`. Der Worker ([app/queue/worker.py](app/queue/worker.py)) pollt alle 5 s via `claim_next()` mit `FOR UPDATE SKIP LOCKED`, so dass mehrere Instanzen sich nicht in die Quere kämen.

- **Retry/Backoff:** Bei Exception → `mark_failed` mit `run_at = now() + attempts² minutes`, nach `max_attempts` (Default 3) landet der Job als `dead` und wird nie wieder automatisch neu gestartet.
- **Stale-Recovery:** Jobs, die länger als 10 min in `running` hängen, werden beim Start und alle 5 min wieder auf `pending` gesetzt (schützt vor Worker-Crashs mitten in der Verarbeitung).
- **Handler** ([app/queue/handlers.py](app/queue/handlers.py)) müssen bei Fehlern werfen — der Worker kümmert sich um Retry/Logging. Kein try/except im Handler, das würde den Retry-Mechanismus aushebeln.

**Job-Typen:**
- `send_whatsapp_template` → Claude generiert Kurztext, dann Meta-Template `lead_intro_de` mit einer Variable (`{{1}}` = kompletter AI-Text). Template muss im Meta Business Manager approved sein.
- `send_mail` → Claude generiert `{subject, body}` als JSON, dann Versand via Gmail API. Das Google-SDK ist synchron und wird via `asyncio.to_thread` aufgerufen.

**DB-Invariante:** `leads.telnr` ist `UNIQUE`. Deduplizierung passiert ausschließlich über diesen Unique-Index; beide Eingangspfade nutzen denselben `insert_lead()`-Helper in [app/db.py](app/db.py), der bei Konflikt `None` zurückgibt.

## Config / Secrets

Alles via Pydantic-Settings aus `.env` ([app/config.py](app/config.py)). Pflichtfelder ohne Defaults: `postgres_password`, `anthropic_api_key`, `wa_phone_number_id`, `wa_access_token`, `wa_verify_token`, `wa_app_secret`, `gmail_from_address`. `anthropic_model` defaultet auf `claude-sonnet-4-5` — für teurere Modelle `claude-opus-4-6` oder ähnlich setzen.

Gmail-OAuth-Flow erzeugt `secrets/gmail_token.json` nach einmaligem Browser-Consent. Credentials-JSON aus Google Cloud Console muss vorher unter `secrets/gmail_credentials.json` liegen.
