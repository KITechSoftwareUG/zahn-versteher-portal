/**
 * ENV-Durchleitungs-Test.
 *
 * Zweck: Debug-Helper, um zu verifizieren dass eine im Vantage-OS-Dashboard
 * gesetzte ENV-Variable tatsächlich im Frontend ankommt
 * (Vantage-OS → Lovable → Vite build → Bundle).
 *
 * So testest du:
 *   1. Im Vantage-OS-Dashboard setzen: VITE_TEST_PING=hallo-123
 *   2. Lovable-Redeploy abwarten
 *   3. Landing aufrufen → grüne Badge oben links zeigt den Wert
 *
 * Wenn VITE_TEST_PING leer ist, erscheint nichts — kann also bedenkenlos im
 * Code bleiben, ohne dass Endnutzer etwas sehen.
 */
const EnvPing = () => {
  const value = import.meta.env.VITE_TEST_PING;
  if (!value) return null;

  return (
    <div className="fixed left-3 top-3 z-[60] flex items-center gap-2 rounded-full border-2 border-emerald-400 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-md">
      <span className="material-symbols-outlined text-sm">cable</span>
      <span>ENV-Ping: <code className="font-mono">{String(value)}</code></span>
    </div>
  );
};

export default EnvPing;
