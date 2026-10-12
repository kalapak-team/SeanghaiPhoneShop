"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    note: ""
  });
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const order = await api.checkout({
        ...form,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      }) as { orderNumber: string };
      clear();
      setMessage(`Order placed: ${order.orderNumber}`);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Checkout failed");
    }
  };

  if (!items.length) {
    return <main className="container-xl py-16">Your cart is empty.</main>;
  }

  return (
    <main className="container-xl grid gap-8 py-10 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h1 className="text-2xl font-extrabold text-navy">Checkout</h1>
        {["customerName", "phone", "email", "address", "note"].map((field) => (
          <input
            key={field}
            required={field !== "note" && field !== "email"}
            placeholder={field}
            value={(form as Record<string, string>)[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full rounded-xl border px-4 py-3"
          />
        ))}
        {message && <p className="text-sm text-gold-dark">{message}</p>}
        <button className="btn-gold w-full">Place order · {formatPrice(total)}</button>
      </form>
      <aside className="rounded-2xl bg-slate-50 p-6">
        {items.map((item) => (
          <div key={item.productId} className="mb-3 flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </aside>
    </main>
  );
}
