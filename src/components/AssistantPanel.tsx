interface AssistantPanelProps {
  currentStep: number;
  totalSteps: number;
}

const stepInfo: Record<number, { title: string; explanation: string }> = {
  0: {
    title: "Warum wir das fragen",
    explanation:
      "Aktuelle und geplante Behandlungen entscheiden über Wartezeiten und Sofort­leistungen. Mit diesen Angaben finde ich Tarife, die wirklich zu Ihrer Situation passen.",
  },
  1: {
    title: "Fehlende Zähne richtig einordnen",
    explanation:
      "Bei fehlenden Zähnen prüfen Versicherer, ob es sich um eine fortbestehende Lücke handelt. Das beeinflusst, welche Tarife für Sie überhaupt offen sind.",
  },
  2: {
    title: "Zahnfleisch & Kiefer im Blick",
    explanation:
      "Parodontitis und Zahnfehl­stellungen werden in vielen Tarifen explizit ausgeschlossen oder mit Wartezeiten belegt. Mit diesen Angaben filtern wir gezielt vor.",
  },
  3: {
    title: "Fast geschafft!",
    explanation:
      "Mit Ihren Kontaktdaten erstelle ich ein persönliches Angebot. Auf Wunsch melde ich mich per WhatsApp – schnell und unkompliziert.",
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
          Ihre Daten verlassen den deutschen Server nicht und werden nach DSGVO-Standard
          verschlüsselt verarbeitet. Keine Weitergabe an Dritte.
        </p>
      </div>
    </>
  );
};

export default AssistantPanel;
