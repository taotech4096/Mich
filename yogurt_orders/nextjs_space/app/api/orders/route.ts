export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generateOrderNumber } from "@/lib/delivery-utils";

const ALLOWED_PAYMENT_METHODS = new Set(["pendiente", "efectivo", "transferencia", "mercado_pago"]);

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isAdmin = (session.user as any)?.role === "ADMIN";
    
    const where: any = {};
    
    if (!isAdmin) {
      where.userId = (session.user as any).id;
    } else {
      const status = searchParams.get("status");
      const date = searchParams.get("date");
      const deliveryDay = searchParams.get("deliveryDay");
      
      if (status) where.status = status;
      if (date) {
        const dateObj = new Date(date);
        where.createdAt = {
          gte: dateObj,
          lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000),
        };
      }
      if (deliveryDay) {
        const dayObj = new Date(deliveryDay);
        where.deliveryDay = {
          gte: dayObj,
          lt: new Date(dayObj.getTime() + 24 * 60 * 60 * 1000),
        };
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        address: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { items, addressId, deliveryDay, notes, paymentMethod, subscriptionId, userId: overrideUserId } = body ?? {};

    if (!items?.length || !addressId || !deliveryDay) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const isAdmin = (session.user as any)?.role === "ADMIN";
    const userId = isAdmin && overrideUserId ? overrideUserId : (session.user as any).id;

    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) {
      return NextResponse.json({ error: "Direccion no encontrada" }, { status: 400 });
    }
    if (!isAdmin && address.userId !== userId) {
      return NextResponse.json({ error: "No autorizado para usar esta direccion" }, { status: 401 });
    }

    const normalizedItems: Array<{ productId: string; quantity: number }> = (items ?? []).map((item: any) => ({
      productId: String(item?.productId ?? ""),
      quantity: Number(item?.quantity ?? 0),
    }));

    const hasInvalidQuantity = normalizedItems.some(
      (item: any) => !Number.isInteger(item.quantity) || item.quantity <= 0
    );
    if (hasInvalidQuantity) {
      return NextResponse.json({ error: "Cantidad invalida en uno o mas productos" }, { status: 400 });
    }

    const uniqueProductIds: string[] = Array.from(new Set(normalizedItems.map((item) => item.productId)));
    const products = await prisma.product.findMany({
      where: {
        id: { in: uniqueProductIds },
        isActive: true,
      },
    });
    if (products.length !== uniqueProductIds.length) {
      return NextResponse.json({ error: "Uno o mas productos no son validos o no estan disponibles" }, { status: 400 });
    }

    const productsById = new Map<string, any>(products.map((product: any) => [product.id, product]));

    // Calculate totals from canonical DB prices.
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of normalizedItems) {
      const product: any = productsById.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: "Producto invalido en el pedido" }, { status: 400 });
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "El pedido no contiene productos validos" }, { status: 400 });
    }

    const settings = await prisma.settings.findFirst();
    const minOrderAmount = Number(settings?.minOrderAmount ?? 0);
    if (subtotal < minOrderAmount) {
      return NextResponse.json(
        { error: `El pedido minimo es de $${minOrderAmount.toFixed(2)}` },
        { status: 400 }
      );
    }

    const deliveryFee = Number(settings?.defaultDeliveryFee ?? 0);
    const total = subtotal + deliveryFee;
    const normalizedPaymentMethod = String(paymentMethod ?? "pendiente").toLowerCase();

    if (!ALLOWED_PAYMENT_METHODS.has(normalizedPaymentMethod)) {
      return NextResponse.json({ error: "Metodo de pago invalido" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        status: "PENDING",
        subtotal,
        deliveryFee,
        total,
        deliveryDay: new Date(deliveryDay),
        paymentMethod: normalizedPaymentMethod,
        notes: notes ?? null,
        subscriptionId: subscriptionId ?? null,
        items: { create: orderItems },
      },
      include: {
        items: true,
        address: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
