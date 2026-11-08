"use client";

import config from "../content/config";
import { useSite } from "./SiteProvider";
import { WhatsAppIcon } from "./Icons";

export default function FloatingWhatsApp() {
  const { t } = useSite();
  const href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(t.whatsappText || config.whatsappText)}`;
  return (
    <a className="wa-float" href={href} target="_blank" rel="noopener noreferrer" aria-label={t.header.whatsappAria || "WhatsApp"}>
      <WhatsAppIcon width="28" height="28" />
    </a>
  );
}
