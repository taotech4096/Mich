"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/cart-context";
import { ShoppingCart, User, Menu, X, LogOut, Package, Home } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession() || {};
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/70 bg-stone-100/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mitch/logo.png"
              alt="Mitch Seco"
              width={190}
              height={82}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[15px]">
            <Link href="/" className="text-stone-700 hover:text-amber-700 transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Inicio
            </Link>
            <Link href="/productos" className="text-stone-700 hover:text-amber-700 transition-colors">
              Productos
            </Link>
            {session?.user ? (
              <>
                <Link href="/cuenta" className="text-stone-700 hover:text-amber-700 transition-colors flex items-center gap-1">
                  <User className="w-4 h-4" /> Mi Cuenta
                </Link>
                <Link href="/cuenta/pedidos" className="text-stone-700 hover:text-amber-700 transition-colors flex items-center gap-1">
                  <Package className="w-4 h-4" /> Mis Pedidos
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="font-semibold text-indigo-900 hover:text-indigo-700 transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-stone-700 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="text-stone-700 hover:text-amber-700 transition-colors">
                Iniciar Sesion
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/carrito"
              className="relative rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 p-2 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-stone-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-amber-200 pt-4 space-y-3 text-stone-700">
            <Link href="/" className="block hover:text-amber-700" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="block hover:text-amber-700" onClick={() => setMenuOpen(false)}>
              Productos
            </Link>
            {session?.user ? (
              <>
                <Link href="/cuenta" className="block hover:text-amber-700" onClick={() => setMenuOpen(false)}>
                  Mi Cuenta
                </Link>
                <Link href="/cuenta/pedidos" className="block hover:text-amber-700" onClick={() => setMenuOpen(false)}>
                  Mis Pedidos
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block font-semibold text-indigo-900" onClick={() => setMenuOpen(false)}>
                    Panel de Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMenuOpen(false);
                  }}
                  className="block hover:text-red-700"
                >
                  Cerrar Sesion
                </button>
              </>
            ) : (
              <Link href="/login" className="block hover:text-amber-700" onClick={() => setMenuOpen(false)}>
                Iniciar Sesion
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
