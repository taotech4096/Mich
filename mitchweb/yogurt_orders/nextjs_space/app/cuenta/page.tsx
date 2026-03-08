"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { User, Package, RefreshCw, MapPin, Settings } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const menuItems = [
    { href: "/cuenta/pedidos", icon: Package, label: "Mis Pedidos", desc: "Ver historial de pedidos" },
    { href: "/cuenta/suscripciones", icon: RefreshCw, label: "Mis Suscripciones", desc: "Gestionar entregas recurrentes" },
    { href: "/cuenta/direcciones", icon: MapPin, label: "Mis Direcciones", desc: "Agregar o editar direcciones" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session?.user?.name ?? "Mi Cuenta"}
                </h1>
                <p className="text-gray-600">{session?.user?.email ?? ""}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{item.label}</h2>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
