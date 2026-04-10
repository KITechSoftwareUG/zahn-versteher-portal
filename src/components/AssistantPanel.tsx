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

const AssistantPanel = ({ currentStep, totalSteps }: AssistantPanelProps) => {
  const info = stepInfo[currentStep] || stepInfo[0];
  const remaining = totalSteps - currentStep - 1;
  const timeEstimate = remaining <= 1 ? "ca. 60 Sekunden" : `ca. ${remaining} Minuten`;

  return (
    <div className="space-y-4">
      {/* Time estimate */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <span className="material-symbols-outlined text-lg text-primary">timer</span>
        <span>
          Nur noch <strong className="text-foreground">{timeEstimate}</strong> bis zu Ihrem Vergleich
        </span>
      </div>

      {/* Context explanation */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">auto_awesome</span>
          <h4 className="text-sm font-semibold text-foreground">{info.title}</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{info.explanation}</p>
      </div>

      {/* Privacy note */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">shield_person</span>
          <h4 className="text-sm font-semibold text-foreground">Maximale Sicherheit</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ihre Daten sind bei uns in guten Händen – verschlüsselt und nach deutschem DSGVO-Standard.
        </p>
      </div>
    </div>
  );
};

export default AssistantPanel;
