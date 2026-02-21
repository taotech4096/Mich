"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Pause, Play, X, AlertCircle } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: any }> = {
  ACTIVE: { label: "Activa", variant: "success" },
  PAUSED: { label: "Pausada", variant: "warning" },
  CANCELLED: { label: "Cancelada", variant: "destructive" },
};

const frequencyLabels: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
};

export default function SubscriptionsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptions();
    }
  }, [session]);

  const fetchSubscriptions = () => {
    fetch("/api/subscriptions")
      .then((res) => res.json())
      .then((data) => {
        setSubscriptions(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateSubscription = async (id: string, data: any) => {
    try {
      await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const cancelSubscription = async (id: string) => {
    if (!confirm("¿Estás seguro de cancelar esta suscripción?")) return;
    try {
      await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      fetchSubscriptions();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Suscripciones</h1>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (subscriptions?.length ?? 0) === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No tienes suscripciones activas</h2>
              <p className="text-gray-500">Puedes crear una suscripción al hacer tu próximo pedido</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub: any) => {
                const statusInfo = statusLabels[sub?.status ?? ""] ?? { label: sub?.status, variant: "secondary" };
                return (
                  <div key={sub?.id ?? Math.random()} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-600">{frequencyLabels[sub?.frequency ?? ""] ?? sub?.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Próxima entrega: {sub?.nextDelivery ? new Date(sub.nextDelivery).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }) : ""}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Productos:</h3>
                      <div className="space-y-1">
                        {(sub?.items ?? []).map((item: any) => (
                          <div key={item?.id ?? Math.random()} className="text-sm text-gray-600">
                            {item?.product?.name ?? ""} x{item?.quantity ?? 0}
                          </div>
                        ))}
                      </div>
                    </div>

                    {sub?.status !== "CANCELLED" && (
                      <div className="flex gap-2">
                        {sub?.status === "ACTIVE" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscription(sub.id, { status: "PAUSED" })}
                          >
                            <Pause className="w-4 h-4 mr-1" /> Pausar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscription(sub.id, { status: "ACTIVE" })}
                          >
                            <Play className="w-4 h-4 mr-1" /> Reactivar
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelSubscription(sub.id)}
                        >
                          <X className="w-4 h-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    )}
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
