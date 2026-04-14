/**
 * Helper-Funktionen zum Anreichern des Form-Payloads mit:
 *  - einer lesbaren Klartext-Zusammenfassung der Anamnese (anliegen_summary)
 *  - Tracking-Metadaten (Referrer, UTM-Parameter, Gerät, Formular-Dauer)
 *
 * Beides landet im OS-Backend im "meta"-Feld und wird im Dashboard angezeigt.
 */

interface AnamneseFields {
  laufende_behandlungen?: string;
  geplante_behandlungen?: string;
  hkp_erstellt?: string;
  behandlung_begonnen?: string;
  fehlende_zaehne?: string;
  ersatz_typ?: string[] | string;
  fehlend_seit?: string;
  parodontitis_behandelt?: string;
  zahnfleischerkrankung?: string;
  kieferfehlstellung?: string;
  kfo_angeraten?: string;
}

/**
 * Baut einen kurzen, lesbaren Satz aus den ja/nein-Antworten und Freitext-
 * Feldern. Identisch zur Logik in app/services/normalize.py, damit Backend
 * und Frontend dieselbe Summary haben — egal wo sie erzeugt wird.
 *
 * Beispiel-Output:
 *   "Behandlung geplant/angeraten · Fehlende Zähne: 2 · Ersatz: Implantate, Kronen"
 */
export function buildAnliegenSummary(f: AnamneseFields): string {
  const yes = (v?: string) => typeof v === "string" && v.trim().toLowerCase() === "ja";
  const parts: string[] = [];

  if (yes(f.laufende_behandlungen)) parts.push("Laufende Zahnbehandlung");
  if (yes(f.geplante_behandlungen)) parts.push("Behandlung geplant/angeraten");
  if (yes(f.hkp_erstellt)) parts.push("HKP liegt vor");
  if (yes(f.behandlung_begonnen)) parts.push("Behandlung begonnen, nicht abgeschlossen");
  if (f.fehlende_zaehne && f.fehlende_zaehne !== "0" && f.fehlende_zaehne.trim() !== "") {
    parts.push(`Fehlende Zähne: ${f.fehlende_zaehne}`);
  }
  const ersatz = Array.isArray(f.ersatz_typ) ? f.ersatz_typ.join(", ") : f.ersatz_typ;
  if (ersatz && ersatz.trim() !== "") parts.push(`Ersatz: ${ersatz}`);
  if (f.fehlend_seit && f.fehlend_seit.trim() !== "") {
    parts.push(`Fehlend seit: ${f.fehlend_seit}`);
  }
  if (yes(f.parodontitis_behandelt)) parts.push("Parodontitis (2-5J behandelt)");
  if (yes(f.zahnfleischerkrankung)) parts.push("Aktuelle Zahnfleischerkrankung");
  if (yes(f.kieferfehlstellung)) parts.push("Kieferfehlstellung");
  if (yes(f.kfo_angeraten)) parts.push("KFO angeraten");

  return parts.join(" · ");
}

export interface LeadTracking {
  form_started_at: string;       // ISO
  form_completed_at: string;     // ISO
  duration_seconds: number;
  page_url: string;
  referrer: string;
  user_agent: string;
  language: string;
  screen: string;                // z.B. "1920x1080"
  viewport: string;              // z.B. "1440x900"
  // UTM-Parameter (aus URL geparst — leere Strings wenn nicht vorhanden)
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

/** Baut ein Tracking-Objekt aus Browser-Kontext + Formular-Start-Timestamp. */
export function buildTracking(formStartedAt: Date): LeadTracking {
  const now = new Date();
  const params = new URLSearchParams(window.location.search);
  return {
    form_started_at: formStartedAt.toISOString(),
    form_completed_at: now.toISOString(),
    duration_seconds: Math.round((now.getTime() - formStartedAt.getTime()) / 1000),
    page_url: window.location.href,
    referrer: document.referrer || "",
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}
