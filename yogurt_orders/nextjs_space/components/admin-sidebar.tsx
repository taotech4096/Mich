"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CalendarDays,
  RefreshCw,
  Settings,
  ChevronLeft,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/productos", icon: Package, label: "Productos" },
  { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/clientes", icon: Users, label: "Clientes" },
  { href: "/admin/suscripciones", icon: RefreshCw, label: "Suscripciones" },
  { href: "/admin/calendario", icon: CalendarDays, label: "Calendario" },
  { href: "/admin/configuracion", icon: Settings, label: "Configuración" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver a la tienda</span>
        </Link>
      </div>
    </aside>
  );
}
