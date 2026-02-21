"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

          {(items?.length ?? 0) === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-500 mb-6">Agrega productos para comenzar tu pedido</p>
              <Link href="/productos">
                <Button size="lg">
                  Ver Productos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {(items ?? []).map((item) => (
                    <motion.div
                      key={item?.productId ?? Math.random()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                    >
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item?.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item?.name ?? "Producto"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingCart className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item?.name ?? "Sin nombre"}</h3>
                        <p className="text-emerald-600 font-medium">
                          ${Number(item?.price ?? 0).toFixed(2)} /{item?.unit ?? "pieza"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item?.productId ?? "", (item?.quantity ?? 1) - 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item?.quantity ?? 0}</span>
                          <button
                            onClick={() => updateQuantity(item?.productId ?? "", (item?.quantity ?? 0) + 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${(Number(item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item?.productId ?? "")}
                          className="text-red-500 hover:text-red-600 mt-2 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${(total ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío</span>
                      <span className="text-emerald-600">Por calcular</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(total ?? 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Continuar al checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
