export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const all = searchParams.get("all");

    const where: any = {};
    if (!all) where.isActive = true;
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) where.categoryId = category.id;
    }
    if (featured === "true") where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, comparePrice, categoryId, imageUrl, cloudStoragePath, isPublicImage, stock, unit, isActive, isFeatured } = body ?? {};

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Nombre, precio y categoría son requeridos" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        description: description ?? null,
        price,
        comparePrice: comparePrice ?? null,
        categoryId,
        imageUrl: imageUrl ?? null,
        cloudStoragePath: cloudStoragePath ?? null,
        isPublicImage: isPublicImage ?? true,
        stock: stock ?? 0,
        unit: unit ?? "pieza",
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
