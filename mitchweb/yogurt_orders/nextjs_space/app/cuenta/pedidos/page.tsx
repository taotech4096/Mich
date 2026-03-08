"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, { label: string; variant: any }> = {
  PENDING: { label: "Pendiente", variant: "warning" },
  PAID: { label: "Pagado", variant: "default" },
  PREPARING: { label: "Preparando", variant: "default" },
  READY: { label: "Listo", variant: "success" },
  DELIVERED: { label: "Entregado", variant: "success" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
};

export default function OrdersPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (orders?.length ?? 0) === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No tienes pedidos aún</h2>
              <p className="text-gray-500 mb-6">¡Haz tu primer pedido hoy!</p>
              <Link href="/productos" className="text-emerald-600 hover:underline font-medium">
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const statusInfo = statusLabels[order?.status ?? ""] ?? { label: order?.status, variant: "secondary" };
                return (
                  <div key={order?.id ?? Math.random()} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{order?.orderNumber ?? ""}</span>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("es-MX") : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order?.address?.city ?? ""}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        ${Number(order?.total ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="text-sm text-gray-600 mb-2">
                        {(order?.items ?? []).map((item: any) => (
                          <span key={item?.id ?? Math.random()} className="mr-3">
                            {item?.productName ?? ""} x{item?.quantity ?? 0}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Entrega: {order?.deliveryDay ? new Date(order.deliveryDay).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }) : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
