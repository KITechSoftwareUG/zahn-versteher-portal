import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  zahnzustand: string;
  leistungen: string[];
  name: string;
  email: string;
  telefon: string;
}

const TOTAL_STEPS = 3;

interface MultiStepFormProps {
  onStepChange?: (step: number) => void;
}

const MultiStepForm = ({ onStepChange }: MultiStepFormProps) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<FormData>({
    zahnzustand: "",
    leistungen: [],
    name: "",
    email: "",
    telefon: "",
  });

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const updateStep = (newStep: number) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const canNext = () => {
    if (step === 0) return data.zahnzustand !== "";
    if (step === 1) return data.leistungen.length > 0;
    if (step === 2) return data.name !== "" && data.email !== "";
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) updateStep(step + 1);
    else setSubmitted(true);
  };

  const handleBack = () => {
    if (step > 0) updateStep(step - 1);
  };

  const toggleLeistung = (l: string) => {
    setData((d) => ({
      ...d,
      leistungen: d.leistungen.includes(l)
        ? d.leistungen.filter((x) => x !== l)
        : [...d.leistungen, l],
    }));
  };

  if (submitted) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-primary">check_circle</span>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">Vielen Dank, {data.name}!</h3>
        <p className="text-muted-foreground">
          Ihre Angaben sind eingegangen. Wir erstellen Ihr persönliches Angebot und melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
      </div>
    );
  }

  const stepTitles = ["Ihre Situation verstehen", "Gewünschte Leistungen", "Kontaktdaten"];

  const zahnOptionen = [
    {
      value: "hervorragend",
      label: "Alles im grünen Bereich",
      desc: "Keine fehlenden Zähne, regelmäßige Vorsorge.",
    },
    {
      value: "gepflegt",
      label: "Kleinerer Handlungsbedarf",
      desc: "1–2 Lücken oder älterer Zahnersatz vorhanden.",
    },
    {
      value: "behandlungsbedarf",
      label: "Aktuelle Behandlung",
      desc: "Der Zahnarzt hat bereits Pläne für die Zukunft.",
    },
  ];

  const leistungenOptionen = [
    "Zahnersatz (Kronen, Brücken)",
    "Implantate",
    "Professionelle Zahnreinigung",
    "Kieferorthopädie",
    "Hochwertige Füllungen",
    "Wurzelbehandlungen",
  ];

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      {/* Header with warm background */}
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
          <span>Nur noch ca. 60 Sekunden bis zu Ihrem Vergleich</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6 sm:px-8">
        {/* Step 0: Zahnzustand */}
        {step === 0 && (
          <div>
            <h3 className="mb-1 font-display text-lg font-bold text-foreground">
              Wie steht es aktuell um Ihr Lächeln?
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Um Ihnen die passendsten Tarife anzuzeigen, benötigen wir eine ehrliche Selbsteinschätzung.
            </p>
            <div className="space-y-3">
              {zahnOptionen.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData({ ...data, zahnzustand: opt.value })}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    data.zahnzustand === opt.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    data.zahnzustand === opt.value
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  }`}>
                    {data.zahnzustand === opt.value && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{opt.label}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Leistungen */}
        {step === 1 && (
          <div>
            <h3 className="mb-1 font-display text-lg font-bold text-foreground">
              Welche Leistungen sind Ihnen wichtig?
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Wählen Sie alle Bereiche aus, die für Sie relevant sind.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {leistungenOptionen.map((l) => (
                <label
                  key={l}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    data.leistungen.includes(l)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    checked={data.leistungen.includes(l)}
                    onCheckedChange={() => toggleLeistung(l)}
                  />
                  <span className="text-sm font-medium text-foreground">{l}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Kontakt */}
        {step === 2 && (
          <div>
            <h3 className="mb-1 font-display text-lg font-bold text-foreground">
              Ihre Kontaktdaten für das Angebot
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Auf Basis Ihrer Angaben erstellen wir ein persönliches Angebot.
            </p>
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
                  E-Mail-Adresse *
                </label>
                <Input
                  type="email"
                  placeholder="max@beispiel.de"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Telefon (optional)
                </label>
                <Input
                  type="tel"
                  placeholder="+49 123 456789"
                  value={data.telefon}
                  onChange={(e) => setData({ ...data, telefon: e.target.value })}
                />
              </div>
            </div>
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
            disabled={!canNext()}
            size="lg"
            className="rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            {step === TOTAL_STEPS - 1 ? "Angebot anfordern" : "Weiter"}
            <span className="material-symbols-outlined ml-1 text-lg">east</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
