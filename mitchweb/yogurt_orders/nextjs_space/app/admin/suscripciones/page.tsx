"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, User, MapPin, Pause, Play, Trash2 } from "lucide-react";

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

export default function SubscriptionsAdminPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

  const filteredSubscriptions = filterStatus
    ? subscriptions.filter((s) => s?.status === filterStatus)
    : subscriptions;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suscripciones</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3"
          >
            <option value="">Todas</option>
            <option value="ACTIVE">Activas</option>
            <option value="PAUSED">Pausadas</option>
            <option value="CANCELLED">Canceladas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (filteredSubscriptions?.length ?? 0) === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No hay suscripciones</h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscriptions.map((sub: any) => {
            const statusInfo = statusLabels[sub?.status ?? ""] ?? { label: sub?.status, variant: "secondary" };
            return (
              <div key={sub?.id ?? Math.random()} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    <span className="ml-2 text-sm text-gray-600">
                      {frequencyLabels[sub?.frequency ?? ""] ?? sub?.frequency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{sub?.user?.name ?? sub?.user?.email ?? "Cliente"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Próxima: {sub?.nextDelivery ? new Date(sub.nextDelivery).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" }) : ""}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">
                      {sub?.address?.colony ?? ""}, {sub?.address?.city ?? ""}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Productos</h4>
                  <div className="space-y-1">
                    {(sub?.items ?? []).map((item: any) => (
                      <div key={item?.id ?? Math.random()} className="text-sm text-gray-600 flex justify-between">
                        <span>{item?.product?.name ?? ""}</span>
                        <span>x{item?.quantity ?? 0}</span>
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
                        className="flex-1"
                      >
                        <Pause className="w-4 h-4 mr-1" /> Pausar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSubscription(sub.id, { status: "ACTIVE" })}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-1" /> Activar
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("¿Cancelar esta suscripción?")) {
                          updateSubscription(sub.id, { status: "CANCELLED" });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
