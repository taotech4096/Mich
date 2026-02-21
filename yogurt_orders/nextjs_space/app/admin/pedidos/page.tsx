"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Calendar, MapPin, Phone, Mail, ChevronDown, ChevronUp, X } from "lucide-react";

const statusOptions = [
  { value: "PENDING", label: "Pendiente", color: "warning" },
  { value: "PAID", label: "Pagado", color: "default" },
  { value: "PREPARING", label: "Preparando", color: "default" },
  { value: "READY", label: "Listo", color: "success" },
  { value: "DELIVERED", label: "Entregado", color: "success" },
  { value: "CANCELLED", label: "Cancelado", color: "destructive" },
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchOrders = useCallback(() => {
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterDate) params.set("deliveryDay", filterDate);
    
    fetch(`/api/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filterStatus, filterDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const updateOrderNotes = async (orderId: string, adminNotes: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 px-3"
          >
            <option value="">Todos</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Día de entrega</label>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-40"
          />
        </div>
        {(filterStatus || filterDate) && (
          <div className="flex items-end">
            <Button variant="ghost" onClick={() => { setFilterStatus(""); setFilterDate(""); }}>
              <X className="w-4 h-4 mr-1" /> Limpiar
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (orders?.length ?? 0) === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No hay pedidos</h2>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const statusInfo = statusOptions.find((s) => s.value === order?.status) ?? { label: order?.status, color: "secondary" };
            const isExpanded = expandedOrder === order?.id;

            return (
              <div key={order?.id ?? Math.random()} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => setExpandedOrder(isExpanded ? null : order?.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{order?.orderNumber ?? ""}</span>
                        <Badge variant={statusInfo.color as any}>{statusInfo.label}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order?.user?.name ?? order?.user?.email ?? "Cliente"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${Number(order?.total ?? 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {order?.items?.length ?? 0} productos
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {order?.deliveryDay
                          ? new Date(order.deliveryDay).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
                          : ""}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cliente</h4>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{order?.user?.name ?? "Sin nombre"}</p>
                          <p className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-4 h-4" /> {order?.user?.email ?? ""}
                          </p>
                          {order?.user?.phone && (
                            <p className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-4 h-4" /> {order.user.phone}
                            </p>
                          )}
                        </div>
                        <h4 className="font-semibold text-gray-900 mt-4 mb-2">Dirección</h4>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-start gap-1">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              {order?.address?.street ?? ""} #{order?.address?.number ?? ""}
                              {order?.address?.interior ? ` Int. ${order.address.interior}` : ""}<br />
                              {order?.address?.colony ?? ""}, {order?.address?.city ?? ""} {order?.address?.zipCode ?? ""}
                            </span>
                          </p>
                          {order?.address?.reference && (
                            <p className="text-gray-500 mt-1">Ref: {order.address.reference}</p>
                          )}
                        </div>
                      </div>

                      {/* Products */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Productos</h4>
                        <div className="space-y-2">
                          {(order?.items ?? []).map((item: any) => (
                            <div key={item?.id ?? Math.random()} className="flex justify-between text-sm">
                              <span>{item?.productName ?? ""} x{item?.quantity ?? 0}</span>
                              <span className="font-medium">${Number(item?.total ?? 0).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal</span>
                              <span>${Number(order?.subtotal ?? 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Envío</span>
                              <span>${Number(order?.deliveryFee ?? 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold mt-1">
                              <span>Total</span>
                              <span>${Number(order?.total ?? 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        {order?.notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800"><strong>Notas del cliente:</strong> {order.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Cambiar Estado</h4>
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map((opt) => (
                            <Button
                              key={opt.value}
                              size="sm"
                              variant={order?.status === opt.value ? "default" : "outline"}
                              onClick={() => updateOrderStatus(order.id, opt.value)}
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                        <h4 className="font-semibold text-gray-900 mt-4 mb-2">Notas Admin</h4>
                        <Textarea
                          placeholder="Notas internas..."
                          defaultValue={order?.adminNotes ?? ""}
                          onBlur={(e) => updateOrderNotes(order.id, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
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
