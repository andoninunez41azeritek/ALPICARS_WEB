"use client";

import config from "../content/config";
import { WhatsAppIcon } from "./Icons";

export default function FloatingWhatsApp() {
  const href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.whatsappText)}`;
  return (
    <a className="wa-float" href={href} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
      <WhatsAppIcon width="28" height="28" />
    </a>
  );
}
