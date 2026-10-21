// Iconos sencillos dibujados en SVG. Heredan el color del texto (currentColor).

export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.4Z"
      />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor" />
    </svg>
  );
}

export function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <path d="M5 11h10.6l-4.3-4.3L12.7 5.3 19.4 12l-6.7 6.7-1.4-1.4 4.3-4.3H5z" fill="currentColor" />
    </svg>
  );
}

export function ExternalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M14 4h6v6h-2V7.4l-7.3 7.3-1.4-1.4L16.6 6H14V4ZM5 6h6v2H6v10h10v-5h2v7H4V6h1Z" fill="currentColor" />
    </svg>
  );
}

export function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M6.4 8.6 12 14.2l5.6-5.6L19 10l-7 7-7-7z" fill="currentColor" />
    </svg>
  );
}

// Coche visto desde arriba, apuntando hacia la derecha (se rota según la ruta)
export function CarTopIcon(props) {
  return (
    <g {...props}>
      <rect x="-17" y="-8.5" width="34" height="17" rx="5" fill="#E60000" />
      <rect x="-5" y="-6.5" width="11" height="13" rx="2" fill="#0F2238" />
      <rect x="7" y="-6" width="4.5" height="12" rx="1.5" fill="#FFFFFF" opacity="0.85" />
      <rect x="-14" y="-6" width="3.5" height="12" rx="1.2" fill="#FFFFFF" opacity="0.55" />
      <rect x="14" y="-7" width="2.5" height="3" rx="1" fill="#FFF6C8" />
      <rect x="14" y="4" width="2.5" height="3" rx="1" fill="#FFF6C8" />
    </g>
  );
}
