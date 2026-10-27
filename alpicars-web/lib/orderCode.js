// Código del pedido que ve el cliente (AC-XXXXXXXX), sacado del identificador del pago de Stripe.
export const orderCode = (sessionId) => "AC-" + String(sessionId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();

// Enlace público de seguimiento del paquete (17TRACK reconoce casi todos los transportistas, también Cainiao/AliExpress)
export const trackingUrl = (n) => `https://t.17track.net/es#nums=${encodeURIComponent(n)}`;

export const ORDER_STATUS = {
  pagado: "Pedido recibido",
  pedido_proveedor: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  incidencia: "Incidencia en el envío",
  cancelado: "Cancelado",
};
