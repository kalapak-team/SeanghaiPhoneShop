"use client";

import { CartItem, ProductCard } from "@/lib/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextValue = {
  items: CartItem[];
  add: (product: ProductCard | { id: number; name: string; slug: string; price: number; image?: string | null }, quantity?: number) => void;
  update: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "sg_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (product, quantity = 1) => {
      setItems((current) => {
        const id = "id" in product ? product.id : (product as ProductCard).id;
        const existing = current.find((item) => item.productId === id);
        if (existing) {
          return current.map((item) =>
            item.productId === id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [
          ...current,
          {
            productId: id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: "image" in product ? product.image : null,
            quantity
          }
        ];
      });
    };
    return {
      items,
      add,
      update: (productId, quantity) =>
        setItems((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)).filter((item) => item.quantity > 0)),
      remove: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
