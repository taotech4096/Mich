import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-200 bg-gradient-to-r from-stone-900 to-indigo-950 text-stone-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/mitch/logo.png"
              alt="Mitch Seco"
              width={220}
              height={92}
              className="h-14 w-auto object-contain mb-4 brightness-110"
            />
            <p className="text-sm text-stone-300">
              Productos artesanales frescos elaborados con ingredientes de alta calidad.
            </p>
          </div>

          <div>
            <h3 className="font-display text-2xl text-amber-200 mb-4">Enlaces</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/productos" className="block hover:text-amber-200 transition-colors">
                Productos
              </Link>
              <Link href="/cuenta" className="block hover:text-amber-200 transition-colors">
                Mi Cuenta
              </Link>
              <Link href="/carrito" className="block hover:text-amber-200 transition-colors">
                Carrito
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-display text-2xl text-amber-200 mb-4">Entrega</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Puebla y Cholula</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Martes y Viernes</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-amber-300" />
                <span>@mitch.seco</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-200/20 mt-8 pt-8 text-center text-sm text-stone-400">
          Copyright {new Date().getFullYear()} Mitch Seco. Demo visual.
        </div>
      </div>
    </footer>
  );
}
