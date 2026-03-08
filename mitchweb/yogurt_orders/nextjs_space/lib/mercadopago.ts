export type MercadoPagoPreferenceInput = {
  orderNumber: string;
  items: Array<{ title: string; quantity: number; unit_price: number }>;
  payer?: { email: string; name?: string; phone?: string };
  backUrls?: { success: string; failure: string; pending: string };
  notificationUrl?: string;
};

type MercadoPagoPaymentStatus =
  | "approved"
  | "authorized"
  | "in_process"
  | "pending"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export function isMercadoPagoConfigured(): boolean {
  return !!(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_PUBLIC_KEY);
}

export function getMercadoPagoPublicKey(): string | null {
  return process.env.MERCADOPAGO_PUBLIC_KEY ?? null;
}

export async function createMercadoPagoPreference(orderData: MercadoPagoPreferenceInput) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Mercado Pago no esta configurado");
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: orderData.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "MXN",
      })),
      payer: orderData.payer,
      back_urls: orderData.backUrls,
      notification_url: orderData.notificationUrl,
      external_reference: orderData.orderNumber,
      auto_return: "approved",
    }),
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.message || "Error al crear preferencia de pago");
  }

  return response.json();
}

export async function getPaymentStatus(paymentId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Mercado Pago no esta configurado");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener estado del pago");
  }

  return response.json();
}

export function mapMercadoPagoStatusToOrderStatus(
  paymentStatus: string
): "PENDING" | "PAID" | "CANCELLED" {
  const status = paymentStatus as MercadoPagoPaymentStatus;
  if (status === "approved" || status === "authorized") return "PAID";
  if (status === "rejected" || status === "cancelled" || status === "charged_back") return "CANCELLED";
  return "PENDING";
}

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
