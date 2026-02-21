export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { createMercadoPagoPreference, isMercadoPagoConfigured } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isMercadoPagoConfigured()) {
      return NextResponse.json({ error: "Mercado Pago no esta configurado" }, { status: 400 });
    }

    const body = await req.json();
    const orderId = String(body?.orderId ?? "");
    if (!orderId) {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true } },
        items: true,
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    if (!isAdmin && order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const settings = await prisma.settings.findFirst();
    if (!settings?.mercadoPagoEnabled) {
      return NextResponse.json({ error: "Mercado Pago no esta habilitado" }, { status: 400 });
    }

    if ((order.items?.length ?? 0) === 0) {
      return NextResponse.json({ error: "El pedido no tiene productos" }, { status: 400 });
    }

    const appBaseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const webhookBaseUrl = process.env.WEBHOOK_BASE_URL || appBaseUrl;

    const preference = await createMercadoPagoPreference({
      orderNumber: order.orderNumber,
      items: order.items.map((item: any) => ({
        title: item.productName,
        quantity: item.quantity,
        unit_price: Number(item.price),
      })),
      payer: {
        email: order.user.email,
        name: order.user.name ?? undefined,
        phone: order.user.phone ?? undefined,
      },
      backUrls: {
        success: `${appBaseUrl}/checkout/confirmacion?order=${encodeURIComponent(order.orderNumber)}&payment=approved`,
        pending: `${appBaseUrl}/checkout/confirmacion?order=${encodeURIComponent(order.orderNumber)}&payment=pending`,
        failure: `${appBaseUrl}/checkout/confirmacion?order=${encodeURIComponent(order.orderNumber)}&payment=failure`,
      },
      notificationUrl: `${webhookBaseUrl}/api/payments/mercadopago/webhook`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: "mercado_pago",
      },
    });

    return NextResponse.json({
      preferenceId: preference?.id,
      initPoint: preference?.init_point,
      sandboxInitPoint: preference?.sandbox_init_point,
    });
  } catch (error) {
    console.error("Mercado Pago preference error:", error);
    return NextResponse.json({ error: "Error al crear preferencia de pago" }, { status: 500 });
  }
}
