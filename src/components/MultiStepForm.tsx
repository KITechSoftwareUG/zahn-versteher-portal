import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getWhatsAppLink } from "@/lib/whatsapp";

interface FormData {
  // Step 0 — Behandlungen
  laufende_behandlungen: string;
  geplante_behandlungen: string;
  hkp_erstellt: string;
  behandlung_begonnen: string;
  // Step 1 — Fehlende Zähne
  fehlende_zaehne: string;
  ersatz_typ: string[];
  fehlend_seit: string;
  // Step 2 — Zahnfleisch & Kiefer
  parodontitis_behandelt: string;
  zahnfleischerkrankung: string;
  kieferfehlstellung: string;
  kfo_angeraten: string;
  // Step 3 — Kontakt
  name: string;
  telnr: string;
  mail: string;
  einverstaendnis: string;
  /** Ausdrückliche Einwilligung in Verarbeitung von Gesundheitsdaten (Art. 9 Abs. 2 lit. a DSGVO).
      Pflicht, weil Anamnese-Fragen besondere Kategorien personenbezogener Daten sind. */
  gesundheitsdaten_einwilligung: boolean;
}

const TOTAL_STEPS = 4;
const API_URL = import.meta.env.VITE_API_URL || "";

interface MultiStepFormProps {
  onStepChange?: (step: number) => void;
}

const MultiStepForm = ({ onStepChange }: MultiStepFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<FormData>({
    laufende_behandlungen: "",
    geplante_behandlungen: "",
    hkp_erstellt: "",
    behandlung_begonnen: "",
    fehlende_zaehne: "",
    ersatz_typ: [],
    fehlend_seit: "",
    parodontitis_behandelt: "",
    zahnfleischerkrankung: "",
    kieferfehlstellung: "",
    kfo_angeraten: "",
    name: "",
    telnr: "",
    mail: "",
    einverstaendnis: "",
    gesundheitsdaten_einwilligung: false,
  });

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const updateStep = (newStep: number) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const emailLooksValid = (m: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.trim());
  const phoneLooksValid = (p: string) => p.replace(/\D/g, "").length >= 6;

  const canNext = () => {
    if (step === 0) return data.laufende_behandlungen !== "" && data.geplante_behandlungen !== "";
    if (step === 1) return data.fehlende_zaehne !== "";
    if (step === 2) return data.parodontitis_behandelt !== "" && data.kieferfehlstellung !== "";
    if (step === 3) {
      if (data.name.trim() === "" || !phoneLooksValid(data.telnr)) return false;
      if (data.einverstaendnis === "") return false;
      // Ohne WhatsApp-Consent brauchen wir eine valide Mail für Kontakt.
      if (data.einverstaendnis === "nein" && !emailLooksValid(data.mail)) return false;
      if (data.mail.trim() !== "" && !emailLooksValid(data.mail)) return false;
      // Pflicht-Einwilligung in Verarbeitung der Gesundheitsdaten (Art. 9 DSGVO)
      if (!data.gesundheitsdaten_einwilligung) return false;
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      // Mapping auf das Vantage-OS-Backend-Schema:
      // - phone (Pflicht) statt telnr
      // - email statt mail
      // - source = "website"
      // Alle restlichen Felder (Anamnese, Einwilligungen, Behandlungsdetails)
      // packt das Backend automatisch in den Spalten-Wert "meta" als JSON.
      const { name, telnr, mail, ...rest } = data;
      const payload = {
        name,
        phone: telnr,
        email: mail || undefined,
        source: "website",
        ...rest,
        ersatz_typ: data.ersatz_typ.join(", "),
      };
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const apiKey = import.meta.env.VITE_FORM_API_KEY;
      if (apiKey) headers["X-Api-Key"] = apiKey;

      const res = await fetch(`${API_URL}/webhook/form`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      // Spezialfall: Backend speichert den Lead, versucht danach aber einen
      // WhatsApp-Template-Versand. Wenn der WhatsApp-Access-Token im OS
      // noch nicht gesetzt ist, liefert das Backend 502 + WhatsApp-Fehler.
      // Der Lead IST in diesem Fall schon in der DB — wir werten das als
      // Erfolg, damit der Nutzer nicht irritiert wird. Alexander kann ihn
      // manuell aus dem OS-Dashboard heraus kontaktieren.
      if (res.status === 502) {
        const text = await res.text();
        if (text.includes("WhatsApp")) {
          console.warn("[form] Lead gespeichert, aber WhatsApp-Versand fehlgeschlagen:", text);
          setSubmitted(true);
          return;
        }
      }

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error("Der Server ist gerade nicht erreichbar. Bitte versuchen Sie es in einem Moment erneut.");
        }
        if (res.status === 401) {
          throw new Error("Die Anfrage wurde abgelehnt. Bitte kontaktieren Sie uns direkt per WhatsApp.");
        }
        throw new Error(`Ihre Angaben konnten nicht übermittelt werden (Code ${res.status}).`);
      }
      setSubmitted(true);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setError("Die Verbindung zum Server hat zu lange gedauert. Bitte prüfen Sie Ihre Internetverbindung und versuchen es erneut.");
      } else if (e instanceof TypeError) {
        setError("Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.");
      } else {
        setError(e?.message || "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) updateStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) updateStep(step - 1);
  };

  const toggleErsatzTyp = (typ: string) => {
    setData((d) => ({
      ...d,
      ersatz_typ: d.ersatz_typ.includes(typ)
        ? d.ersatz_typ.filter((x) => x !== typ)
        : [...d.ersatz_typ, typ],
    }));
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-2xl">
        <span className="material-symbols-outlined mb-4 text-5xl text-accent">check_circle</span>
        <h3 className="mb-2 font-display text-2xl font-bold text-primary">
          Vielen Dank, {data.name}!
        </h3>
        <p className="text-slate-500">
          Ihre Angaben sind eingegangen. Auf Basis Ihrer zahnmedizinischen Situation
          erstelle ich Ihnen ein persönliches Angebot für die passende
          Zahnzusatzversicherung und melde mich
          {data.einverstaendnis === "ja" ? " per WhatsApp" : " per E-Mail"} bei Ihnen.
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-400">
          Alexander Fürtbauer | ExpatVantage
        </p>
      </div>
    );
  }

  const stepTitles = [
    "Aktuelle Behandlungen",
    "Fehlende Zähne",
    "Zahnfleisch & Kiefer",
    "Ihre Kontaktdaten",
  ];

  const JaNeinFrage = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="mb-5">
      <p className="mb-2 text-sm font-semibold text-primary">{label}</p>
      <div className="flex gap-3">
        {["ja", "nein"].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-xl border-2 px-6 py-2.5 text-sm font-semibold transition-all ${
              value === v
                ? "border-accent bg-accent/5 text-primary shadow-sm"
                : "border-slate-100 bg-slate-50/30 text-slate-500 hover:border-accent/30"
            }`}
          >
            {v === "ja" ? "Ja" : "Nein"}
          </button>
        ))}
      </div>
    </div>
  );

  const whatsappHref = getWhatsAppLink(
    `Ich möchte lieber direkt schreiben statt das Formular auszufüllen.`,
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 sm:px-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">
              {stepTitles[step]}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
              Schritt {step + 1} von {TOTAL_STEPS}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-accent transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs italic text-slate-400">
          <span className="material-symbols-outlined text-sm">timer</span>
          <span>Nur noch ca. {Math.max(30, (TOTAL_STEPS - step) * 30)} Sekunden bis zu Ihrem persönlichen Angebot</span>
        </div>

        {/* Shortcut: direkt auf WhatsApp chatten — für alle die keine Lust
            haben das komplette Formular durchzugehen. Nur sichtbar wenn
            VITE_WHATSAPP_NUMBER gesetzt ist. */}
        {whatsappHref && (
          <div className="mt-4 flex flex-col items-stretch gap-2 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="flex items-start gap-2 text-xs text-slate-500 sm:items-center">
              <span className="material-symbols-outlined text-base text-accent">forum</span>
              <span>
                <span className="font-semibold text-primary">Keine Lust auf Fragen?</span>{" "}
                Schreiben Sie mir direkt auf WhatsApp.
              </span>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:shadow-[#25D366]/30"
            >
              <WhatsAppIcon className="h-4 w-4 fill-white" />
              Direkt auf WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-8 py-8 sm:px-10">
        {/* Step 0 — Behandlungen */}
        {step === 0 && (
          <div>
            <JaNeinFrage
              label="Bestehen derzeit laufende Zahnbehandlungen?"
              value={data.laufende_behandlungen}
              onChange={(v) => setData({ ...data, laufende_behandlungen: v })}
            />
            <JaNeinFrage
              label="Sind Behandlungen geplant oder angeraten?"
              value={data.geplante_behandlungen}
              onChange={(v) => setData({ ...data, geplante_behandlungen: v })}
            />
            <JaNeinFrage
              label="Wurde ein Heil- und Kostenplan (HKP) erstellt?"
              value={data.hkp_erstellt}
              onChange={(v) => setData({ ...data, hkp_erstellt: v })}
            />
            <JaNeinFrage
              label="Sind bereits Behandlungen begonnen, aber noch nicht abgeschlossen?"
              value={data.behandlung_begonnen}
              onChange={(v) => setData({ ...data, behandlung_begonnen: v })}
            />
          </div>
        )}

        {/* Step 1 — Fehlende Zähne */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Wie viele Zähne fehlen aktuell? *
              </label>
              <Input
                placeholder="z.B. 0, 2, keine"
                value={data.fehlende_zaehne}
                onChange={(e) => setData({ ...data, fehlende_zaehne: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Sind fehlende Zähne bereits ersetzt? Wenn ja, wie?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Kronen", "Brücken", "Implantate", "Prothesen"].map((typ) => (
                  <label
                    key={typ}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      data.ersatz_typ.includes(typ)
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-slate-100 bg-slate-50/30 hover:border-accent/30"
                    }`}
                  >
                    <Checkbox
                      checked={data.ersatz_typ.includes(typ)}
                      onCheckedChange={() => toggleErsatzTyp(typ)}
                    />
                    <span className="text-sm font-medium text-foreground">{typ}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Seit wann fehlen die Zähne?
              </label>
              <Input
                placeholder="z.B. seit 3 Jahren, seit Kindheit"
                value={data.fehlend_seit}
                onChange={(e) => setData({ ...data, fehlend_seit: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Zahnfleisch & Kiefer */}
        {step === 2 && (
          <div>
            <JaNeinFrage
              label="Wurde in den letzten 2–5 Jahren eine Parodontitis behandelt?"
              value={data.parodontitis_behandelt}
              onChange={(v) => setData({ ...data, parodontitis_behandelt: v })}
            />
            <JaNeinFrage
              label="Besteht aktuell eine Zahnfleischerkrankung?"
              value={data.zahnfleischerkrankung}
              onChange={(v) => setData({ ...data, zahnfleischerkrankung: v })}
            />
            <JaNeinFrage
              label="Besteht bereits eine Zahn- oder Kieferfehlstellung?"
              value={data.kieferfehlstellung}
              onChange={(v) => setData({ ...data, kieferfehlstellung: v })}
            />
            <JaNeinFrage
              label="Wurde eine kieferorthopädische Behandlung angeraten?"
              value={data.kfo_angeraten}
              onChange={(v) => setData({ ...data, kfo_angeraten: v })}
            />
          </div>
        )}

        {/* Step 3 — Kontakt */}
        {step === 3 && (
          <div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Vollständiger Name *
                </label>
                <Input
                  placeholder="Max Mustermann"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Telefonnummer *
                </label>
                <Input
                  type="tel"
                  placeholder="+49 151 1234567"
                  value={data.telnr}
                  onChange={(e) => setData({ ...data, telnr: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  E-Mail-Adresse
                </label>
                <Input
                  type="email"
                  placeholder="max@beispiel.de"
                  value={data.mail}
                  onChange={(e) => setData({ ...data, mail: e.target.value })}
                />
              </div>
              <div className="rounded-xl border-2 border-slate-100 bg-slate-50/30 p-5">
                <JaNeinFrage
                  label="Dürfen wir Sie per WhatsApp kontaktieren?"
                  value={data.einverstaendnis}
                  onChange={(v) => setData({ ...data, einverstaendnis: v })}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Bei „Ja" erhalten Sie eine kurze, persönliche Nachricht auf WhatsApp.
                  Bei „Nein" kontaktieren wir Sie per E-Mail (bitte dann oben E-Mail angeben).
                </p>
                {data.einverstaendnis === "nein" && !emailLooksValid(data.mail) && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    Bitte geben Sie eine gültige E-Mail-Adresse an, damit wir Sie erreichen können.
                  </p>
                )}
                {data.mail.trim() !== "" && !emailLooksValid(data.mail) && data.einverstaendnis !== "nein" && (
                  <p className="mt-2 text-xs font-medium text-destructive">
                    Die E-Mail-Adresse scheint ungültig zu sein.
                  </p>
                )}
              </div>

              {/* Pflicht-Einwilligung in Verarbeitung der Gesundheitsdaten
                  nach Art. 9 Abs. 2 lit. a DSGVO. Ohne diese Einwilligung
                  dürfen wir die Anamnese-Antworten gar nicht verarbeiten. */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-100 bg-slate-50/30 p-5">
                <Checkbox
                  className="mt-0.5"
                  checked={data.gesundheitsdaten_einwilligung}
                  onCheckedChange={(c) =>
                    setData({ ...data, gesundheitsdaten_einwilligung: c === true })
                  }
                />
                <span className="text-xs leading-relaxed text-slate-500">
                  Ich willige ausdrücklich ein, dass meine Angaben zur zahnmedizinischen
                  Situation (besondere Kategorien personenbezogener Daten gemäß Art.&nbsp;9
                  DSGVO) verarbeitet werden, um mir ein passendes Angebot für eine
                  Zahnzusatzversicherung erstellen zu können. Ich kann diese Einwilligung
                  jederzeit mit Wirkung für die Zukunft widerrufen. Weitere Informationen
                  in der{" "}
                  <a
                    href="/datenschutz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Datenschutzerklärung
                  </a>
                  .
                </span>
              </label>
            </div>
            {error && (
              <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-8">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="text-sm font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-primary disabled:opacity-30"
          >
            Zurück
          </button>
          <Button
            onClick={handleNext}
            disabled={!canNext() || submitting}
            className="group flex h-14 min-w-[180px] cursor-pointer items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-bold tracking-wide text-white transition-all hover:bg-slate-800 hover:shadow-xl"
          >
            {submitting
              ? "Wird gesendet..."
              : step === TOTAL_STEPS - 1
                ? "Absenden"
                : "Nächster Schritt"}
            {!submitting && (
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
