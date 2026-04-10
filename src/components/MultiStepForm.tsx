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
    else setSubmitted(true);
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
      <div className="glass-panel rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-primary">check_circle</span>
        <h3 className="mb-2 font-display text-2xl font-bold text-foreground">Vielen Dank, {data.name}!</h3>
        <p className="text-muted-foreground">
          Ihre Angaben sind eingegangen. Wir erstellen Ihr persönliches Angebot und melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
      </div>
    );
  }

  const zahnOptionen = [
    {
      value: "hervorragend",
      label: "Alles im grünen Bereich",
      desc: "Keine fehlenden Zähne, regelmäßige Vorsorge.",
    },
    {
      value: "gepflegt",
      label: "Kleinerer Handlungsbedarf",
      desc: "1-2 Lücken oder älterer Zahnersatz vorhanden.",
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
    <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
      {/* Form */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              Schritt {step + 1} von {TOTAL_STEPS}
            </span>
          </div>
          <h3 className="mb-3 font-display text-lg font-bold text-foreground">
            {step === 0 && "Ihre Situation verstehen"}
            {step === 1 && "Gewünschte Leistungen"}
            {step === 2 && "Kontaktdaten"}
          </h3>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Step 0: Zahnzustand */}
        {step === 0 && (
          <div>
            <h3 className="mb-1 font-display text-base font-semibold text-foreground">
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
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    data.zahnzustand === opt.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/30 hover:bg-primary/[0.02]"
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
            <h3 className="mb-1 font-display text-base font-semibold text-foreground">
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
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
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
            <h3 className="mb-1 font-display text-base font-semibold text-foreground">
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
            <span className="material-symbols-outlined mr-1 text-lg">arrow_back</span>
            Zurück
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canNext()}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            {step === TOTAL_STEPS - 1 ? "Angebot anfordern" : "Weiter"}
            <span className="material-symbols-outlined ml-1 text-lg">east</span>
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
