export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPaymentStatus, mapMercadoPagoStatusToOrderStatus } from "@/lib/mercadopago";

export async function GET() {
  // Mercado Pago can use GET challenge calls depending on config.
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const received = req.headers.get("x-webhook-secret");
      if (!received || received !== webhookSecret) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const searchParams = new URL(req.url).searchParams;

    const topic = String(body?.type ?? searchParams.get("type") ?? searchParams.get("topic") ?? "");
    const paymentId =
      String(body?.data?.id ?? searchParams.get("data.id") ?? searchParams.get("id") ?? "").trim();

    if (!paymentId || (topic && topic !== "payment")) {
      return NextResponse.json({ ok: true });
    }

    const payment = await getPaymentStatus(paymentId);
    const orderNumber = String(payment?.external_reference ?? "").trim();
    if (!orderNumber) {
      return NextResponse.json({ ok: true });
    }

    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return NextResponse.json({ ok: true });
    }

    const mappedStatus = mapMercadoPagoStatusToOrderStatus(String(payment?.status ?? ""));
    const safeStatus =
      order.status === "DELIVERED" || order.status === "READY" || order.status === "PREPARING"
        ? order.status
        : mappedStatus;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: String(payment?.id ?? paymentId),
        paymentMethod: "mercado_pago",
        status: safeStatus,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Mercado Pago webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
