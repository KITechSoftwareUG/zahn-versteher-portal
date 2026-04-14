/**
 * Floating WhatsApp-Button — unten rechts auf allen Seiten.
 *
 * Nutzt wa.me-Deep-Links mit optional vorgefüllter Nachricht.
 * Env-Vars (build-time):
 *   VITE_WHATSAPP_NUMBER  — im E.164-Format ohne "+" (z.B. "491701234567")
 *   VITE_WHATSAPP_PREFILL — optionaler Default-Text
 *
 * Wenn VITE_WHATSAPP_NUMBER nicht gesetzt ist, wird der Button nicht gerendert,
 * damit niemand einen kaputten Link klickt.
 */
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const WHATSAPP_PREFILL =
  import.meta.env.VITE_WHATSAPP_PREFILL ||
  "Hallo Alexander, ich interessiere mich für eine Zahnzusatzversicherung.";

interface WhatsAppButtonProps {
  /** Optionaler Suffix, der an die Prefill-Nachricht angehängt wird. */
  contextNote?: string;
}

const WhatsAppButton = ({ contextNote }: WhatsAppButtonProps) => {
  if (!WHATSAPP_NUMBER) return null;

  const message = contextNote ? `${WHATSAPP_PREFILL}\n\n${contextNote}` : WHATSAPP_PREFILL;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat auf WhatsApp starten"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 shadow-lg shadow-[#25D366]/30 transition-all hover:bottom-6 hover:shadow-xl hover:shadow-[#25D366]/40 sm:bottom-8 sm:right-8"
    >
      {/* WhatsApp-Logo als inline-SVG, damit wir kein extra asset brauchen */}
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 fill-white"
        aria-hidden="true"
      >
        <path d="M16.002 3C9.374 3 4 8.374 4 15.002c0 2.644.864 5.092 2.328 7.073L4 29l7.14-2.29a11.935 11.935 0 0 0 4.861 1.036h.001c6.627 0 12.001-5.374 12.001-12.002S22.63 3 16.002 3Zm0 21.775c-1.606 0-3.184-.43-4.567-1.244l-.327-.194-4.236 1.359 1.386-4.131-.213-.338a9.773 9.773 0 0 1-1.513-5.223c0-5.405 4.396-9.802 9.803-9.802 5.405 0 9.803 4.397 9.803 9.802 0 5.406-4.398 9.802-9.803 9.802Zm5.37-7.334c-.294-.147-1.74-.859-2.01-.957-.269-.098-.465-.147-.66.147-.196.294-.758.957-.929 1.154-.171.196-.343.22-.637.073-.294-.147-1.242-.458-2.366-1.46-.874-.78-1.464-1.742-1.635-2.036-.171-.294-.018-.453.129-.6.132-.132.294-.343.441-.515.147-.171.196-.294.294-.49.098-.196.049-.367-.025-.515-.073-.147-.66-1.59-.905-2.177-.238-.572-.481-.494-.66-.504l-.563-.01c-.196 0-.514.073-.783.367-.269.294-1.028 1.005-1.028 2.449 0 1.445 1.052 2.842 1.198 3.039.147.196 2.069 3.159 5.011 4.43.7.302 1.246.483 1.672.619.702.224 1.341.192 1.846.116.563-.084 1.74-.712 1.986-1.4.245-.686.245-1.274.171-1.4-.073-.122-.269-.196-.563-.343Z" />
      </svg>
      <span className="pr-1 text-sm font-semibold text-white">Chat starten</span>
    </a>
  );
};

export default WhatsAppButton;
