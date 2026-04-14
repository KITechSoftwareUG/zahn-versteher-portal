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
      const payload = {
        ...data,
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
      <div className="glass-panel rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-primary">check_circle</span>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">
          Vielen Dank, {data.name}!
        </h3>
        <p className="text-muted-foreground">
          Ihre Angaben sind eingegangen. Auf Basis Ihrer zahnmedizinischen Situation
          erstelle ich Ihnen ein persönliches Angebot für die passende
          Zahnzusatzversicherung und melde mich
          {data.einverstaendnis === "ja" ? " per WhatsApp" : " per E-Mail"} bei Ihnen.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
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
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex gap-3">
        {["ja", "nein"].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`rounded-xl border px-6 py-2.5 text-sm font-medium transition-all ${
              value === v
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-border text-muted-foreground hover:border-primary/30"
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
    <div className="glass-panel overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="bg-[hsl(var(--warm-accent))] px-6 py-5 sm:px-8">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Schritt {step + 1} von {TOTAL_STEPS}</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        <h3 className="font-display text-base font-bold text-foreground">
          {stepTitles[step]}
        </h3>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="material-symbols-outlined text-sm">timer</span>
          <span>Nur noch ca. {Math.max(30, (TOTAL_STEPS - step) * 30)} Sekunden bis zu Ihrem persönlichen Angebot</span>
        </div>

        {/* Shortcut: direkt auf WhatsApp chatten — für alle die keine Lust
            haben das komplette Formular durchzugehen. Nur sichtbar wenn
            VITE_WHATSAPP_NUMBER gesetzt ist. */}
        {whatsappHref && (
          <div className="mt-4 flex flex-col items-stretch gap-2 rounded-xl border border-white/70 bg-white/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="flex items-start gap-2 text-xs text-muted-foreground sm:items-center">
              <span className="material-symbols-outlined text-base text-primary">forum</span>
              <span>
                <span className="font-semibold text-foreground">Keine Lust auf Fragen?</span>{" "}
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
      <div className="px-6 py-6 sm:px-8">
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
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                      data.ersatz_typ.includes(typ)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
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
              <div className="rounded-xl border border-border p-4">
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
            </div>
            {error && (
              <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Zurück
          </button>
          <Button
            onClick={handleNext}
            disabled={!canNext() || submitting}
            size="lg"
            className="rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            {submitting
              ? "Wird gesendet..."
              : step === TOTAL_STEPS - 1
                ? "Absenden"
                : "Weiter"}
            {!submitting && (
              <span className="material-symbols-outlined ml-1 text-lg">east</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
