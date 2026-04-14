import LegalLayout from "@/components/LegalLayout";

/**
 * Datenschutzerklärung nach DSGVO Art. 13 / Art. 14 + TTDSG.
 *
 * Besondere Aufmerksamkeit:
 * - Verarbeitung von Gesundheitsdaten nach Art. 9 DSGVO (Anamnese-Fragen)
 * - Drittlandtransfers (USA): WhatsApp/Meta, Anthropic, Google
 *
 * Stellen mit [ZU ERSETZEN] müssen vor Live-Schaltung mit den
 * tatsächlichen Daten von ExpatVantage befüllt werden. Vor Live-Schaltung
 * sollte ein Fachanwalt für IT-/Datenschutzrecht den Text einmal freigeben.
 */
const Datenschutz = () => {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <p className="text-xs text-muted-foreground">
        Stand: [Datum eintragen, z.B. „April 2026"] · Diese Datenschutzerklärung informiert
        Sie nach Art. 13 und Art. 14 DSGVO über die Verarbeitung Ihrer personenbezogenen
        Daten beim Besuch und der Nutzung dieser Website.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer
        nationaler Datenschutzgesetze der Mitgliedstaaten sowie sonstiger
        datenschutzrechtlicher Bestimmungen ist:
      </p>
      <p>
        Alexander Fürtbauer
        <br />
        ExpatVantage <span className="text-muted-foreground">[Rechtsform]</span>
        <br />
        [Straße, Hausnummer]
        <br />
        [PLZ, Ort]
        <br />
        Deutschland
        <br />
        E-Mail: <a href="mailto:info@expatvantage.de">info@expatvantage.de</a>
      </p>

      <h2>2. Datenschutzbeauftragte/r</h2>
      <p>
        Es besteht keine gesetzliche Verpflichtung zur Bestellung eines Datenschutzbeauftragten
        gemäß § 38 BDSG. Bei Fragen zum Datenschutz erreichen Sie uns direkt unter:{" "}
        <a href="mailto:datenschutz@expatvantage.de">datenschutz@expatvantage.de</a>.
      </p>

      <h2>3. Allgemeine Hinweise zur Datenverarbeitung</h2>
      <h3>3.1 Umfang der Verarbeitung</h3>
      <p>
        Wir verarbeiten personenbezogene Daten unserer Nutzer nur, soweit dies zur
        Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
        erforderlich ist. Eine Verarbeitung personenbezogener Daten unserer Nutzer erfolgt
        regelmäßig nur nach Einwilligung des Nutzers oder in den Fällen, in denen eine
        vorherige Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist
        und die Verarbeitung der Daten durch gesetzliche Vorschriften gestattet ist.
      </p>
      <h3>3.2 Rechtsgrundlagen</h3>
      <p>
        Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der
        betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a DSGVO als Rechtsgrundlage.
        Bei Verarbeitungen zur Erfüllung eines Vertrages ist Art. 6 Abs. 1 lit. b DSGVO
        Rechtsgrundlage; dies gilt auch für vorvertragliche Maßnahmen. Soweit eine
        Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist, ist Art. 6 Abs. 1
        lit. f DSGVO Rechtsgrundlage. Für die Verarbeitung besonderer Kategorien
        personenbezogener Daten (z.B. Gesundheitsdaten) ist Art. 9 Abs. 2 lit. a DSGVO
        (ausdrückliche Einwilligung) die maßgebliche Rechtsgrundlage.
      </p>

      <h2>4. Bereitstellung der Website und Server-Logfiles</h2>
      <p>
        Bei jedem Aufruf unserer Website erfasst unser System automatisiert Daten und
        Informationen vom Computersystem des aufrufenden Rechners. Folgende Daten werden
        hierbei erhoben:
      </p>
      <ul>
        <li>IP-Adresse des Nutzers (gekürzt/anonymisiert wo technisch möglich)</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Aufgerufene URL und HTTP-Statuscode</li>
        <li>Übertragene Datenmenge</li>
        <li>Browser-Typ und -Version (User Agent)</li>
        <li>Betriebssystem</li>
        <li>Referrer-URL (zuvor besuchte Seite)</li>
      </ul>
      <p>
        <strong>Zweck:</strong> Sicherstellung des Verbindungsaufbaus, der Systemsicherheit
        und der technischen Administration.
        <br />
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
        am sicheren Betrieb der Website).
        <br />
        <strong>Speicherdauer:</strong> Server-Logs werden nach maximal [30] Tagen gelöscht
        oder anonymisiert. Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
      </p>

      <h2>5. Kontaktaufnahme über das Formular</h2>
      <h3>5.1 Erhobene Daten</h3>
      <p>
        Wenn Sie unser Online-Formular zur Anfrage einer Zahnzusatzversicherung ausfüllen
        und absenden, verarbeiten wir folgende Angaben:
      </p>
      <ul>
        <li>Vor- und Nachname</li>
        <li>Telefonnummer</li>
        <li>E-Mail-Adresse (sofern angegeben)</li>
        <li>Ihre Einwilligung zur Kontaktaufnahme per WhatsApp (Ja/Nein)</li>
        <li>
          Angaben zu Ihrer zahnmedizinischen Situation (laufende und geplante Behandlungen,
          fehlende Zähne, Zahnersatz, Parodontitis-Behandlung, Zahnfleischerkrankung,
          Zahn- bzw. Kieferfehlstellungen, kieferorthopädische Behandlungsempfehlung)
        </li>
        <li>Zeitpunkt der Übermittlung (Eingangs-Timestamp)</li>
      </ul>

      <h3 className="text-destructive">5.2 Verarbeitung von Gesundheitsdaten (Art. 9 DSGVO)</h3>
      <p>
        Die unter 5.1 genannten zahnmedizinischen Angaben gelten als{" "}
        <strong>besondere Kategorien personenbezogener Daten</strong> im Sinne des Art. 9
        Abs. 1 DSGVO (Gesundheitsdaten). Ihre Verarbeitung erfolgt ausschließlich auf
        Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO. Diese
        Einwilligung erteilen Sie aktiv durch Anklicken der entsprechenden Checkbox am Ende
        des Formulars.
      </p>
      <p>
        <strong>Zweck:</strong> Wir benötigen diese Angaben, um Ihnen eine fachlich
        passende Zahnzusatzversicherung empfehlen zu können. Tarife unterscheiden sich
        erheblich hinsichtlich Wartezeiten, Sofortleistungen und Ausschlüssen für
        Vorerkrankungen.
      </p>
      <p>
        <strong>Widerruf:</strong> Sie können diese Einwilligung jederzeit mit Wirkung für
        die Zukunft widerrufen, ohne dass die Rechtmäßigkeit der bis dahin erfolgten
        Verarbeitung berührt wird. Eine kurze E-Mail an{" "}
        <a href="mailto:datenschutz@expatvantage.de">datenschutz@expatvantage.de</a> genügt.
        Nach Widerruf werden Ihre Gesundheitsdaten unverzüglich gelöscht.
      </p>

      <h3>5.3 Zwecke und Rechtsgrundlagen im Überblick</h3>
      <ul>
        <li>
          <strong>Bearbeitung Ihrer Anfrage und Vertragsanbahnung:</strong> Art. 6 Abs. 1
          lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen).
        </li>
        <li>
          <strong>Verarbeitung Ihrer zahnmedizinischen Angaben:</strong> Art. 9 Abs. 2
          lit. a DSGVO (ausdrückliche Einwilligung).
        </li>
        <li>
          <strong>Kontaktaufnahme per WhatsApp (sofern eingewilligt):</strong> Art. 6 Abs. 1
          lit. a DSGVO (Einwilligung) i.V.m. Art. 6 Abs. 1 lit. b DSGVO.
        </li>
      </ul>

      <h3>5.4 Speicherdauer</h3>
      <p>
        Wir speichern Ihre Angaben so lange, wie es zur Bearbeitung Ihrer Anfrage und zur
        eventuellen Vertragsabwicklung notwendig ist. Bei Zustandekommen eines
        Versicherungsvertrages über uns gelten die gesetzlichen Aufbewahrungsfristen (z.B.
        nach § 257 HGB und § 147 AO bis zu zehn Jahre). Kommt kein Vertrag zustande,
        löschen wir Ihre Daten spätestens nach Ablauf der gesetzlichen Verjährungsfristen
        nach §§ 195, 199 BGB (in der Regel drei Jahre zum Jahresende). Auf Ihren Wunsch hin
        löschen wir Ihre Daten jederzeit früher, soweit keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>6. Eingesetzte Dienste und Empfänger Ihrer Daten</h2>
      <p>
        Zur Bereitstellung dieser Website und zur Bearbeitung Ihrer Anfrage setzen wir die
        nachfolgend genannten Drittanbieter ein. Mit Anbietern in Drittländern (insbesondere
        USA) werden EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO
        und/oder das EU-US Data Privacy Framework abgeschlossen, soweit anwendbar.
      </p>

      <h3>6.1 WhatsApp Business / Meta Platforms Ireland Ltd.</h3>
      <p>
        Sofern Sie der Kontaktaufnahme per WhatsApp ausdrücklich zugestimmt haben oder uns
        selbst über WhatsApp anschreiben, übermitteln wir Ihre Telefonnummer und den
        Nachrichteninhalt an die Meta Platforms Ireland Ltd., Merrion Road, Dublin 4, D04
        X2K5, Irland. Meta verarbeitet die Daten technisch in eigener Verantwortung.
        Mutterkonzern ist die Meta Platforms, Inc. (USA). Es findet eine
        Drittlandübermittlung in die USA statt. Meta hat sich dem EU-US Data Privacy
        Framework unterworfen.
      </p>
      <ul>
        <li>
          Datenschutzerklärung WhatsApp:{" "}
          <a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener noreferrer">
            whatsapp.com/legal/privacy-policy-eea
          </a>
        </li>
        <li>
          WhatsApp Business Policy:{" "}
          <a href="https://www.whatsapp.com/legal/business-policy" target="_blank" rel="noopener noreferrer">
            whatsapp.com/legal/business-policy
          </a>
        </li>
      </ul>
      <p>
        Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), bei zahnmedizinischen
        Inhalten zusätzlich Art. 9 Abs. 2 lit. a DSGVO. Die Einwilligung kann jederzeit
        widerrufen werden – schicken Sie uns dazu einfach eine Nachricht mit dem Wort
        „STOP" oder eine E-Mail an{" "}
        <a href="mailto:datenschutz@expatvantage.de">datenschutz@expatvantage.de</a>.
      </p>

      <h3>6.2 Anthropic Claude (AI-gestützte Personalisierung)</h3>
      <p>
        Zur Erstellung der personalisierten Erstantwort (per WhatsApp oder E-Mail) nutzen
        wir das Sprachmodell „Claude" der Anthropic, PBC, San Francisco, USA. An Anthropic
        übermittelt werden:
      </p>
      <ul>
        <li>Ihr Vorname</li>
        <li>Eine zusammenfassende Beschreibung Ihrer zahnmedizinischen Situation</li>
      </ul>
      <p>
        <strong>Nicht übermittelt werden:</strong> Telefonnummer, vollständige
        E-Mail-Adresse, Nachname oder Anschrift.
      </p>
      <p>
        Anthropic verarbeitet die Daten ausschließlich zur Erfüllung der API-Anfrage und
        verwendet sie laut Anbieterzusicherung nicht zum Training der Modelle. Es findet
        eine Drittlandübermittlung in die USA auf Basis von EU-Standardvertragsklauseln
        statt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
        einer qualitativ hochwertigen Erstansprache) und – soweit Gesundheitsdaten in der
        Zusammenfassung enthalten sind – Art. 9 Abs. 2 lit. a DSGVO (Einwilligung).
      </p>
      <p>
        Datenschutz-Informationen Anthropic:{" "}
        <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
          anthropic.com/legal/privacy
        </a>
      </p>

      <h3>6.3 Google Gmail (E-Mail-Versand)</h3>
      <p>
        Sofern Sie der WhatsApp-Kontaktaufnahme nicht zustimmen, kontaktieren wir Sie per
        E-Mail. Der Versand erfolgt über die Gmail-API von Google Ireland Limited, Gordon
        House, Barrow Street, Dublin 4, Irland. Hierbei wird Ihre E-Mail-Adresse zusammen
        mit der personalisierten Antwort an Google übermittelt. Mutterkonzern ist Google
        LLC (USA); es findet eine Drittlandübermittlung statt. Google hat sich dem EU-US
        Data Privacy Framework unterworfen.
      </p>
      <p>
        Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen). Weitere
        Informationen:{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          policies.google.com/privacy
        </a>
        .
      </p>

      <h3>6.4 Hosting und technische Bereitstellung</h3>
      <p>
        Diese Website wird gehostet bei <strong>[Hosting-Anbieter und Anschrift einsetzen,
        z.B. Lovable Inc. / Elestio / o.ä.]</strong>. Der Hosting-Anbieter verarbeitet
        in unserem Auftrag (Art. 28 DSGVO – Auftragsverarbeitung) sämtliche Daten, die zur
        technischen Bereitstellung der Website erforderlich sind. Mit dem Anbieter besteht
        ein entsprechender Auftragsverarbeitungsvertrag.
      </p>

      <h2>7. Cookies und vergleichbare Technologien</h2>
      <p>
        Diese Website verwendet ausschließlich technisch notwendige Cookies und vergleichbare
        Speichertechnologien (z.B. <code>localStorage</code>), die für den ordnungsgemäßen
        Betrieb erforderlich sind (z.B. zur temporären Speicherung Ihrer Formulareingaben
        zwischen den Schritten). Diese Speicherung erfolgt auf Grundlage von § 25 Abs. 2
        Nr. 2 TTDSG (unbedingt erforderlich) und bedarf keiner Einwilligung.
      </p>
      <p>
        Tracking- oder Marketing-Cookies setzen wir nicht ein. Sollten künftig solche
        Dienste eingesetzt werden, holen wir vorab Ihre ausdrückliche Einwilligung über
        einen Cookie-Banner ein.
      </p>

      <h2>8. Ihre Rechte als betroffene Person</h2>
      <p>
        Werden personenbezogene Daten von Ihnen verarbeitet, sind Sie Betroffene/r i.S.d.
        DSGVO und es stehen Ihnen folgende Rechte gegenüber dem Verantwortlichen zu:
      </p>
      <ul>
        <li>
          <strong>Auskunftsrecht</strong> (Art. 15 DSGVO) – ob und welche Daten wir über
          Sie verarbeiten
        </li>
        <li>
          <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) – unrichtige Daten
          korrigieren lassen
        </li>
        <li>
          <strong>Recht auf Löschung</strong> (Art. 17 DSGVO) – „Recht auf Vergessenwerden"
        </li>
        <li>
          <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
        </li>
        <li>
          <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)
        </li>
        <li>
          <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) gegen Verarbeitungen auf
          Grundlage berechtigter Interessen
        </li>
        <li>
          <strong>Widerrufsrecht</strong> (Art. 7 Abs. 3 DSGVO) bei einwilligungsbasierten
          Verarbeitungen, mit Wirkung für die Zukunft
        </li>
        <li>
          <strong>Beschwerderecht</strong> bei einer Aufsichtsbehörde (Art. 77 DSGVO)
        </li>
      </ul>
      <p>
        Zur Ausübung dieser Rechte genügt eine formlose E-Mail an{" "}
        <a href="mailto:datenschutz@expatvantage.de">datenschutz@expatvantage.de</a>.
      </p>

      <h2>9. Zuständige Aufsichtsbehörde</h2>
      <p>
        [Zuständige Landesdatenschutzbehörde nach Sitz, z.B. „Der Landesbeauftragte für den
        Datenschutz und die Informationsfreiheit Baden-Württemberg, Königstraße 10a, 70173
        Stuttgart"]
        <br />
        <a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" target="_blank" rel="noopener noreferrer">
          Liste aller Landesdatenschutzbehörden
        </a>
      </p>

      <h2>10. Pflicht zur Bereitstellung der Daten</h2>
      <p>
        Die Bereitstellung Ihrer personenbezogenen Daten ist weder gesetzlich noch
        vertraglich vorgeschrieben. Sie sind nicht verpflichtet, uns Ihre Daten zur
        Verfügung zu stellen. Ohne diese Daten können wir Ihre Anfrage allerdings nicht
        bearbeiten und Ihnen kein passendes Angebot erstellen.
      </p>

      <h2>11. Automatisierte Entscheidungsfindung / Profiling</h2>
      <p>
        Eine automatisierte Entscheidungsfindung im Sinne des Art. 22 DSGVO – also eine
        Entscheidung mit rechtlicher Wirkung allein auf Basis automatisierter Verarbeitung –
        findet nicht statt. Die AI-gestützte Personalisierung der Erstantwort dient
        ausschließlich der textlichen Aufbereitung; die endgültige Beratung und das
        Versicherungsangebot erstellt {`{Alexander Fürtbauer}`} persönlich.
      </p>

      <h2>12. SSL-/TLS-Verschlüsselung</h2>
      <p>
        Diese Website nutzt aus Gründen der Sicherheit und zum Schutz der Übertragung
        vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf
        „https://" wechselt und am Schloss-Symbol in Ihrer Browserzeile.
      </p>

      <h2>13. Änderungen dieser Datenschutzerklärung</h2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
        aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer
        Leistungen abzubilden. Für Ihren erneuten Besuch gilt dann die jeweils aktuelle,
        auf dieser Seite veröffentlichte Fassung.
      </p>
    </LegalLayout>
  );
};

export default Datenschutz;
