"use client";

import { confirmDelete, Empty, PageHeader, Panel } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";

type Brand = { id: number; name: string; slug: string; showOnHome: boolean };

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [name, setName] = useState("");
  const load = () => adminRequest<Brand[]>("/admin/brands").then(setItems).catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminRequest("/admin/brands", { method: "POST", body: JSON.stringify({ name, showOnHome: false, featured: true }) });
    setName("");
    load();
  };

  return (
    <div>
      <PageHeader title="Brands" description="Shown in Shop by brand and filters." />
      <form onSubmit={onSubmit} className="mb-6 flex max-w-md gap-3">
        <input className="field" placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary shrink-0">Add</button>
      </form>
      <Panel>
        {!items.length ? (
          <Empty>No brands yet.</Empty>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b border-black/5 px-5 py-3.5 last:border-0">
                <div>
                  <p className="text-[14px] font-medium">{item.name}</p>
                  <p className="text-[12px] text-apple-muted">{item.slug}</p>
                </div>
                <button
                  type="button"
                  className="text-[13px] text-apple-muted hover:text-rose-600"
                  onClick={async () => {
                    if (!confirmDelete(item.name)) return;
                    await adminRequest(`/admin/brands/${item.id}`, { method: "DELETE" });
                    load();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
