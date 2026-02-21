export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const SUBSCRIPTION_STATUSES = ["ACTIVE", "PAUSED", "CANCELLED"] as const;
const SUBSCRIPTION_FREQUENCIES = ["WEEKLY", "BIWEEKLY", "MONTHLY"] as const;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({ where: { id: params.id } });
    if (!subscription) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    if (!isAdmin && subscription.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const updates: Record<string, any> = {};

    if (isAdmin) {
      if (body?.status !== undefined) {
        if (!SUBSCRIPTION_STATUSES.includes(body.status)) {
          return NextResponse.json({ error: "Estado de suscripcion invalido" }, { status: 400 });
        }
        updates.status = body.status;
      }
      if (body?.frequency !== undefined) {
        if (!SUBSCRIPTION_FREQUENCIES.includes(body.frequency)) {
          return NextResponse.json({ error: "Frecuencia invalida" }, { status: 400 });
        }
        updates.frequency = body.frequency;
      }
      if (body?.preferredDay !== undefined) {
        updates.preferredDay = String(body.preferredDay);
      }
      if (body?.addressId !== undefined) {
        updates.addressId = String(body.addressId);
      }
      if (body?.nextDelivery !== undefined) {
        const parsedDate = new Date(body.nextDelivery);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json({ error: "Fecha de proxima entrega invalida" }, { status: 400 });
        }
        updates.nextDelivery = parsedDate;
      }
      if (body?.lastDelivery !== undefined) {
        const parsedDate = new Date(body.lastDelivery);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json({ error: "Fecha de ultima entrega invalida" }, { status: 400 });
        }
        updates.lastDelivery = parsedDate;
      }
    } else {
      if (body?.status === undefined) {
        return NextResponse.json({ error: "Solo puedes actualizar el estado de la suscripcion" }, { status: 400 });
      }
      if (!SUBSCRIPTION_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Estado de suscripcion invalido" }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Sin cambios validos para actualizar" }, { status: 400 });
    }

    const updated = await prisma.subscription.update({
      where: { id: params.id },
      data: updates,
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Subscription PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar suscripción" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({ where: { id: params.id } });
    if (!subscription) {
      return NextResponse.json({ error: "Suscripción no encontrada" }, { status: 404 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    if (!isAdmin && subscription.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.subscription.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription DELETE error:", error);
    return NextResponse.json({ error: "Error al cancelar suscripción" }, { status: 500 });
  }
}
