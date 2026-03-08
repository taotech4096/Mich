"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: any;
    imageUrl?: string | null;
    unit: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product?.id ?? "",
      name: product?.name ?? "",
      price: Number(product?.price ?? 0),
      imageUrl: product?.imageUrl ?? undefined,
      unit: product?.unit ?? "pieza",
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = (product?.stock ?? 0) <= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Cantidad:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            disabled={isOutOfStock}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            disabled={isOutOfStock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock || added}
        className="w-full h-14 text-lg"
        size="lg"
      >
        {added ? (
          <>
            <Check className="w-5 h-5 mr-2" /> Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 mr-2" /> Agregar al carrito
          </>
        )}
      </Button>

      {isOutOfStock && (
        <p className="text-red-600 text-sm text-center">
          Este producto no está disponible actualmente
        </p>
      )}
    </div>
  );
}
