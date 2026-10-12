"use client";

import { Field, PageHeader } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type Option = { id: number; name: string };

export default function ProductFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const [brands, setBrands] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    stock: "10",
    brandId: "",
    categoryId: "",
    images: "",
    featured: false,
    condition: "NEW",
    warranty: "1 year warranty"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest<Option[]>("/admin/brands").then(setBrands);
    adminRequest<Option[]>("/admin/categories").then(setCategories);
    if (!isNew) {
      adminRequest<Record<string, unknown>>(`/admin/products/${params.id}`).then((p) => {
        const brand = p.brand as { id?: number } | undefined;
        const category = p.category as { id?: number } | undefined;
        setForm({
          name: String(p.name || ""),
          description: String(p.description || ""),
          price: String(p.price || ""),
          compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
          stock: String(p.stock || 0),
          brandId: String(brand?.id || ""),
          categoryId: String(category?.id || ""),
          images: ((p.images as string[]) || []).join(", "),
          featured: !!p.featured,
          condition: String(p.condition || "NEW"),
          warranty: String(p.warranty || "")
        });
      });
    }
  }, [isNew, params.id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      condition: form.condition,
      warranty: form.warranty,
      active: true
    };
    try {
      if (isNew) await adminRequest("/admin/products", { method: "POST", body: JSON.stringify(payload) });
      else await adminRequest(`/admin/products/${params.id}`, { method: "PUT", body: JSON.stringify(payload) });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setPending(false);
    }
  };

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <PageHeader title={isNew ? "New product" : "Edit product"} description="Catalog details shown on the store." />
      <div className="space-y-4 rounded-2xl bg-white p-6">
        <Field label="Name">
          <input className="field" required value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Description">
          <textarea className="field h-24 py-2.5" value={form.description} onChange={set("description")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price">
            <input className="field" type="number" step="0.01" required value={form.price} onChange={set("price")} />
          </Field>
          <Field label="Compare-at price">
            <input className="field" type="number" step="0.01" value={form.compareAtPrice} onChange={set("compareAtPrice")} />
          </Field>
          <Field label="Stock">
            <input className="field" type="number" value={form.stock} onChange={set("stock")} />
          </Field>
          <Field label="Warranty">
            <input className="field" value={form.warranty} onChange={set("warranty")} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand">
            <select className="field" required value={form.brandId} onChange={set("brandId")}>
              <option value="">Select</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select className="field" required value={form.categoryId} onChange={set("categoryId")}>
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Image URLs">
          <input className="field" value={form.images} onChange={set("images")} placeholder="Comma-separated" />
        </Field>
        <label className="flex items-center gap-3 text-[14px] text-navy">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#0071e3]" />
          Featured on the home page
        </label>
        {error && <p className="text-[13px] text-rose-500">{error}</p>}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Saving…" : "Save"}
          </button>
          <Link href="/products" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
