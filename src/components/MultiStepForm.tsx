import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import AssistantPanel from "@/components/AssistantPanel";

interface FormData {
  zahnzustand: string;
  leistungen: string[];
  name: string;
  email: string;
  telefon: string;
}

const TOTAL_STEPS = 3;

const MultiStepForm = () => {
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

  const canNext = () => {
    if (step === 0) return data.zahnzustand !== "";
    if (step === 1) return data.leistungen.length > 0;
    if (step === 2) return data.name !== "" && data.email !== "";
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
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
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <span className="material-symbols-outlined mb-4 text-5xl text-accent-teal">check_circle</span>
        <h3 className="mb-2 text-2xl font-bold text-foreground">Vielen Dank, {data.name}!</h3>
        <p className="text-muted-foreground">
          Ihre Angaben sind eingegangen. Wir erstellen Ihr persönliches Angebot und melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
      </div>
    );
  }

  const zahnOptionen = [
    {
      value: "hervorragend",
      label: "Hervorragend",
      desc: "Lückenloses Gebiss, keine laufenden Behandlungen.",
    },
    {
      value: "gepflegt",
      label: "Gepflegt mit kleinen Makeln",
      desc: "Einzelne Lücken oder bestehende Füllungen.",
    },
    {
      value: "behandlungsbedarf",
      label: "Akuter Behandlungsbedarf",
      desc: "Anstehende Zahnersatz-Maßnahmen oder Kieferorthopädie.",
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
    <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Ihre Konfiguration</span>
            <span>
              Schritt {step + 1} von {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Step 0: Zahnzustand */}
        {step === 0 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
              Wie beschreiben Sie Ihren aktuellen Zahnzustand?
            </h3>
            <p className="mb-5 text-sm text-muted-foreground">
              Wählen Sie die zutreffende Kategorie für eine präzise Einschätzung.
            </p>
            <div className="space-y-3">
              {zahnOptionen.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData({ ...data, zahnzustand: opt.value })}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    data.zahnzustand === opt.value
                      ? "border-accent-teal bg-accent-teal/5 ring-1 ring-accent-teal"
                      : "border-border hover:border-accent-gold/50"
                  }`}
                >
                  <span className="font-semibold text-foreground">{opt.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Leistungen */}
        {step === 1 && (
          <div>
            <h3 className="mb-1 text-lg font-bold text-foreground">
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
                      ? "border-accent-teal bg-accent-teal/5 ring-1 ring-accent-teal"
                      : "border-border hover:border-accent-gold/50"
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
            <h3 className="mb-1 text-lg font-bold text-foreground">
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
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            Zurück
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canNext()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === TOTAL_STEPS - 1 ? "Angebot anfordern" : "Nächster Schritt"}
            <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
          </Button>
        </div>
      </div>

      {/* Assistant Panel */}
      <div className="hidden lg:block">
        <AssistantPanel currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>
    </div>
  );
};

export default MultiStepForm;
