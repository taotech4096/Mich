"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirect);
    }
  }, [status, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales invalidas");
      } else {
        router.replace(redirect);
      }
    } catch {
      setError("Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 py-14">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="hidden lg:block relative rounded-3xl overflow-hidden border border-amber-200 min-h-[560px]">
            <Image src="/mitch/white-4.jpg" alt="Mitch Seco" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-indigo-900/10" />
            <div className="absolute bottom-0 p-8 text-white">
              <p className="font-display text-5xl leading-none mb-3">Mitch Seco</p>
              <p className="text-amber-100">Sabor artesanal directo a tu hogar.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <Image src="/mitch/logo.png" alt="Mitch Seco" width={200} height={86} className="h-14 w-auto mx-auto mb-4" />
              <h1 className="font-display text-5xl text-indigo-950">Iniciar Sesion</h1>
              <p className="text-stone-600 mt-2">Accede a tu cuenta para hacer pedidos</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Correo electronico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Contrasena</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="pl-10 border-stone-300 focus-visible:ring-indigo-900"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-indigo-900 hover:bg-indigo-800" size="lg">
                {loading ? "Iniciando..." : "Iniciar Sesion"}
              </Button>
            </form>

            <p className="text-center text-sm text-stone-600 mt-6">
              No tienes cuenta?{" "}
              <Link href="/registro" className="text-amber-700 hover:underline font-semibold">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
