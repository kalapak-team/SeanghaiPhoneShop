"use client";

import { confirmDelete, Empty, PageHeader, Panel } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";

type Category = { id: number; name: string };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const load = () => adminRequest<Category[]>("/admin/categories").then(setItems).catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await adminRequest("/admin/categories", { method: "POST", body: JSON.stringify({ name }) });
    setName("");
    load();
  };

  return (
    <div>
      <PageHeader title="Categories" description="Store navigation: Smartphone, Tablet, Watch and more." />
      <form onSubmit={onSubmit} className="mb-6 flex max-w-md gap-3">
        <input className="field" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary shrink-0">Add</button>
      </form>
      <Panel>
        {!items.length ? (
          <Empty>No categories yet.</Empty>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b border-black/5 px-5 py-3.5 last:border-0">
                <p className="text-[14px] font-medium">{item.name}</p>
                <button
                  type="button"
                  className="text-[13px] text-apple-muted hover:text-rose-600"
                  onClick={async () => {
                    if (!confirmDelete(item.name)) return;
                    await adminRequest(`/admin/categories/${item.id}`, { method: "DELETE" });
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
