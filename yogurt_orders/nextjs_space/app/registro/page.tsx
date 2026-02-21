"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Error al registrarse");
      }

      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.replace("/");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 py-14">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="hidden lg:block relative rounded-3xl overflow-hidden border border-amber-200 min-h-[620px]">
            <Image src="/mitch/white-5.jpg" alt="Mitch Seco" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-indigo-900/10" />
            <div className="absolute bottom-0 p-8 text-white">
              <p className="font-display text-5xl leading-none mb-3">Bienvenida</p>
              <p className="text-amber-100">Crea tu cuenta y empieza a pedir en linea.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <Image src="/mitch/logo.png" alt="Mitch Seco" width={200} height={86} className="h-14 w-auto mx-auto mb-4" />
              <h1 className="font-display text-5xl text-indigo-950">Crear Cuenta</h1>
              <p className="text-stone-600 mt-2">Registrate para hacer tus pedidos</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Correo electronico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Telefono (opcional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="222 123 4567"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contrasena</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimo 6 caracteres"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Confirmar contrasena</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repite tu contrasena"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-indigo-900 hover:bg-indigo-800" size="lg">
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <p className="text-center text-sm text-stone-600 mt-6">
              Ya tienes cuenta?{" "}
              <Link href="/login" className="text-amber-700 hover:underline font-semibold">
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
