import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { WHATSAPP_URL } from "@/lib/constants";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Cynthia Mueni on WhatsApp (opens in a new tab)"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-slate-900/20 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:shadow-black/40 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover:scale-110" />
    </a>
  );
}
