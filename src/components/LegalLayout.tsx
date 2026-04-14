import { Link } from "react-router-dom";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Wrapper für juristische Unterseiten (Impressum, Datenschutz, AGB).
 * Hält Header + Footer konsistent zur Landingpage, damit der User
 * das Branding nicht verliert wenn er auf eine Legal-Seite springt.
 */
const LegalLayout = ({ title, children }: LegalLayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel rounded-none">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">health_and_safety</span>
            <span className="font-display text-lg font-bold text-foreground">
              Expat<span className="gradient-text">Vantage</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          {title}
        </h1>
        <div className="prose prose-slate max-w-none text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-3 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">copyright</span>
            <span>2024 ExpatVantage · Alexander Fürtbauer</span>
          </div>
          <div className="flex gap-4">
            <Link to="/impressum" className="text-primary hover:underline">Impressum</Link>
            <Link to="/datenschutz" className="text-primary hover:underline">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
