"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { api } from "@/lib/api";
import { ProductCard } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

function SearchInner() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<ProductCard[]>([]);

  const run = async (term: string) => {
    const data = await api.products({ q: term, size: 40 });
    setProducts(data.content);
  };

  useEffect(() => {
    if (q) run(q).catch(() => setProducts([]));
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(q).catch(() => setProducts([]));
  };

  return (
    <main className="container-xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-navy">
        Search <em className="not-italic text-gold">products</em>
      </h1>
      <form onSubmit={onSubmit} className="my-6 flex gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-full border border-black/10 bg-apple-gray px-5 py-3 outline-none focus:ring-2 focus:ring-gold/40" placeholder="Search for products..." />
        <button className="btn-gold">Search</button>
      </form>
      <ProductGrid products={products} />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
