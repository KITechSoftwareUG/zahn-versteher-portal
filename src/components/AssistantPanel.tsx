interface AssistantPanelProps {
  currentStep: number;
  totalSteps: number;
}

const stepInfo: Record<number, { title: string; explanation: string }> = {
  0: {
    title: "Warum ist das wichtig?",
    explanation:
      "Ihr aktueller Status hilft uns, Tarife ohne Wartezeiten oder mit sofortiger Kostenübernahme zu finden.",
  },
  1: {
    title: "Warum ist das wichtig?",
    explanation:
      "Je nach gewünschten Leistungen können wir Tarife mit passendem Deckungsumfang identifizieren.",
  },
  2: {
    title: "Fast geschafft!",
    explanation:
      "Mit Ihren Kontaktdaten erstellen wir Ihr persönliches Angebot und melden uns zeitnah bei Ihnen.",
  },
};

const AssistantPanel = ({ currentStep }: AssistantPanelProps) => {
  const info = stepInfo[currentStep] || stepInfo[0];

  return (
    <>
      {/* Context explanation */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary">auto_awesome</span>
          </div>
          <h4 className="font-display text-sm font-bold text-foreground">{info.title}</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{info.explanation}</p>
      </div>

      {/* Privacy note */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <span className="material-symbols-outlined text-xl text-muted-foreground">shield_person</span>
          </div>
          <h4 className="font-display text-sm font-bold text-foreground">Maximale Sicherheit</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ihre Daten sind bei uns in guten Händen – verschlüsselt und nach deutschem DSGVO-Standard.
        </p>
      </div>
    </>
  );
};

export default AssistantPanel;
