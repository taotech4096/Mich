export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { isValidDeliveryZone } from "@/lib/delivery-utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Error al obtener direcciones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { street, number, interior, colony, city, zipCode, reference, isDefault } = body ?? {};

    if (!street || !number || !colony || !city || !zipCode) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    if (!isValidDeliveryZone(city)) {
      return NextResponse.json({ error: "Solo entregamos en Puebla y Cholula" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        street,
        number,
        interior: interior ?? null,
        colony,
        city,
        zipCode,
        reference: reference ?? null,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("Addresses POST error:", error);
    return NextResponse.json({ error: "Error al crear dirección" }, { status: 500 });
  }
}
