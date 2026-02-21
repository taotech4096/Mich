export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    let settings = await prisma.settings.findFirst();
    
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: body,
      });
    } else {
      settings = await prisma.settings.create({ data: body });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}
