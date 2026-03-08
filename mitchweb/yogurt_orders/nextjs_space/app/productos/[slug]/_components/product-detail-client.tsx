"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductDetailClientProps {
  product: any;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const hasDiscount = product?.comparePrice && Number(product.comparePrice) > Number(product.price);

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a productos
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="aspect-square relative bg-gray-100 rounded-2xl overflow-hidden">
              {product?.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product?.name ?? "Producto"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="w-24 h-24" />
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
                  Oferta
                </span>
              )}
            </div>

            {/* Details */}
            <div>
              {product?.category?.name && (
                <span className="text-sm text-emerald-600 font-medium uppercase tracking-wide">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                {product?.name ?? "Sin nombre"}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${Number(product?.price ?? 0).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    ${Number(product.comparePrice).toFixed(2)}
                  </span>
                )}
                <span className="text-gray-500">/{product?.unit ?? "pieza"}</span>
              </div>

              {product?.description && (
                <div className="prose prose-sm text-gray-600 mb-6">
                  <p>{product.description}</p>
                </div>
              )}

              <div className="mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    (product?.stock ?? 0) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {(product?.stock ?? 0) > 0 ? "Disponible" : "Agotado"}
                </span>
              </div>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
