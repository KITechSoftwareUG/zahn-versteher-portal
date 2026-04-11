-- Background-Job-Queue für verzögerte WhatsApp- und Mail-Versände
-- Der Worker läuft im selben Prozess wie die FastAPI-App (siehe app/queue/worker.py)

CREATE TABLE IF NOT EXISTS jobs (
  id          BIGSERIAL PRIMARY KEY,
  job_type    TEXT NOT NULL,                          -- 'send_whatsapp_template' | 'send_mail'
  payload     JSONB NOT NULL,                         -- z.B. { "lead_id": 42 }
  run_at      TIMESTAMPTZ NOT NULL DEFAULT now(),     -- frühester Ausführungszeitpunkt
  status      TEXT NOT NULL DEFAULT 'pending',        -- 'pending' | 'running' | 'done' | 'failed' | 'dead'
  attempts    INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  last_error  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT jobs_status_chk
    CHECK (status IN ('pending', 'running', 'done', 'failed', 'dead')),
  CONSTRAINT jobs_type_chk
    CHECK (job_type IN ('send_whatsapp_template', 'send_mail'))
);

-- Hot-Path-Index: Worker fragt "welche Jobs sind fällig?" sehr häufig ab.
-- Partial Index auf pending-Einträge hält ihn klein.
CREATE INDEX IF NOT EXISTS jobs_pending_run_at_idx
  ON jobs (run_at)
  WHERE status = 'pending';

-- Auto-Update von updated_at
CREATE OR REPLACE FUNCTION jobs_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jobs_updated_at_trg ON jobs;
CREATE TRIGGER jobs_updated_at_trg
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION jobs_set_updated_at();
