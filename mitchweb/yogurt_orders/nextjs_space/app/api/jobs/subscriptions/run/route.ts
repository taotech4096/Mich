export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber } from "@/lib/delivery-utils";

export async function POST(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json({ error: "CRON_SECRET no configurado" }, { status: 500 });
    }

    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.headers.get("x-cron-secret");
    if (token !== cronSecret) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const now = new Date();
    const settings = await prisma.settings.findFirst();
    const deliveryFee = Number(settings?.defaultDeliveryFee ?? 0);

    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        nextDelivery: { lte: now },
      },
      include: {
        address: true,
        user: { select: { id: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { nextDelivery: "asc" },
    });

    const result = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: [] as Array<{ subscriptionId: string; reason: string }>,
    };

    for (const subscription of dueSubscriptions) {
      result.processed += 1;

      try {
        if ((subscription.items?.length ?? 0) === 0) {
          result.skipped += 1;
          result.errors.push({ subscriptionId: subscription.id, reason: "Suscripcion sin productos" });
          continue;
        }

        const deliveryDay = new Date(subscription.nextDelivery);
        const start = new Date(deliveryDay);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const existingOrder = await prisma.order.findFirst({
          where: {
            subscriptionId: subscription.id,
            deliveryDay: { gte: start, lt: end },
          },
          select: { id: true },
        });
        if (existingOrder) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              lastDelivery: subscription.nextDelivery,
              nextDelivery: getNextSubscriptionDate(subscription.nextDelivery, subscription.frequency),
            },
          });
          result.skipped += 1;
          continue;
        }

        let subtotal = 0;
        const orderItems = subscription.items.map((item: any) => {
          const itemTotal = Number(item.product.price) * item.quantity;
          subtotal += itemTotal;
          return {
            productId: item.productId,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            total: itemTotal,
          };
        });

        const total = subtotal + deliveryFee;

        await prisma.$transaction([
          prisma.order.create({
            data: {
              orderNumber: generateOrderNumber(),
              userId: subscription.userId,
              addressId: subscription.addressId,
              status: "PENDING",
              subtotal,
              deliveryFee,
              total,
              deliveryDay: subscription.nextDelivery,
              paymentMethod: "pendiente",
              subscriptionId: subscription.id,
              items: { create: orderItems },
            },
          }),
          prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              lastDelivery: subscription.nextDelivery,
              nextDelivery: getNextSubscriptionDate(subscription.nextDelivery, subscription.frequency),
            },
          }),
        ]);

        result.created += 1;
      } catch (error: any) {
        result.errors.push({
          subscriptionId: subscription.id,
          reason: error?.message ?? "Error desconocido",
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Subscription run job error:", error);
    return NextResponse.json({ error: "Error al ejecutar job de suscripciones" }, { status: 500 });
  }
}

function getNextSubscriptionDate(current: Date, frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"): Date {
  const next = new Date(current);
  if (frequency === "WEEKLY") next.setDate(next.getDate() + 7);
  if (frequency === "BIWEEKLY") next.setDate(next.getDate() + 14);
  if (frequency === "MONTHLY") next.setMonth(next.getMonth() + 1);
  return next;
}
