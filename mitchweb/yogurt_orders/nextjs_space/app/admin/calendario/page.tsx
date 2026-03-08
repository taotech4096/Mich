"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Printer, MapPin, Package } from "lucide-react";

export default function CalendarPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const getDeliveryDays = () => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 28);

    let currentDate = new Date(today);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === 2 || currentDate.getDay() === 5) {
        days.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const deliveryDays = getDeliveryDays();

  const getOrdersForDate = (date: Date) => {
    return (orders ?? []).filter((order: any) => {
      if (!order?.deliveryDay) return false;
      const orderDate = new Date(order.deliveryDay);
      return (
        orderDate.getDate() === date.getDate() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatDate = (date: Date) => {
    const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const selectedOrders = getOrdersForDate(selectedDate);
  const pendingOrders = selectedOrders.filter((o: any) => o?.status !== "DELIVERED" && o?.status !== "CANCELLED");

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Lista de Entregas - ${formatDate(selectedDate)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 20px; margin-bottom: 20px; }
            .order { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; page-break-inside: avoid; }
            .order-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .customer { font-weight: bold; }
            .products { margin: 10px 0; }
            .address { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>Lista de Entregas - ${formatDate(selectedDate)}</h1>
          ${pendingOrders.map((order: any) => `
            <div class="order">
              <div class="order-header">
                <span class="customer">${order?.user?.name ?? order?.user?.email ?? "Cliente"}</span>
                <span>${order?.orderNumber ?? ""}</span>
              </div>
              <div class="products">
                ${(order?.items ?? []).map((item: any) => `${item?.productName ?? ""} x${item?.quantity ?? 0}`).join(" | ")}
              </div>
              <div class="address">
                ${order?.address?.street ?? ""} #${order?.address?.number ?? ""}
                ${order?.address?.interior ? ` Int. ${order.address.interior}` : ""}, 
                ${order?.address?.colony ?? ""}, ${order?.address?.city ?? ""}
                ${order?.address?.reference ? `<br>Ref: ${order.address.reference}` : ""}
              </div>
              ${order?.notes ? `<div style="margin-top: 10px; color: #b45309;">Nota: ${order.notes}</div>` : ""}
            </div>
          `).join("")}
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendario de Entregas</h1>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" /> Proximas Entregas
              </h2>
              <div className="space-y-2">
                {deliveryDays.map((date) => {
                  const dayOrders = getOrdersForDate(date);
                  const pending = dayOrders.filter((o: any) => o?.status !== "DELIVERED" && o?.status !== "CANCELLED");
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        isSelected
                          ? "bg-emerald-100 border-2 border-emerald-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`font-medium ${isToday ? "text-emerald-600" : "text-gray-900"}`}>
                            {formatDate(date)}
                          </span>
                          {isToday && <span className="ml-2 text-xs text-emerald-600">(Hoy)</span>}
                        </div>
                        {pending.length > 0 && (
                          <Badge variant="default">{pending.length}</Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Entregas para {formatDate(selectedDate)}
                </h2>
                {pendingOrders.length > 0 && (
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="w-4 h-4 mr-2" /> Imprimir Lista
                  </Button>
                )}
              </div>

              {pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No hay entregas pendientes para este dia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order: any) => (
                    <div key={order?.id ?? Math.random()} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-medium text-gray-900">{order?.user?.name ?? order?.user?.email ?? "Cliente"}</span>
                          <span className="ml-2 text-sm text-gray-500">{order?.orderNumber ?? ""}</span>
                        </div>
                        <span className="font-bold text-gray-900">${Number(order?.total ?? 0).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {(order?.items ?? []).map((item: any) => (
                          <span key={item?.id ?? Math.random()} className="mr-3">
                            {item?.productName ?? ""} x{item?.quantity ?? 0}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-start gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {order?.address?.street ?? ""} #{order?.address?.number ?? ""}
                          {order?.address?.interior ? ` Int. ${order.address.interior}` : ""}, 
                          {order?.address?.colony ?? ""}, {order?.address?.city ?? ""}
                        </span>
                      </div>
                      {order?.notes && (
                        <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                          <strong>Nota:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
