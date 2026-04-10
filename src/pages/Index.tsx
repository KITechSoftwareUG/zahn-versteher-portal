import MultiStepForm from "@/components/MultiStepForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import portraitImg from "@/assets/vermittler-portrait.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-accent-teal">dentistry</span>
            <span className="font-heading text-lg font-bold text-foreground">
              Zahnzusatz<span className="text-accent-gold">Experte</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#vorteile" className="transition-colors hover:text-foreground">Vorteile</a>
            <a href="#formular" className="transition-colors hover:text-foreground">Experten-Check</a>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <a
            href="#formular"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Gratis Beratung
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[400px,1fr] lg:gap-16">
          {/* Left: Vermittler */}
          <div className="text-center lg:sticky lg:top-24 lg:text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent-gold">
              Ihr Berater
            </p>
            <div className="mx-auto mb-6 h-64 w-64 overflow-hidden rounded-2xl border border-border shadow-md lg:mx-0">
              <img
                src={portraitImg}
                alt="Thomas Weber – Versicherungsexperte"
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">Thomas Weber</h2>
            <p className="mt-1 text-sm text-muted-foreground">Unabhängiger Versicherungsmakler</p>

            {/* Stats */}
            <div className="mt-6 flex justify-center gap-6 lg:justify-start">
              <div className="text-center">
                <span className="material-symbols-outlined mb-1 text-2xl text-accent-gold">verified</span>
                <p className="text-2xl font-bold text-foreground">10+</p>
                <p className="text-xs text-muted-foreground">Jahre Expertise</p>
              </div>
              <div className="text-center">
                <span className="material-symbols-outlined mb-1 text-2xl text-accent-gold">groups</span>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Klienten</p>
              </div>
            </div>

            {/* Headline */}
            <div className="mt-8 hidden lg:block">
              <h1 className="font-heading text-3xl font-extrabold leading-tight text-foreground xl:text-4xl">
                Exzellenter Schutz{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--accent-teal))] to-[hsl(var(--accent-gold))] bg-clip-text text-transparent">
                  für Ihr Lächeln.
                </span>
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Maßgeschneiderte Absicherung durch unabhängige Expertise. Wir finden den Tarif, der wirklich zu Ihrer Zahngesundheit passt.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div id="formular">
            {/* Mobile headline */}
            <div className="mb-8 lg:hidden">
              <h1 className="font-heading text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Exzellenter Schutz{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--accent-teal))] to-[hsl(var(--accent-gold))] bg-clip-text text-transparent">
                  für Ihr Lächeln.
                </span>
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Maßgeschneiderte Absicherung durch unabhängige Expertise.
              </p>
            </div>
            <MultiStepForm />
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section id="vorteile" className="border-t border-border bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground">
            Warum <span className="text-accent-gold">Zahnzusatz-Experte</span>?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "balance", title: "100% Unabhängig", desc: "Kein Vertrieb für einzelne Versicherer – echte Marktübersicht." },
              { icon: "payments", title: "Kostenlose Beratung", desc: "Keine versteckten Gebühren, kein Kleingedrucktes." },
              { icon: "handshake", title: "Persönlich & Individuell", desc: "Jedes Angebot wird auf Ihre Situation zugeschnitten." },
              { icon: "bolt", title: "Schnell & Unkompliziert", desc: "Angebot innerhalb von 24 Stunden nach Anfrage." },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="material-symbols-outlined mb-3 text-3xl text-accent-teal">{v.icon}</span>
                <h3 className="mb-1 font-heading text-base font-bold text-foreground">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-10 font-heading text-2xl font-bold text-foreground">So funktioniert&apos;s</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", icon: "edit_note", title: "Formular ausfüllen", desc: "Beantworten Sie wenige Fragen zu Ihrem Bedarf." },
              { step: "2", icon: "mark_email_read", title: "Angebot erhalten", desc: "Innerhalb von 24h erhalten Sie ein individuelles Angebot." },
              { step: "3", icon: "support_agent", title: "Beratungsgespräch", desc: "Optional: Klären Sie offene Fragen persönlich." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-teal/10">
                  <span className="material-symbols-outlined text-2xl text-accent-teal">{s.icon}</span>
                </div>
                <h3 className="mb-1 font-heading text-sm font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-muted/50 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground">
            Häufige Fragen
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: "Ist die Beratung wirklich kostenlos?", a: "Ja, die Erstberatung und das individuelle Angebot sind für Sie komplett kostenfrei und unverbindlich." },
              { q: "Wie unabhängig ist die Empfehlung?", a: "Wir sind an keinen Versicherer gebunden und vergleichen über 30 Anbieter, um den besten Tarif für Sie zu finden." },
              { q: "Wie schnell erhalte ich mein Angebot?", a: "In der Regel innerhalb von 24 Stunden nach Absenden Ihrer Anfrage." },
              { q: "Werden meine Daten sicher behandelt?", a: "Selbstverständlich. Alle Daten werden SSL-verschlüsselt übertragen und gemäß DSGVO verarbeitet." },
              { q: "Muss ich mich nach dem Angebot verpflichten?", a: "Nein. Das Angebot ist unverbindlich. Sie entscheiden in Ruhe, ob der vorgeschlagene Tarif zu Ihnen passt." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-accent-gold">copyright</span>
            <span>2024 Zahnzusatz-Experte | Beratung in Premium-Qualität</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Impressum</a>
            <a href="#" className="hover:text-foreground">Datenschutz</a>
            <a href="#" className="hover:text-foreground">Konditionen</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
