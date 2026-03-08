"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    imageUrl?: string | null;
    unit: string;
    category?: { name: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = product?.comparePrice && Number(product.comparePrice) > Number(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product?.id ?? "",
      name: product?.name ?? "",
      price: Number(product?.price ?? 0),
      imageUrl: product?.imageUrl ?? undefined,
      unit: product?.unit ?? "pieza",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/productos/${product?.slug ?? ""}`} className="block group">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
          <div className="aspect-square relative bg-gray-100">
            {product?.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product?.name ?? "Producto"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                Oferta
              </span>
            )}
          </div>
          <div className="p-4">
            {product?.category?.name && (
              <span className="text-xs text-amber-700 font-medium uppercase tracking-wide">
                {product.category.name}
              </span>
            )}
            <h3 className="font-semibold text-gray-800 mt-1 group-hover:text-indigo-900 transition-colors">
              {product?.name ?? "Sin nombre"}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  ${Number(product?.price ?? 0).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    ${Number(product.comparePrice).toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-1">/{product?.unit ?? "pieza"}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-indigo-900 hover:bg-indigo-800 text-white p-2 rounded-lg transition-colors"
                aria-label="Agregar al carrito"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
