-- Zahnfunnel Lead-Datenbank
-- Wird beim ersten Start des postgres Containers automatisch ausgeführt
-- (gemountet nach /docker-entrypoint-initdb.d via docker-compose)

CREATE TABLE IF NOT EXISTS leads (
  id               BIGSERIAL PRIMARY KEY,
  name             TEXT,
  alter_jahre      TEXT,                                  -- als TEXT, weil Formular kein int garantiert
  telnr            TEXT NOT NULL,                         -- E.164 Format, z.B. +491511234567
  mail             TEXT,
  einverstaendnis  TEXT,                                  -- 'ja' | 'nein' | '' | NULL
  quelle           TEXT NOT NULL,                         -- 'formular' | 'whatsapp_direct'
  anliegen_summary TEXT,                                  -- vom Set-Node aus den medizinischen Feldern gebaut
  payload_raw      TEXT,                                  -- komplettes Eingangs-JSON als String (Audit/Debug)
  erstkontakt_am   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT leads_quelle_chk CHECK (quelle IN ('formular', 'whatsapp_direct'))
);

-- Telefonnummer ist der natürliche Schlüssel zur Dedup-Erkennung
-- Insert-Konflikte werden vom Workflow via skipOnConflict abgefangen
CREATE UNIQUE INDEX IF NOT EXISTS leads_telnr_unique
  ON leads (telnr);

-- Mail-Index nur für Zeilen mit Mail (Fall 2 hat oft keine Mail)
CREATE INDEX IF NOT EXISTS leads_mail_idx
  ON leads (mail)
  WHERE mail IS NOT NULL;

-- Häufige Abfrage: "Welche neuen Leads kamen heute aus welcher Quelle?"
CREATE INDEX IF NOT EXISTS leads_quelle_erstkontakt_idx
  ON leads (quelle, erstkontakt_am DESC);
