export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        notes: true,
        addresses: true,
        orders: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        subscriptions: {
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer GET error:", error);
    return NextResponse.json({ error: "Error al obtener cliente" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { notes } = body ?? {};

    const customer = await prisma.user.update({
      where: { id: params.id },
      data: { notes },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar cliente" }, { status: 500 });
  }
}
