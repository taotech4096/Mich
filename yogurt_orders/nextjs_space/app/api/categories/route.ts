export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, imageUrl, order } = body ?? {};

    if (!name) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description ?? null,
        imageUrl: imageUrl ?? null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
