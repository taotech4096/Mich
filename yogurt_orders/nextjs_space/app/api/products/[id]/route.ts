export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
