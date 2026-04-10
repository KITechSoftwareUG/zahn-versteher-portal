interface AssistantPanelProps {
  currentStep: number;
  totalSteps: number;
}

const stepInfo: Record<number, { title: string; explanation: string }> = {
  0: {
    title: "Warum diese Information?",
    explanation:
      "Ihr aktueller Zahnstatus ist entscheidend für die Tarifwahl und die Vermeidung von Wartezeiten.",
  },
  1: {
    title: "Warum diese Information?",
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
  const timeEstimate = remaining <= 1 ? "unter 1 Minute" : `ca. ${remaining} Minuten`;

  return (
    <div className="space-y-4">
      {/* Time estimate */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        <span className="material-symbols-outlined text-lg text-accent-gold">avg_time</span>
        <span>
          Nur noch <strong className="text-foreground">{timeEstimate}</strong> bis zum persönlichen Angebot
        </span>
      </div>

      {/* Context explanation */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-accent-teal">psychology</span>
          <h4 className="text-sm font-semibold text-foreground">{info.title}</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{info.explanation}</p>
      </div>

      {/* Privacy note */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-accent-teal">shield_person</span>
          <h4 className="text-sm font-semibold text-foreground">Diskretion garantiert</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ihre Daten werden nach höchsten Sicherheitsstandards verschlüsselt und absolut vertraulich behandelt.
        </p>
      </div>
    </div>
  );
};

export default AssistantPanel;
