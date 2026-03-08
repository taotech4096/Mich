"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, Check, AlertCircle } from "lucide-react";

export default function AddressesPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [newAddress, setNewAddress] = useState({
    street: "", number: "", interior: "", colony: "", city: "Puebla", zipCode: "", reference: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = () => {
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!newAddress.street || !newAddress.number || !newAddress.colony || !newAddress.city || !newAddress.zipCode) {
      setError("Completa los campos requeridos");
      return;
    }

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error");
      setAddresses([...addresses, data]);
      setShowForm(false);
      setNewAddress({ street: "", number: "", interior: "", colony: "", city: "Puebla", zipCode: "", reference: "" });
      setError("");
    } catch (err: any) {
      setError(err?.message ?? "Error al agregar dirección");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mis Direcciones</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Nueva Dirección</h2>
              <p className="text-sm text-amber-600 font-medium mb-4">
                ⚠️ Solo entregamos en Puebla y Cholula
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Calle *" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Número *" value={newAddress.number} onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })} />
                    <Input placeholder="Interior" value={newAddress.interior} onChange={(e) => setNewAddress({ ...newAddress, interior: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Colonia *" value={newAddress.colony} onChange={(e) => setNewAddress({ ...newAddress, colony: e.target.value })} />
                  <select
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="h-10 rounded-lg border border-gray-300 px-3"
                  >
                    <option value="Puebla">Puebla</option>
                    <option value="Cholula">Cholula</option>
                    <option value="San Andrés Cholula">San Andrés Cholula</option>
                    <option value="San Pedro Cholula">San Pedro Cholula</option>
                  </select>
                </div>
                <Input placeholder="Código postal *" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} />
                <Textarea placeholder="Referencias (opcional)" value={newAddress.reference} onChange={(e) => setNewAddress({ ...newAddress, reference: e.target.value })} />
                <div className="flex gap-2">
                  <Button onClick={handleSubmit}>Guardar</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : (addresses?.length ?? 0) === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No tienes direcciones guardadas</h2>
              <p className="text-gray-500">Agrega una dirección para hacer tu primer pedido</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr: any) => (
                <div key={addr?.id ?? Math.random()} className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {addr?.street ?? ""} #{addr?.number ?? ""}{addr?.interior ? ` Int. ${addr.interior}` : ""}
                      </span>
                      {addr?.isDefault && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Principal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {addr?.colony ?? ""}, {addr?.city ?? ""} {addr?.zipCode ?? ""}
                    </p>
                    {addr?.reference && (
                      <p className="text-sm text-gray-500 mt-1">Ref: {addr.reference}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
