"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCw, Sparkles, ChevronRight } from "lucide-react";

interface HomeClientProps {
  categories: any[];
  featuredProducts: any[];
}

const heroGallery = ["/mitch/white-3.jpg", "/mitch/white-4.jpg", "/mitch/white-5.jpg"];

export function HomeClient({ categories, featuredProducts }: HomeClientProps) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <section className="relative overflow-hidden border-b border-amber-200/70 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
          <div className="absolute inset-0 opacity-[0.08]">
            <Image src="/mitch/pattern.png" alt="" fill className="object-cover" />
          </div>
          <div className="absolute -top-20 -right-24 w-72 h-72 rounded-full bg-indigo-900/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-20 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/70 px-4 py-1 text-sm font-semibold text-amber-800 mb-5">
                <Sparkles className="w-4 h-4" /> Edicion demo con assets Mitch
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-indigo-950 mb-6">
                Mitch Seco
                <span className="block text-amber-700">sabor artesanal</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-700 mb-8 max-w-xl">
                Yogurts, jocoque y mas productos frescos con imagen de marca renovada.
                Entregas en Puebla y Cholula.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/productos"
                  className="bg-indigo-950 text-white px-7 py-3 rounded-xl font-semibold hover:bg-indigo-900 transition-colors inline-flex items-center gap-2"
                >
                  Ver Productos <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/registro"
                  className="bg-white text-amber-900 border border-amber-300 px-7 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {heroGallery.map((src, idx) => (
                <div
                  key={src}
                  className={`relative rounded-2xl overflow-hidden shadow-xl border border-amber-200 ${
                    idx === 1 ? "mt-10" : ""
                  }`}
                >
                  <div className="aspect-[3/4] relative">
                    <Image src={src} alt="Producto Mitch" fill className="object-cover" priority />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Truck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-950 mb-1">Entrega a Domicilio</h3>
                  <p className="text-sm text-stone-600">Martes y viernes en Puebla y Cholula</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-indigo-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-950 mb-1">Suscripciones</h3>
                  <p className="text-sm text-stone-600">Recibe tus favoritos cada semana o mes</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-950 mb-1">Hecho con Cuidado</h3>
                  <p className="text-sm text-stone-600">Productos frescos de produccion artesanal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {(categories?.length ?? 0) > 0 && (
          <section className="py-16 bg-stone-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-4xl text-indigo-950">Categorias</h2>
                <Link href="/productos" className="text-indigo-900 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  Ver todas <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(categories ?? []).map((cat: any, idx: number) => (
                  <Link
                    key={cat?.id ?? idx}
                    href={`/productos?categoria=${cat?.slug ?? ""}`}
                    className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-stone-200"
                  >
                    <Image
                      src={idx % 2 === 0 ? "/mitch/white-4.jpg" : "/mitch/fresa.jpg"}
                      alt={cat?.name ?? "Categoria"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <span className="text-white text-xl font-semibold leading-tight">
                        {cat?.name ?? "Categoria"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {(featuredProducts?.length ?? 0) > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-4xl text-indigo-950">Productos Destacados</h2>
                <Link href="/productos" className="text-indigo-900 hover:text-indigo-700 font-semibold flex items-center gap-1">
                  Ver todos <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(featuredProducts ?? []).map((product: any) => (
                  <ProductCard key={product?.id ?? Math.random()} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gradient-to-r from-indigo-950 via-indigo-900 to-amber-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-4">Listo para probar Mitch Seco?</h2>
            <p className="text-amber-100 mb-8 text-lg">
              Crea tu cuenta y recibe productos artesanales en la comodidad de tu hogar.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-xl font-semibold hover:bg-stone-100 transition-colors text-lg"
            >
              Crear Cuenta Gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
