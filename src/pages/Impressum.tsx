import LegalLayout from "@/components/LegalLayout";

/**
 * Impressum nach § 5 TMG, § 18 Abs. 2 MStV und den gewerberechtlichen
 * Sondervorschriften für Versicherungsvermittler nach § 34d GewO.
 *
 * Stellen mit [ZU ERSETZEN] müssen vor Live-Schaltung mit den
 * tatsächlichen Daten von ExpatVantage befüllt werden. Der Inhalt
 * wurde nach aktuellem Stand der Pflichtangaben strukturiert,
 * sollte vor Live-Schaltung aber noch von einem Fachanwalt für
 * IT-/Wirtschaftsrecht freigegeben werden.
 */
const Impressum = () => {
  return (
    <LegalLayout title="Impressum">
      <p className="text-xs text-muted-foreground">
        Angaben gemäß § 5 Telemediengesetz (TMG) und § 18 Abs. 2 Medienstaatsvertrag (MStV).
      </p>

      <h2>Anbieter und Diensteanbieter</h2>
      <p>
        <strong>Alexander Fürtbauer</strong>
        <br />
        ExpatVantage <span className="text-muted-foreground">[Rechtsform ergänzen, z.B. „e.K.", „GmbH", „UG (haftungsbeschränkt)"]</span>
        <br />
        [Straße, Hausnummer]
        <br />
        [PLZ, Ort]
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: [+49&nbsp;…&nbsp;…]
        <br />
        E-Mail: <a href="mailto:info@expatvantage.de">info@expatvantage.de</a>
        <br />
        Internet: <a href="https://expatvantage.de" target="_blank" rel="noopener noreferrer">https://expatvantage.de</a>
      </p>

      <h2>Vertretungsberechtigt</h2>
      <p>
        Alexander Fürtbauer
        <br />
        <span className="text-xs text-muted-foreground">
          (bei juristischen Personen wie GmbH/UG: hier den/die Geschäftsführer:in eintragen)
        </span>
      </p>

      <h2>Handelsregister</h2>
      <p>
        Registergericht: [Amtsgericht …]
        <br />
        Registernummer: [HRB / HRA …]
        <br />
        <span className="text-xs text-muted-foreground">
          (entfällt bei Einzelunternehmen ohne Eintragung)
        </span>
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>
        USt-IdNr. nach § 27a Umsatzsteuergesetz: [DE&nbsp;…]
      </p>

      <h2>Berufsrechtliche Angaben (Versicherungsvermittlung)</h2>
      <p>
        <strong>Berufsbezeichnung:</strong> Versicherungsmakler mit Erlaubnis nach § 34d Abs. 1 Gewerbeordnung (GewO),
        verliehen in der Bundesrepublik Deutschland.
      </p>
      <p>
        <strong>Vermittlerregister-Nummer:</strong> D-…-…&nbsp;<span className="text-muted-foreground">[Eintrag aus dem Vermittlerregister einsetzen]</span>
        <br />
        <strong>Eintragung im Vermittlerregister:</strong>
        <br />
        DIHK | Deutscher Industrie- und Handelskammertag e.V.
        <br />
        Breite Straße 29, 10178 Berlin
        <br />
        Telefon: 0180&nbsp;6&nbsp;005&nbsp;850 (0,20&nbsp;€/Anruf aus dem dt. Festnetz, Mobilfunk max. 0,60&nbsp;€/Anruf)
        <br />
        Registerabfrage: <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer">www.vermittlerregister.info</a>
      </p>

      <h2>Zuständige Aufsichtsbehörde</h2>
      <p>
        Industrie- und Handelskammer [Region einsetzen, z.B. „Region Stuttgart"]
        <br />
        [Anschrift der zuständigen IHK]
        <br />
        Telefon: [+49&nbsp;…&nbsp;…]
        <br />
        Internet: [www.…ihk.de]
      </p>

      <h2>Berufsrechtliche Regelungen</h2>
      <ul>
        <li>§ 34d Gewerbeordnung (GewO)</li>
        <li>§§ 59–68 Versicherungsvertragsgesetz (VVG)</li>
        <li>Versicherungsvermittlungsverordnung (VersVermV)</li>
      </ul>
      <p className="text-sm">
        Einsehbar unter:{" "}
        <a href="https://www.gesetze-im-internet.de" target="_blank" rel="noopener noreferrer">
          www.gesetze-im-internet.de
        </a>
      </p>

      <h2>Außergerichtliche Streitbeilegung</h2>
      <p>
        Bei Streitigkeiten aus der Versicherungsvermittlung können Sie die folgenden
        Schlichtungsstellen anrufen:
      </p>
      <p>
        <strong>Versicherungsombudsmann e.V.</strong>
        <br />
        Postfach 08 06 32, 10006 Berlin
        <br />
        <a href="https://www.versicherungsombudsmann.de" target="_blank" rel="noopener noreferrer">
          www.versicherungsombudsmann.de
        </a>
      </p>
      <p>
        <strong>Ombudsmann private Kranken- und Pflegeversicherung</strong>
        <br />
        Postfach 06 02 22, 10052 Berlin
        <br />
        <a href="https://www.pkv-ombudsmann.de" target="_blank" rel="noopener noreferrer">
          www.pkv-ombudsmann.de
        </a>
      </p>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>
      <p>
        <strong>Verbraucherschlichtung:</strong> Wir sind weder bereit noch verpflichtet, an
        Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nach dem
        Verbraucherstreitbeilegungsgesetz (VSBG) teilzunehmen.
      </p>

      <h2>Vergütung und Beteiligungen</h2>
      <p>
        Als Versicherungsmakler werden wir grundsätzlich auf Provisionsbasis durch das
        vermittelte Versicherungsunternehmen vergütet. Die Provisionen sind in den
        Versicherungsprämien enthalten. Auf Wunsch beraten wir Sie auch gegen
        Honorarvereinbarung.
      </p>
      <p>
        <strong>Beteiligungen:</strong> Wir halten keine direkte oder indirekte Beteiligung
        von über 10&nbsp;% an den Stimmrechten oder am Kapital eines Versicherungsunternehmens.
        Kein Versicherungsunternehmen oder dessen Mutterunternehmen hält eine direkte oder
        indirekte Beteiligung von über 10&nbsp;% an unseren Stimmrechten oder unserem Kapital.
        <br />
        <span className="text-xs text-muted-foreground">
          (Falls Beteiligungen bestehen, hier konkret nennen — Pflicht nach § 15 VersVermV.)
        </span>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>Alexander Fürtbauer, Anschrift wie oben.</p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte unserer Seiten wurden mit größtmöglicher Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
        Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
        Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
        10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
        gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die
        auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
        jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
        Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir diese Inhalte umgehend
        entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
        keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
        Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
        Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum
        Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
        Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
      </p>
      <p>
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
        Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
        unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
        und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
        schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien
        dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
      <p>
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
        gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
        werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
      </p>
    </LegalLayout>
  );
};

export default Impressum;
