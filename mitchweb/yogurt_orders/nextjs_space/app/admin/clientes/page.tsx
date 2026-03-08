"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Search, Mail, Phone, ShoppingBag, RefreshCw, X, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  const fetchCustomers = useCallback(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    fetch(`/api/customers${params}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const loadCustomerDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      setCustomerDetails(data);
      setSelectedCustomer(data);
    } catch (error) {
      console.error("Error loading customer:", error);
    }
  };

  const updateCustomerNotes = async (id: string, notes: string) => {
    try {
      await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (customers?.length ?? 0) === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">No hay clientes</h2>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {customers.map((customer: any) => (
                <div
                  key={customer?.id ?? Math.random()}
                  className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors ${
                    selectedCustomer?.id === customer?.id ? "bg-emerald-50" : ""
                  }`}
                  onClick={() => loadCustomerDetails(customer.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">
                        {(customer?.name ?? customer?.email ?? "C")?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer?.name ?? "Sin nombre"}</p>
                      <p className="text-sm text-gray-600">{customer?.email ?? ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="flex items-center gap-1 text-gray-600">
                        <ShoppingBag className="w-4 h-4" /> {customer?._count?.orders ?? 0} pedidos
                      </p>
                      <p className="flex items-center gap-1 text-gray-600">
                        <RefreshCw className="w-4 h-4" /> {customer?._count?.subscriptions ?? 0} suscripciones
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-1">
          {selectedCustomer ? (
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Detalles del Cliente</h2>
                <button onClick={() => { setSelectedCustomer(null); setCustomerDetails(null); }} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 text-lg">{customerDetails?.name ?? "Sin nombre"}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {customerDetails?.email ?? ""}
                  </p>
                  {customerDetails?.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> {customerDetails.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Cliente desde {customerDetails?.createdAt ? new Date(customerDetails.createdAt).toLocaleDateString("es-MX") : ""}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <Textarea
                    placeholder="Agregar notas sobre este cliente..."
                    defaultValue={customerDetails?.notes ?? ""}
                    onBlur={(e) => updateCustomerNotes(customerDetails.id, e.target.value)}
                    className="text-sm"
                  />
                </div>

                {(customerDetails?.addresses?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Direcciones</h4>
                    <div className="space-y-2">
                      {customerDetails.addresses.map((addr: any) => (
                        <div key={addr?.id ?? Math.random()} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          {addr?.street ?? ""} #{addr?.number ?? ""}, {addr?.colony ?? ""}, {addr?.city ?? ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(customerDetails?.orders?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Últimos Pedidos</h4>
                    <div className="space-y-2">
                      {customerDetails.orders.slice(0, 5).map((order: any) => (
                        <div key={order?.id ?? Math.random()} className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                          <span>{order?.orderNumber ?? ""}</span>
                          <span className="font-medium">${Number(order?.total ?? 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Selecciona un cliente para ver detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
