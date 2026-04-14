/**
 * Shared WhatsApp helper — von Floating-Button (WhatsAppButton.tsx) und
 * Inline-Form-Button (MultiStepForm.tsx) genutzt.
 *
 * Env-Vars (build-time):
 *   VITE_WHATSAPP_NUMBER  — im E.164-Format ohne "+" (z.B. "491701234567")
 *   VITE_WHATSAPP_PREFILL — optionaler Default-Text
 */

export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");

const DEFAULT_PREFILL =
  import.meta.env.VITE_WHATSAPP_PREFILL ||
  "Hallo Alexander, ich interessiere mich für eine Zahnzusatzversicherung.";

/**
 * Baut einen wa.me-Deep-Link. Gibt null zurück wenn keine Nummer
 * konfiguriert ist — Caller sollen dann den Button gar nicht rendern,
 * damit kein kaputter Link geklickt wird.
 */
export function getWhatsAppLink(contextNote?: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  const message = contextNote ? `${DEFAULT_PREFILL}\n\n${contextNote}` : DEFAULT_PREFILL;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
