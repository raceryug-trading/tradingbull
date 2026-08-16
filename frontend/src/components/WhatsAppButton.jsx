import { MessageCircle } from "lucide-react";
import { BRAND } from "../config";

export const WhatsAppButton = () => {
  const num = (BRAND.whatsappNumber || "").replace(/[^\d]/g, "");
  const msg = encodeURIComponent(BRAND.whatsappMessage || "Hello");
  const href = `https://wa.me/${num}?text=${msg}`;
  return (
    <a
      data-testid="whatsapp-floating-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-black shadow-lg shadow-emerald-900/40 transition-transform hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
      <span className="hidden sm:inline text-sm">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
