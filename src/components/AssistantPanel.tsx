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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Context explanation — Deep Teal */}
      <div className="flex items-start gap-5 rounded-2xl border border-deep-teal/10 bg-deep-teal/5 p-7">
        <div className="rounded-xl bg-deep-teal p-2.5 text-white shadow-lg">
          <span className="material-symbols-outlined text-xl">psychology</span>
        </div>
        <div>
          <h4 className="mb-2 font-bold leading-tight text-primary">{info.title}</h4>
          <p className="text-sm leading-relaxed text-slate-500">{info.explanation}</p>
        </div>
      </div>

      {/* Privacy note — Neutral */}
      <div className="flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-7">
        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
          <span className="material-symbols-outlined text-xl">shield_person</span>
        </div>
        <div>
          <h4 className="mb-2 font-bold leading-tight text-primary">Diskretion garantiert</h4>
          <p className="text-sm leading-relaxed text-slate-500">
            Ihre Daten werden nach DSGVO-Standard verschlüsselt verarbeitet und nicht an
            Dritte weitergegeben.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;
