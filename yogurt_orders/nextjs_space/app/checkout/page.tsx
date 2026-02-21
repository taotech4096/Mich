"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, CreditCard, Truck, Plus, RefreshCw, AlertCircle } from "lucide-react";

interface Address {
  id: string;
  street: string;
  number: string;
  interior?: string | null;
  colony: string;
  city: string;
  zipCode: string;
  reference?: string | null;
  isDefault: boolean;
}

interface DeliveryDay {
  date: string;
  label: string;
  dayOfWeek: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [deliveryDays, setDeliveryDays] = useState<DeliveryDay[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState("WEEKLY");
  const [notes, setNotes] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    number: "",
    interior: "",
    colony: "",
    city: "Puebla",
    zipCode: "",
    reference: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pendiente");
  const [paymentOptions, setPaymentOptions] = useState({
    cashEnabled: true,
    transferEnabled: true,
    mercadoPagoEnabled: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/addresses")
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data ?? []);
          const defaultAddr = (data ?? []).find((a: Address) => a?.isDefault);
          if (defaultAddr?.id) setSelectedAddress(defaultAddr.id);
        })
        .catch(console.error);

      fetch("/api/delivery-days")
        .then((res) => res.json())
        .then((data) => {
          setDeliveryDays(data ?? []);
          if (data?.[0]?.date) setSelectedDay(data[0].date);
        })
        .catch(console.error);

      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          const options = {
            cashEnabled: Boolean(data?.cashEnabled ?? true),
            transferEnabled: Boolean(data?.transferEnabled ?? true),
            mercadoPagoEnabled: Boolean(data?.mercadoPagoEnabled ?? false),
          };
          setPaymentOptions(options);
          if (options.mercadoPagoEnabled) {
            setPaymentMethod("mercado_pago");
          } else if (options.transferEnabled) {
            setPaymentMethod("transferencia");
          } else if (options.cashEnabled) {
            setPaymentMethod("efectivo");
          } else {
            setPaymentMethod("pendiente");
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.number || !newAddress.colony || !newAddress.city || !newAddress.zipCode) {
      setError("Completa los campos requeridos de la direccion");
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
      setSelectedAddress(data.id);
      setShowNewAddress(false);
      setNewAddress({ street: "", number: "", interior: "", colony: "", city: "Puebla", zipCode: "", reference: "" });
      setError("");
    } catch (err: any) {
      setError(err?.message ?? "Error al agregar direccion");
    }
  };

  const handleSubmit = async () => {
    if (!selectedAddress || !selectedDay) {
      setError("Selecciona una direccion y dia de entrega");
      return;
    }
    if ((items?.length ?? 0) === 0) {
      setError("Tu carrito esta vacio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let subscriptionId = null;
      if (isSubscription) {
        const selectedDayObj = deliveryDays.find((d) => d?.date === selectedDay);
        const subRes = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({ productId: item?.productId, quantity: item?.quantity })),
            addressId: selectedAddress,
            frequency: subscriptionFrequency,
            preferredDay: selectedDayObj?.dayOfWeek ?? "Martes",
          }),
        });
        const subData = await subRes.json();
        if (subRes.ok) subscriptionId = subData?.id;
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item?.productId, quantity: item?.quantity })),
          addressId: selectedAddress,
          deliveryDay: selectedDay,
          notes,
          paymentMethod,
          subscriptionId,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData?.error ?? "Error al crear pedido");

      if (paymentMethod === "mercado_pago") {
        const prefRes = await fetch("/api/payments/mercadopago/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderData?.id }),
        });
        const prefData = await prefRes.json();
        if (!prefRes.ok) {
          throw new Error(prefData?.error ?? "No se pudo iniciar el pago con Mercado Pago");
        }

        const redirectUrl = prefData?.initPoint ?? prefData?.sandboxInitPoint;
        if (!redirectUrl) {
          throw new Error("Mercado Pago no devolvio una URL de pago");
        }
        clearCart();
        window.location.href = redirectUrl;
        return;
      }

      clearCart();
      router.push(`/checkout/confirmacion?order=${orderData?.orderNumber ?? ""}`);
    } catch (err: any) {
      setError(err?.message ?? "Error al procesar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Header />
        <main className="flex-1 py-8 bg-stone-50">
          <div className="max-w-4xl mx-auto px-4 text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-stone-600">Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 bg-gradient-to-br from-stone-100 via-amber-50/40 to-stone-100">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-5xl text-indigo-950 mb-8">Finalizar Pedido</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-stone-900">Direccion de Entrega</h2>
              </div>

              {addresses?.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr?.id ?? Math.random()}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAddress === addr?.id ? "border-amber-400 bg-amber-50" : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr?.id ?? ""}
                        checked={selectedAddress === addr?.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="sr-only"
                      />
                      <div className="font-medium text-stone-900">
                        {addr?.street ?? ""} #{addr?.number ?? ""}
                        {addr?.interior ? ` Int. ${addr.interior}` : ""}
                      </div>
                      <div className="text-sm text-stone-600">
                        {addr?.colony ?? ""}, {addr?.city ?? ""} {addr?.zipCode ?? ""}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 mb-4">No tienes direcciones guardadas</p>
              )}

              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="mt-4 text-indigo-900 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Agregar nueva direccion
              </button>

              {showNewAddress && (
                <div className="mt-4 p-4 bg-stone-50 rounded-lg space-y-4 border border-stone-200">
                  <p className="text-sm text-amber-700 font-medium">Solo entregamos en Puebla y Cholula</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Calle *" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Numero *" value={newAddress.number} onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })} />
                      <Input placeholder="Interior" value={newAddress.interior} onChange={(e) => setNewAddress({ ...newAddress, interior: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Colonia *" value={newAddress.colony} onChange={(e) => setNewAddress({ ...newAddress, colony: e.target.value })} />
                    <select
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="h-10 rounded-lg border border-stone-300 px-3 bg-white"
                    >
                      <option value="Puebla">Puebla</option>
                      <option value="Cholula">Cholula</option>
                      <option value="San Andres Cholula">San Andres Cholula</option>
                      <option value="San Pedro Cholula">San Pedro Cholula</option>
                    </select>
                  </div>
                  <Input placeholder="Codigo postal *" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} />
                  <Textarea placeholder="Referencias (opcional)" value={newAddress.reference} onChange={(e) => setNewAddress({ ...newAddress, reference: e.target.value })} />
                  <Button onClick={handleAddAddress} className="bg-indigo-900 hover:bg-indigo-800">
                    Guardar direccion
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-stone-900">Dia de Entrega</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(deliveryDays ?? []).map((day) => (
                  <label
                    key={day?.date ?? Math.random()}
                    className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-colors ${
                      selectedDay === day?.date ? "border-amber-400 bg-amber-50" : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryDay"
                      value={day?.date ?? ""}
                      checked={selectedDay === day?.date}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="sr-only"
                    />
                    <div className="font-semibold text-indigo-900">{day?.dayOfWeek ?? ""}</div>
                    <div className="text-sm text-stone-600">{day?.label?.split(" ").slice(1).join(" ") ?? ""}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-stone-900">Hacer suscripcion?</h2>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-indigo-900 focus:ring-indigo-900"
                />
                <div>
                  <span className="font-medium text-stone-900">Si, quiero recibir este pedido regularmente</span>
                  <p className="text-sm text-stone-600">Recibe tus productos favoritos automaticamente</p>
                </div>
              </label>
              {isSubscription && (
                <div className="mt-4 flex gap-3">
                  {["WEEKLY", "BIWEEKLY", "MONTHLY"].map((freq) => (
                    <label
                      key={freq}
                      className={`px-4 py-2 rounded-lg border-2 cursor-pointer ${
                        subscriptionFrequency === freq ? "border-amber-400 bg-amber-50" : "border-stone-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={freq}
                        checked={subscriptionFrequency === freq}
                        onChange={(e) => setSubscriptionFrequency(e.target.value)}
                        className="sr-only"
                      />
                      {freq === "WEEKLY" && "Semanal"}
                      {freq === "BIWEEKLY" && "Quincenal"}
                      {freq === "MONTHLY" && "Mensual"}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-stone-900">Metodo de Pago</h2>
              </div>
              <div className="space-y-2">
                {paymentOptions.mercadoPagoEnabled && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercado_pago"
                      checked={paymentMethod === "mercado_pago"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Mercado Pago (tarjeta, wallet, metodos disponibles en MP)</span>
                  </label>
                )}
                {paymentOptions.transferEnabled && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Transferencia bancaria</span>
                  </label>
                )}
                {paymentOptions.cashEnabled && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="efectivo"
                      checked={paymentMethod === "efectivo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Efectivo contra entrega</span>
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Notas del pedido (opcional)</h2>
              <Textarea placeholder="Instrucciones especiales para la entrega..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">Resumen</h2>
              <div className="space-y-2 mb-4">
                {(items ?? []).map((item) => (
                  <div key={item?.productId ?? Math.random()} className="flex justify-between text-sm">
                    <span>
                      {item?.name ?? ""} x{item?.quantity ?? 0}
                    </span>
                    <span>${((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg text-indigo-950">
                  <span>Total</span>
                  <span>${(total ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-amber-900">
                  {paymentMethod === "mercado_pago" ? "Pago en linea" : "Pago Pendiente"}
                </h2>
              </div>
              <p className="text-amber-800 text-sm">
                {paymentMethod === "mercado_pago"
                  ? "Al confirmar tu pedido seras redirigido a Mercado Pago para completar el pago."
                  : "Tu pedido quedara registrado como pago pendiente. Te contactaremos para coordinar el pago."}
              </p>
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full h-14 text-lg bg-indigo-900 hover:bg-indigo-800" size="lg">
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 mr-2" /> Confirmar Pedido
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
