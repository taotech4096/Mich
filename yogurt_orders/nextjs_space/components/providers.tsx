"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect, ReactNode } from "react";
import { CartProvider } from "@/components/cart-context";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <CartProvider>
        <div style={{ visibility: mounted ? "visible" : "hidden" }}>
          {children}
        </div>
      </CartProvider>
    </SessionProvider>
  );
}
