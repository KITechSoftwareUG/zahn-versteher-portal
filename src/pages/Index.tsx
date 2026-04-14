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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-center border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur-md md:px-10 lg:px-20">
        <div className="flex max-w-[1280px] flex-1 items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">dentistry</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">
              Expat<span className="accent-text">Vantage</span>
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end gap-8">
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#vorteile" className="text-sm font-semibold text-slate-500 transition-colors hover:text-accent">Vorteile</a>
              <a href="#ueber-mich" className="text-sm font-semibold text-slate-500 transition-colors hover:text-accent">Über mich</a>
              <a href="#faq" className="text-sm font-semibold text-slate-500 transition-colors hover:text-accent">Ratgeber</a>
            </nav>
            <a
              {...ctaProps}
              className="flex h-11 min-w-[140px] cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-slate-800"
            >
              Gratis Beratung
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 justify-center px-4 py-12 md:px-10 lg:px-20 lg:py-20">
        <div className="flex max-w-[1280px] flex-1 flex-col">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Broker + Headline + Stats */}
            <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:col-span-5">
              {/* Portrait with floating broker card */}
              <div className="relative">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-2xl ring-1 ring-slate-200/50">
                  <img
                    src={portraitImg}
                    alt="Alexander Fürtbauer – Finanzberater bei ExpatVantage"
                    className="h-full w-full object-cover contrast-[1.05] grayscale-[0.2] transition-all duration-700 hover:grayscale-0"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 right-6 rounded-xl border border-slate-100 bg-white p-6 shadow-xl md:left-auto md:-right-8 md:w-72">
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    Ihr Berater
                  </p>
                  <p className="text-2xl font-bold text-primary">Alexander Fürtbauer</p>
                  <p className="text-sm font-medium text-slate-500">Finanzberater · ExpatVantage</p>
                </div>
              </div>

              {/* Headline */}
              <div className="mt-6 flex flex-col gap-6">
                <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-primary md:text-5xl">
                  Exzellenter Schutz
                  <br />
                  <span className="accent-italic">für Ihr Lächeln.</span>
                </h2>
                <p className="max-w-lg text-lg leading-relaxed text-slate-500">
                  Maßgeschneiderte Absicherung durch unabhängige Expertise. Ich finde für Sie die
                  Zahnzusatzversicherung, die wirklich zu Ihrer Situation passt – auch als Expat in Deutschland.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4 border-r border-slate-200 py-3 pr-8">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none text-primary">10+</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Jahre Expertise
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">handshake</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none text-primary">100%</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Unabhängig
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form + Assistant cards */}
            <div className="flex flex-col gap-6 lg:col-span-7" id="formular">
              <MultiStepForm onStepChange={setCurrentStep} />
              <AssistantPanel currentStep={currentStep} totalSteps={totalSteps} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-4 py-12 md:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-lg">copyright</span>
            <span className="text-xs font-medium uppercase tracking-wider">
              2024 ExpatVantage · Alexander Fürtbauer — Finanzberatung für Expats
            </span>
          </div>
          <div className="flex gap-8">
            <a
              href="https://expatvantage.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-accent"
            >
              expatvantage.de
            </a>
            <Link
              to="/impressum"
              className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-accent"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-accent"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp-Button (nur sichtbar wenn VITE_WHATSAPP_NUMBER gesetzt) */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
