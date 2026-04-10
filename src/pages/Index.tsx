import MultiStepForm from "@/components/MultiStepForm";
import AssistantPanel from "@/components/AssistantPanel";
import portraitImg from "@/assets/vermittler-portrait.png";
import { useState } from "react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel rounded-none">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">dentistry</span>
            <span className="font-display text-lg font-bold text-foreground">
              Zahnzusatz-Experte
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#vorteile" className="transition-colors hover:text-foreground">Vorteile</a>
            <a href="#ueber-mich" className="transition-colors hover:text-foreground">Über mich</a>
            <a href="#faq" className="transition-colors hover:text-foreground">Ratgeber</a>
          </nav>
          <a
            href="#formular"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            Gratis Beratung
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[420px,1fr] lg:gap-16">
          {/* Left: Broker Card */}
          <div className="lg:sticky lg:top-24">
            {/* Portrait Card */}
            <div className="relative mb-8 overflow-hidden rounded-2xl shadow-xl">
              <img
                src={portraitImg}
                alt="Thomas Weber – Versicherungsexperte"
                className="h-[420px] w-full object-cover"
              />
              <div className="broker-card-gradient absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  Ihr persönlicher Berater
                </p>
                <h2 className="font-display text-xl font-bold text-white">Thomas Weber</h2>
                <p className="mt-0.5 text-sm text-white/80">Experte für ganzheitlichen Zahnschutz</p>
              </div>
            </div>

            {/* Headline */}
            <div className="hidden lg:block">
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground xl:text-[2.75rem]">
                Ihr Lächeln{" "}
                <br />
                verdient den{" "}
                <br />
                <span className="text-primary">besten Schutz.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Gemeinsam finden wir die Absicherung, die wirklich zu Ihnen passt. Seit über einem Jahrzehnt begleite ich meine Kunden unabhängig und menschlich zu ihrem perfekten Tarif.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div id="formular">
            {/* Mobile headline */}
            <div className="mb-8 lg:hidden">
              <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Ihr Lächeln verdient den{" "}
                <span className="text-primary">besten Schutz.</span>
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Gemeinsam finden wir die Absicherung, die wirklich zu Ihnen passt.
              </p>
            </div>
            <MultiStepForm onStepChange={setCurrentStep} />
          </div>
        </div>

        {/* Bottom row: Stats + Assistant Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stats */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">verified</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expertise</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">10+ Jahre</p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">favorite</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vertrauen</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">500+ Kunden</p>
          </div>

          {/* Assistant Cards */}
          <AssistantPanel currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">copyright</span>
            <span>2024 Zahnzusatz-Experte Thomas Weber — Persönlich. Ehrlich. Unabhängig.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-primary hover:underline">Impressum</a>
            <a href="#" className="text-primary hover:underline">Datenschutz</a>
            <a href="#" className="text-primary hover:underline">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
