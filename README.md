# Zahnfunnel

Lead-Funnel für eine Zahnarztpraxis. Zwei Eingangspfade:

1. **Formular** (`POST /webhook/form`) — die Landingpage postet die ausgefüllten Anamnese-Daten hierher. Wir speichern den Lead, und je nach Einverständnis wird nach einer kurzen Verzögerung eine personalisierte WhatsApp-Template-Nachricht oder eine personalisierte E-Mail verschickt (Text jeweils vom Claude-Modell generiert).
2. **Direkter WhatsApp-Klick** (`POST /webhook/whatsapp`) — Meta leitet eingehende WhatsApp-Nachrichten hierher. Schreibt ein neuer Lead zum ersten Mal, speichern wir ihn und antworten sofort mit einem Standardtext (erlaubt im 24h-Window).

## Stack

- Python 3.11+ / FastAPI / uvicorn
- Postgres 16 (via docker-compose)
- psycopg3 async connection pool
- Anthropic SDK (Claude Sonnet)
- WhatsApp Cloud API (Meta Graph API) direkt via httpx
- Gmail API via OAuth (`google-api-python-client`)
- Background-Job-Queue in-process, persistent in Postgres

## Setup

```bash
# 1. Postgres starten (Schema wird beim ersten up automatisch angelegt)
cp .env.example .env
# .env editieren und echte Werte eintragen
docker compose up -d

# 2. Python venv + deps
python3 -m venv .venv
.venv/bin/pip install -e .

# 3. Gmail OAuth einmalig autorisieren
#    Vorher: OAuth-Client-JSON aus Google Cloud Console nach secrets/gmail_credentials.json legen
.venv/bin/python -m app.scripts.gmail_authorize

# 4. App starten
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Pflicht-Credentials in `.env`

| Key | Wofür |
|---|---|
| `POSTGRES_PASSWORD` | DB-Passwort (wird von docker-compose und App gelesen) |
| `ANTHROPIC_API_KEY` | für die AI-Personalisierung |
| `WA_PHONE_NUMBER_ID` | Meta WhatsApp Business Phone Number ID |
| `WA_ACCESS_TOKEN` | Meta System-User Token (permanent) |
| `WA_VERIFY_TOKEN` | Frei wählbar; musst du im Meta Webhook-Setup identisch eintragen |
| `GMAIL_FROM_ADDRESS` | Absender-Adresse |
| `PRAXIS_NAME` | wird in AI-Prompts + Auto-Reply-Text verwendet |

## Einmalige externe Schritte

1. **WhatsApp-Template erstellen** im Meta Business Manager:
   - Name: `lead_intro_de` (oder wie in `.env` gesetzt)
   - Sprache: `de`
   - Body mit einer Variable `{{1}}` — dahinein landet der komplette AI-Text
   - Kategorie `MARKETING` oder `UTILITY`
2. **Webhook in Meta konfigurieren**:
   - Callback URL: `https://<dein-host>/webhook/whatsapp`
   - Verify Token: identisch zu `WA_VERIFY_TOKEN` in `.env`
   - Felder: `messages` abonnieren
3. **Gmail OAuth**:
   - Google Cloud Console → neues Projekt → Gmail API aktivieren
   - OAuth Consent Screen + OAuth Client (Desktop) anlegen
   - Download → `secrets/gmail_credentials.json`
   - `python -m app.scripts.gmail_authorize` ausführen

## Architektur

```
 HTTP POST /webhook/form
    │
    ▼
 routes/form.py  ──► normalize telnr  ──► insert lead (ON CONFLICT telnr DO NOTHING)
                                             │
                                             ├─ einverstaendnis=ja  ──► enqueue send_whatsapp_template
                                             └─ einverstaendnis=nein ──► enqueue send_mail

 HTTP POST /webhook/whatsapp
    │
    ▼
 routes/whatsapp.py  ──► filter non-text ──► lookup telnr in leads
                                                │
                                                ├─ neu      ──► insert + send_text (direkt)
                                                └─ bekannt  ──► no-op

 Background Worker (im selben Prozess, lifespan)
    │
    └─► claim_next (FOR UPDATE SKIP LOCKED) ──► dispatch ──► handler ──► mark_done
                                                               │
                                                               └─ Exception ──► mark_failed + backoff (attempts² min)
```

Job-Typen:
- `send_whatsapp_template` — generiert Kurztext via Claude und verschickt Template mit Variable
- `send_mail` — generiert `{subject, body}` via Claude (JSON) und sendet via Gmail API

## Datenbank

Siehe [db/init/01_schema.sql](db/init/01_schema.sql) (leads) und [db/init/02_jobs.sql](db/init/02_jobs.sql) (Job-Queue).

- `leads.telnr` ist `UNIQUE` — doppelte Insert-Versuche werden stillschweigend übersprungen (`ON CONFLICT DO NOTHING`)
- `jobs.status` ist `'pending' | 'running' | 'done' | 'failed' | 'dead'`
- `jobs.max_attempts` default `3`, danach wird der Job `'dead'` und nie wieder automatisch neu gestartet
- Ein partieller Index `jobs_pending_run_at_idx` hält die Hot-Path-Query schnell

## Endpunkte

| Methode | Pfad | Zweck |
|---|---|---|
| GET | `/health` | Liveness (testet auch die DB-Verbindung) |
| POST | `/webhook/form` | Formular-Eingang (Fall 1) |
| GET | `/webhook/whatsapp` | Meta Webhook Verification (hub.challenge) |
| POST | `/webhook/whatsapp` | Meta Webhook Receive (Fall 2) |
| GET | `/docs` | OpenAPI-Doku (FastAPI auto-generiert) |

## Manuelles Testen

Mit laufendem Postgres + App:

```bash
# Formular mit Einverständnis
curl -X POST http://localhost:8000/webhook/form \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Max Mustermann",
    "alter": "42",
    "telnr": "0151 1234567",
    "mail": "max@example.com",
    "einverstaendnis": "ja",
    "fehlende_zaehne": "2",
    "geplante_behandlungen": "Implantat hinten links"
  }'

# Formular ohne Einverständnis
curl -X POST http://localhost:8000/webhook/form \
  -H 'Content-Type: application/json' \
  -d '{"name":"Erika","telnr":"+49 160 9876543","mail":"e@example.com","einverstaendnis":"nein"}'

# Jobs in der DB prüfen
docker exec zahnfunnel_postgres psql -U zahnfunnel -d zahnfunnel \
  -c "SELECT id, job_type, status, run_at, last_error FROM jobs ORDER BY id;"
```

Zum Testen ohne 3-Minuten-Wartezeit: `CONTACT_DELAY_MINUTES=0` in `.env` setzen und App neu starten.

## Migration der Jobs-Tabelle nachträglich einspielen

Wenn der Postgres-Container schon beim Schreiben dieser Tabelle läuft, wird `02_jobs.sql` nicht automatisch ausgeführt (Init-Skripte laufen nur beim ersten `up`). Einmalig manuell:

```bash
docker exec -i zahnfunnel_postgres psql -U zahnfunnel -d zahnfunnel < db/init/02_jobs.sql
```
