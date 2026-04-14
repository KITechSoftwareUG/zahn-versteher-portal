import LegalLayout from "@/components/LegalLayout";

/**
 * Datenschutz-Platzhalter. Der rechtssichere Text wird vom Kunden geliefert
 * und hier eingefügt. Aufbau nach DSGVO Art. 13/14.
 */
const Datenschutz = () => {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Hinweis:</strong> Dieser Text ist ein Platzhalter.
        Die rechtssichere Datenschutzerklärung wird hier vom Betreiber eingesetzt.
      </div>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        <br />
        Alexander Fürtbauer, ExpatVantage
        <br />
        {"[Anschrift, Kontaktdaten aus Impressum]"}
      </p>

      <h2>2. Welche Daten wir erheben</h2>
      <p>
        Wenn Sie unser Formular auf dieser Seite ausfüllen, erheben wir folgende Daten:
      </p>
      <ul>
        <li>Vollständiger Name</li>
        <li>Telefonnummer</li>
        <li>E-Mail-Adresse (optional)</li>
        <li>Angaben zu Ihrer zahnmedizinischen Situation (laufende Behandlungen, fehlende Zähne, Zahnfleischerkrankungen etc.)</li>
        <li>Ihre Einwilligung zur WhatsApp-Kontaktaufnahme (ja/nein)</li>
        <li>Zeitpunkt Ihrer Anfrage</li>
      </ul>

      <h2>3. Zweck der Datenverarbeitung</h2>
      <p>
        Wir verwenden Ihre Daten ausschließlich, um Ihre Anfrage zur
        Zahnzusatzversicherung zu bearbeiten und Ihnen ein unverbindliches Angebot
        zu unterbreiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
        (Vertragsanbahnung).
      </p>

      <h2>4. Weitergabe an Dritte</h2>
      <p>
        Ihre Daten werden nicht an Dritte weitergegeben, außer soweit dies zur
        Durchführung der Beratung erforderlich ist (z.B. Versicherungsgesellschaften
        zur Tarifberechnung, und nur mit Ihrer expliziten Einwilligung).
      </p>

      <h2>5. Verwendete Dienste</h2>
      <h3>WhatsApp (Meta Platforms Ireland Ltd.)</h3>
      <p>
        Wenn Sie sich für die WhatsApp-Kontaktaufnahme entscheiden, wird Meta
        Platforms Ireland Ltd. Ihre Telefonnummer zum Zweck der Nachrichtenzustellung
        verarbeiten. Details dazu finden Sie in der{" "}
        <a href="https://www.whatsapp.com/legal/business-policy" target="_blank" rel="noopener noreferrer">
          WhatsApp Business Policy
        </a>
        .
      </p>
      <h3>Anthropic (Claude AI)</h3>
      <p>
        Zur Erstellung personalisierter Antworten nutzen wir das Large-Language-Model
        Claude von Anthropic. Hierbei werden Ihr Vorname und Ihre zahnmedizinischen
        Angaben (nicht jedoch Telefonnummer oder E-Mail-Adresse) an Anthropic
        übermittelt. Rechtsgrundlage ist unser berechtigtes Interesse an einer
        qualitativ hochwertigen Erstansprache (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>6. Speicherdauer</h2>
      <p>
        Ihre Angaben speichern wir so lange, wie für die Bearbeitung Ihrer Anfrage
        und eventuell folgende Vertragsabwicklung erforderlich, maximal jedoch
        {" [z.B. 3 Jahre gemäß Verjährungsfrist]"}. Auf Wunsch löschen wir Ihre
        Daten früher.
      </p>

      <h2>7. Ihre Rechte</h2>
      <p>Sie haben nach der DSGVO das Recht auf:</p>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde</li>
      </ul>

      <h2>8. Kontakt für Datenschutzanliegen</h2>
      <p>
        Für Fragen zum Datenschutz erreichen Sie uns unter:{" "}
        {"[datenschutz@expatvantage.de]"}
      </p>
    </LegalLayout>
  );
};

export default Datenschutz;
