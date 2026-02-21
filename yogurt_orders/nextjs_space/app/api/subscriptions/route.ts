export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getNextSubscriptionDelivery } from "@/lib/delivery-utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    const where: any = {};
    
    if (!isAdmin) {
      where.userId = (session.user as any).id;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { nextDelivery: "asc" },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Subscriptions GET error:", error);
    return NextResponse.json({ error: "Error al obtener suscripciones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { items, addressId, frequency, preferredDay } = body ?? {};

    if (!items?.length || !addressId || !frequency || !preferredDay) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const userId = (session.user as any).id;
    const nextDelivery = getNextSubscriptionDelivery(frequency, preferredDay);

    const subscriptionItems = items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        addressId,
        frequency,
        preferredDay,
        nextDelivery,
        items: { create: subscriptionItems },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Subscriptions POST error:", error);
    return NextResponse.json({ error: "Error al crear suscripción" }, { status: 500 });
  }
}
