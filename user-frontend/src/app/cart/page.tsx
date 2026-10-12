"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export default function CartPage() {
  const { items, update, remove, total } = useCart();

  return (
    <main className="container-xl py-10">
      <h1 className="text-3xl font-extrabold text-navy">Your Cart</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-slate-500">Your cart is empty. <Link href="/products" className="text-gold">Continue shopping</Link></p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <img src={item.image || ""} alt="" className="h-20 w-20 object-contain" />
                <div className="flex-1">
                  <Link href={`/products/${item.slug}`} className="font-semibold hover:text-gold">{item.name}</Link>
                  <p className="text-gold">{formatPrice(item.price)}</p>
                </div>
                <input type="number" min={1} value={item.quantity} onChange={(e) => update(item.productId, Number(e.target.value))} className="w-16 rounded border px-2 py-1" />
                <button onClick={() => remove(item.productId)} className="text-sm text-rose-500">Remove</button>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-2xl bg-slate-50 p-6">
            <h2 className="font-bold">Order summary</h2>
            <p className="mt-4 flex justify-between"><span>Total</span><span className="text-gold">{formatPrice(total)}</span></p>
            <Link href="/checkout" className="btn-gold mt-6 block text-center">Checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
