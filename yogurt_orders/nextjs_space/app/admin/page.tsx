"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, RefreshCw, TrendingUp, Package } from "lucide-react";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(() => import("./_components/revenue-chart"), { ssr: false });

interface Analytics {
  revenue: { today: number; week: number; month: number };
  orderCounts: { today: number; week: number; month: number };
  ordersByStatus: { status: string; _count: number }[];
  activeSubscriptions: number;
  totalCustomers: number;
  popularProducts: { productName: string; _sum: { quantity: number } }[];
  dailyRevenue: { date: string; revenue: number }[];
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    {
      label: "Ingresos Hoy",
      value: `$${(analytics?.revenue?.today ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Ingresos Semana",
      value: `$${(analytics?.revenue?.week ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "bg-teal-500",
    },
    {
      label: "Pedidos Hoy",
      value: analytics?.orderCounts?.today ?? 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Suscripciones Activas",
      value: analytics?.activeSubscriptions ?? 0,
      icon: RefreshCw,
      color: "bg-purple-500",
    },
    {
      label: "Total Clientes",
      value: analytics?.totalCustomers ?? 0,
      icon: Users,
      color: "bg-orange-500",
    },
    {
      label: "Ingresos Mes",
      value: `$${(analytics?.revenue?.month ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Últimos 7 Días</h2>
          <div className="h-64">
            <RevenueChart data={analytics?.dailyRevenue ?? []} />
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {(analytics?.popularProducts ?? []).map((product: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product?.productName ?? ""}</p>
                </div>
                <span className="text-gray-600">{product?._sum?.quantity ?? 0} vendidos</span>
              </div>
            ))}
            {(analytics?.popularProducts?.length ?? 0) === 0 && (
              <p className="text-gray-500 text-center py-4">Sin datos aún</p>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pedidos por Estado</h2>
          <div className="space-y-3">
            {(analytics?.ordersByStatus ?? []).map((item: any, index: number) => {
              const statusLabels: Record<string, string> = {
                PENDING: "Pendiente",
                PAID: "Pagado",
                PREPARING: "Preparando",
                READY: "Listo",
                DELIVERED: "Entregado",
                CANCELLED: "Cancelado",
              };
              const statusColors: Record<string, string> = {
                PENDING: "bg-yellow-100 text-yellow-800",
                PAID: "bg-blue-100 text-blue-800",
                PREPARING: "bg-purple-100 text-purple-800",
                READY: "bg-green-100 text-green-800",
                DELIVERED: "bg-emerald-100 text-emerald-800",
                CANCELLED: "bg-red-100 text-red-800",
              };
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item?.status ?? ""] ?? "bg-gray-100 text-gray-800"}`}>
                    {statusLabels[item?.status ?? ""] ?? item?.status}
                  </span>
                  <span className="font-bold text-gray-900">{item?._count ?? 0}</span>
                </div>
              );
            })}
            {(analytics?.ordersByStatus?.length ?? 0) === 0 && (
              <p className="text-gray-500 text-center py-4">Sin pedidos aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
