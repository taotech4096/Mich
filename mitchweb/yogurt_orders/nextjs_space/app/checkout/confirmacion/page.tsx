import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string; payment?: string };
}) {
  const paymentStatus = String(searchParams?.payment ?? "").toLowerCase();
  const isApproved = paymentStatus === "approved";
  const isPending = paymentStatus === "pending";
  const isFailure = paymentStatus === "failure";

  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isFailure ? (
              <XCircle className="w-10 h-10 text-red-600" />
            ) : isPending ? (
              <Clock3 className="w-10 h-10 text-amber-600" />
            ) : (
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isFailure ? "Pago no completado" : "Pedido Confirmado"}
          </h1>

          <p className="text-gray-600 mb-2">
            {isFailure
              ? "Tu pedido fue registrado, pero el pago no pudo completarse."
              : isPending
              ? "Tu pedido fue registrado y el pago esta en revision."
              : isApproved
              ? "Tu pedido y pago fueron registrados exitosamente."
              : "Tu pedido ha sido registrado exitosamente."}
          </p>

          {searchParams?.order && (
            <p className="text-lg font-semibold text-emerald-600 mb-6">
              Numero de pedido: {searchParams.order}
            </p>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">Proximos pasos:</h3>
            <ul className="text-sm text-amber-700 space-y-2">
              {!isApproved && <li>- Te contactaremos para confirmar el estado del pago</li>}
              <li>- Te avisaremos cuando tu pedido entre a preparacion</li>
              <li>- Tu pedido sera entregado en el dia seleccionado</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cuenta/pedidos">
              <Button variant="outline" className="w-full sm:w-auto">
                <Package className="w-4 h-4 mr-2" /> Ver mis pedidos
              </Button>
            </Link>
            <Link href="/productos">
              <Button className="w-full sm:w-auto">
                Seguir comprando <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
