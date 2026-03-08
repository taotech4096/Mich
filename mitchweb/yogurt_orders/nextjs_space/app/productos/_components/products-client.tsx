"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import Image from "next/image";
import { Filter } from "lucide-react";

interface ProductsClientProps {
  categories: any[];
  products: any[];
  currentCategory?: string;
}

export function ProductsClient({ categories, products, currentCategory }: ProductsClientProps) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
        <section className="relative border-b border-amber-200 bg-gradient-to-r from-stone-100 via-amber-50 to-stone-100">
          <div className="absolute inset-0 opacity-[0.08]">
            <Image src="/mitch/pattern.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-12">
            <h1 className="font-display text-5xl text-indigo-950 mb-2">Nuestros Productos</h1>
            <p className="text-stone-700 text-lg">Elige entre nuestra variedad de productos artesanales</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/productos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !currentCategory
                  ? "bg-indigo-900 text-white"
                  : "bg-white text-stone-700 border border-stone-300 hover:border-amber-400"
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Todos
            </Link>
            {(categories ?? []).map((cat: any) => (
              <Link
                key={cat?.id ?? Math.random()}
                href={`/productos?categoria=${cat?.slug ?? ""}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentCategory === cat?.slug
                    ? "bg-indigo-900 text-white"
                    : "bg-white text-stone-700 border border-stone-300 hover:border-amber-400"
                }`}
              >
                {cat?.name ?? "Categoria"}
              </Link>
            ))}
          </div>

          {(products?.length ?? 0) > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(products ?? []).map((product: any) => (
                <ProductCard key={product?.id ?? Math.random()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
              <p className="text-stone-600 text-lg">No hay productos disponibles en esta categoria.</p>
              <Link href="/productos" className="text-indigo-900 hover:underline mt-2 inline-block font-semibold">
                Ver todos los productos
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
