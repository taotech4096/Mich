"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Save, AlertCircle, Check } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message ?? "Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : saved ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saved ? "Guardado" : "Guardar Cambios"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" /> Información del Negocio
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
              <Input
                value={settings?.businessName ?? ""}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <Input
                value={settings?.phone ?? ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={settings?.email ?? ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <Input
                value={settings?.whatsapp ?? ""}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="522221234567"
              />
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Entregas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Días de entrega</label>
              <p className="text-sm text-gray-500 mb-2">Separados por coma</p>
              <Input
                value={(settings?.deliveryDays ?? []).join(", ")}
                onChange={(e) => setSettings({
                  ...settings,
                  deliveryDays: e.target.value.split(",").map((d: string) => d.trim()).filter(Boolean),
                })}
                placeholder="Martes, Viernes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo de envío por defecto</label>
              <Input
                type="number"
                step="0.01"
                value={settings?.defaultDeliveryFee ?? 0}
                onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pedido mínimo</label>
              <Input
                type="number"
                step="0.01"
                value={settings?.minOrderAmount ?? 0}
                onChange={(e) => setSettings({ ...settings, minOrderAmount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.cashEnabled ?? true}
                onChange={(e) => setSettings({ ...settings, cashEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-gray-900">Efectivo</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.transferEnabled ?? true}
                onChange={(e) => setSettings({ ...settings, transferEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-gray-900">Transferencia Bancaria</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.mercadoPagoEnabled ?? false}
                onChange={(e) => setSettings({ ...settings, mercadoPagoEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-gray-900">Mercado Pago</span>
            </label>
            {settings?.mercadoPagoEnabled && (
              <div className="ml-8 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  Para habilitar Mercado Pago, configura las variables de entorno:
                </p>
                <ul className="text-sm text-amber-700 mt-2 list-disc ml-4">
                  <li>MERCADOPAGO_ACCESS_TOKEN</li>
                  <li>MERCADOPAGO_PUBLIC_KEY</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Zones Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zonas de Entrega</h2>
          <p className="text-sm text-gray-600 mb-4">
            Actualmente se realizan entregas en las siguientes ciudades:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
              ✓ Puebla
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
              ✓ Cholula
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
              ✓ San Andrés Cholula
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700">
              ✓ San Pedro Cholula
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Para agregar o modificar zonas de entrega, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
