"use client";

import { confirmDelete, Empty, Field, PageHeader, Panel } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";

type Banner = { id: number; title: string; subtitle?: string; imageUrl?: string; active: boolean };

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "/products" });
  const load = () => adminRequest<Banner[]>("/admin/banners").then(setItems).catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await adminRequest("/admin/banners", { method: "POST", body: JSON.stringify({ ...form, active: true, sortOrder: 99 }) });
    setForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "/products" });
    load();
  };

  return (
    <div>
      <PageHeader title="Banners" description="Hero slides on the store home page." />
      <form onSubmit={onSubmit} className="mb-8 grid max-w-2xl gap-4 rounded-2xl bg-white p-6 sm:grid-cols-2">
        <Field label="Title">
          <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <input className="field" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Image URL">
            <input className="field" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </Field>
        </div>
        <button className="btn-primary w-fit">Add banner</button>
      </form>
      <Panel>
        {!items.length ? (
          <Empty>No banners yet.</Empty>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-4 last:border-0">
                <div>
                  <p className="text-[14px] font-medium">{item.title}</p>
                  {item.subtitle && <p className="text-[13px] text-apple-muted">{item.subtitle}</p>}
                </div>
                <button
                  type="button"
                  className="text-[13px] text-apple-muted hover:text-rose-600"
                  onClick={async () => {
                    if (!confirmDelete(item.title)) return;
                    await adminRequest(`/admin/banners/${item.id}`, { method: "DELETE" });
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
