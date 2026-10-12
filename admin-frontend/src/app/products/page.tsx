"use client";

import { Pagination } from "@/components/Pagination";
import { confirmDelete, Empty, PageHeader, Panel } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type Product = { id: number; name: string; price: number; stock: number; brand: string; featured: boolean };

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsInner />
    </Suspense>
  );
}

function ProductsInner() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const load = () => adminRequest<Product[]>("/admin/products").then(setProducts).catch(() => setProducts([]));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(term));
  }, [products, q]);

  useEffect(() => {
    setPage(1);
  }, [q, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length.toLocaleString()} in catalog`}
        action={
          <Link href="/products/new" className="btn-primary">
            Add product
          </Link>
        }
      />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
        placeholder="Search products or brands"
        className="field mb-4 max-w-sm"
      />
      <Panel>
        {!filtered.length ? (
          <Empty>{products.length ? "No matching products." : "No products yet."}</Empty>
        ) : (
          <table className="w-full text-left text-[14px]">
            <thead className="text-[12px] text-apple-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Brand</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr key={product.id} className="border-t border-black/5">
                  <td className="px-5 py-3.5 font-medium text-navy">
                    {product.name}
                    {product.featured && <span className="ml-2 rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-gold">Featured</span>}
                  </td>
                  <td className="px-5 py-3.5 text-navy/70">{product.brand}</td>
                  <td className="px-5 py-3.5">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3.5 text-navy/70">{product.stock}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/products/${product.id}`} className="text-[13px] font-medium text-gold hover:underline">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="ml-4 text-[13px] text-apple-muted hover:text-rose-600"
                      onClick={async () => {
                        if (!confirmDelete(product.name)) return;
                        await adminRequest(`/admin/products/${product.id}`, { method: "DELETE" });
                        load();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <Pagination
            page={current}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        )}
      </Panel>
    </div>
  );
}
