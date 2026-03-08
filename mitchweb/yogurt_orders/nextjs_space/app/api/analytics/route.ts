export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Revenue stats
    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startOfToday }, status: { not: "CANCELLED" } },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfWeek }, status: { not: "CANCELLED" } },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
        select: { total: true },
      }),
    ]);

    const todayRevenue = todayOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
    const weekRevenue = weekOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
    const monthRevenue = monthOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);

    // Order counts by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    // Active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" },
    });

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    });

    // Popular products (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const popularProducts = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true },
      where: { order: { createdAt: { gte: thirtyDaysAgo } } },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    // Daily revenue for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo }, status: { not: "CANCELLED" } },
      select: { createdAt: true, total: true },
    });

    const dailyRevenue: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      dailyRevenue[key] = 0;
    }
    
    recentOrders.forEach((order: any) => {
      const key = order.createdAt.toISOString().split("T")[0];
      if (dailyRevenue[key] !== undefined) {
        dailyRevenue[key] += Number(order.total);
      }
    });

    return NextResponse.json({
      revenue: { today: todayRevenue, week: weekRevenue, month: monthRevenue },
      orderCounts: {
        today: todayOrders.length,
        week: weekOrders.length,
        month: monthOrders.length,
      },
      ordersByStatus,
      activeSubscriptions,
      totalCustomers,
      popularProducts,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })),
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Error al obtener análisis" }, { status: 500 });
  }
}
