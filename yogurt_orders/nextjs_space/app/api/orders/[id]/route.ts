export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    if (!isAdmin && order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json({ error: "Error al obtener pedido" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: body,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 });
  }
}
