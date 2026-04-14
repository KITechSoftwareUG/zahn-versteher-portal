import MultiStepForm from "@/components/MultiStepForm";
import AssistantPanel from "@/components/AssistantPanel";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Link } from "react-router-dom";
// HINWEIS: Dieses Bild zeigt aktuell noch den alten Platzhalter. Bitte durch
// ein echtes Foto von Alexander Fürtbauer ersetzen (gleicher Pfad/Dateiname).
import portraitImg from "@/assets/vermittler-portrait.png";
import { useState } from "react";

// Wenn VITE_CALENDLY_URL gesetzt ist, öffnen die "Kostenlose Erstberatung"-
// Buttons Calendly in einem neuen Tab. Sonst scrollen sie zum Formular.
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || "";

const ctaProps = CALENDLY_URL
  ? { href: CALENDLY_URL, target: "_blank", rel: "noopener noreferrer" as const }
  : { href: "#formular" };

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel rounded-none">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">health_and_safety</span>
            <span className="font-display text-lg font-bold text-foreground">
              Expat<span className="gradient-text">Vantage</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#vorteile" className="transition-colors hover:text-foreground">Vorteile</a>
            <a href="#ueber-mich" className="transition-colors hover:text-foreground">Über mich</a>
            <a href="#faq" className="transition-colors hover:text-foreground">Ratgeber</a>
          </nav>
          <a
            {...ctaProps}
            className="rounded-full gradient-btn px-5 py-2 text-sm font-semibold"
          >
            Kostenlose Erstberatung
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
                alt="Alexander Fürtbauer – Finanzberater bei ExpatVantage"
                className="h-[420px] w-full object-cover"
              />
              <div className="broker-card-gradient absolute inset-0" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  Ihr persönlicher Berater
                </p>
                <h2 className="font-display text-xl font-bold text-white">Alexander Fürtbauer</h2>
                <p className="mt-0.5 text-sm text-white/80">Finanzberater · ExpatVantage</p>
              </div>
            </div>

            {/* Headline */}
            <div className="hidden lg:block">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                Zahnzusatzversicherung
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground xl:text-[2.6rem]">
                Zahnersatz kostet bis zu{" "}
                <span className="gradient-text">6.000 €</span>
                <br />
                – die Kasse zahlt nur einen Bruchteil.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Ich finde für Sie die passende Zahnzusatzversicherung – unabhängig,
                ohne Verkaufsdruck und auch dann, wenn Sie als Expat erst seit
                Kurzem in Deutschland leben. In 60 Sekunden zum persönlichen Angebot.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div id="formular">
            {/* Mobile headline */}
            <div className="mb-8 lg:hidden">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                Zahnzusatzversicherung
              </p>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Zahnersatz kostet bis zu{" "}
                <span className="gradient-text">6.000 €</span> – die Kasse zahlt nur einen Bruchteil.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                In 60 Sekunden zum unverbindlichen Angebot – unabhängig und ohne Verkaufsdruck.
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
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Erfahrung</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">10+ Jahre</p>
            <p className="mt-1 text-xs text-muted-foreground">in der deutschen Finanz- und Versicherungsbranche</p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">handshake</span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unabhängig</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">100 % objektiv</p>
            <p className="mt-1 text-xs text-muted-foreground">kein Verkaufsdruck, kein Provisions-Bias</p>
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
            <span>2024 ExpatVantage · Alexander Fürtbauer — Finanzberatung für Expats in Deutschland</span>
          </div>
          <div className="flex gap-4">
            <a href="https://expatvantage.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">expatvantage.de</a>
            <Link to="/impressum" className="text-primary hover:underline">Impressum</Link>
            <Link to="/datenschutz" className="text-primary hover:underline">Datenschutz</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp-Button (nur sichtbar wenn VITE_WHATSAPP_NUMBER gesetzt) */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
