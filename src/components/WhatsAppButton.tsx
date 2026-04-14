import { getWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

/**
 * Floating WhatsApp-Button — unten rechts auf allen Seiten.
 * Wenn VITE_WHATSAPP_NUMBER nicht gesetzt ist, rendert nichts.
 */
interface WhatsAppButtonProps {
  /** Optionaler Suffix, der an die Prefill-Nachricht angehängt wird. */
  contextNote?: string;
}

const WhatsAppButton = ({ contextNote }: WhatsAppButtonProps) => {
  const href = getWhatsAppLink(contextNote);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat auf WhatsApp starten"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 shadow-lg shadow-[#25D366]/30 transition-all hover:bottom-6 hover:shadow-xl hover:shadow-[#25D366]/40 sm:bottom-8 sm:right-8"
    >
      <WhatsAppIcon className="h-7 w-7 fill-white" />
      <span className="pr-1 text-sm font-semibold text-white">Chat starten</span>
    </a>
  );
};

export default WhatsAppButton;
