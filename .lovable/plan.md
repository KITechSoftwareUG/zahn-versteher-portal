

## Zahnzusatz-Experte Landing Page — Implementierungsplan

Basierend auf dem bereitgestellten HTML-Design wird die Landing Page als React-Anwendung umgesetzt.

### Dateien & Komponenten

**1. `src/index.css`** — Design-Tokens anpassen
- Montserrat + Inter Fonts einbinden
- Gold-Akzentfarbe (`#b59461`) und Teal (`#134e4a`) als CSS-Variablen
- Material Symbols Outlined Font importieren

**2. `index.html`** — Titel und Meta-Tags auf "Zahnzusatz-Experte" aktualisieren

**3. `src/pages/Index.tsx`** — Komplette Landing Page mit allen Sektionen:
- **Header/Navigation** — Logo, Nav-Links, CTA-Button
- **Hero-Bereich** (Split-Layout):
  - Links: Vermittler-Portrait (Platzhalter-Bild), Name, Rolle, Stats (10+ Jahre, 500+ Klienten)
  - Rechts: Multi-Step-Formular-Container
- **Vorteile-Sektion** — Feature-Karten
- **FAQ-Sektion** — Accordion
- **Footer** — Links, Copyright

**4. `src/components/MultiStepForm.tsx`** — Formular-Logik
- 3 Schritte mit Fortschrittsbalken:
  1. Zahnzustand (Radio-Auswahl mit Beschreibung)
  2. Gewünschte Leistungen (Mehrfachauswahl)
  3. Kontaktdaten (Name, E-Mail, Telefon)
- Zurück/Weiter-Navigation
- Erfolgsansicht nach Absenden

**5. `src/components/AssistantPanel.tsx`** — Bot-Assistenz
- Kontextabhängige Erklärungen pro Schritt
- Datenschutz-Hinweis
- Zeitschätzung

### Design
- Weißer Hintergrund, Gold-Akzente (`#b59461`), dunkles Slate für Text
- Montserrat für Überschriften, Inter für Fließtext
- Material Symbols Icons
- Responsive (Mobile: gestapelt, Desktop: Side-by-Side)

### Technik
- Lokaler React-State für Formular (kein Backend)
- Bestehende shadcn/ui-Komponenten wo passend (Button, Card, Accordion)
- Kein externes Backend — reine Frontend-Implementierung

