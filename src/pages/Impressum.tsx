import LegalLayout from "@/components/LegalLayout";

/**
 * Impressum-Platzhalter. Der rechtssichere Text wird vom Kunden geliefert
 * und hier eingefügt. Aufbau nach § 5 TMG und § 55 RStV.
 */
const Impressum = () => {
  return (
    <LegalLayout title="Impressum">
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Hinweis:</strong> Dieser Text ist ein Platzhalter.
        Der rechtssichere Impressums-Text wird hier vom Betreiber eingesetzt.
      </div>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        Alexander Fürtbauer
        <br />
        ExpatVantage
        <br />
        {"[Straße Hausnummer]"}
        <br />
        {"[PLZ Ort]"}
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: {"[+49 ...]"}
        <br />
        E-Mail: {"[info@expatvantage.de]"}
        <br />
        Website: <a href="https://expatvantage.de" target="_blank" rel="noopener noreferrer">expatvantage.de</a>
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: {"[DE ...]"}</p>

      <h2>Aufsichtsbehörde</h2>
      <p>{"[zuständige IHK / Aufsichtsbehörde für Versicherungsvermittler nach § 34d GewO]"}</p>

      <h2>Berufsrechtliche Regelungen</h2>
      <p>
        {"[Versicherungsvermittler gemäß § 34d Abs. 1 GewO, Vermittlerregister-Nummer, Zuständige Kammer, etc.]"}
      </p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>Alexander Fürtbauer</p>

      <h2>Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalLayout>
  );
};

export default Impressum;
