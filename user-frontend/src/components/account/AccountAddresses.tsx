"use client";

import { errorMessage, Notice, PrimaryButton, SectionHeader, TextButton, TextField } from "@/components/account/ui";
import { api } from "@/lib/api";
import type { Address, AddressInput, AuthUser } from "@/lib/types";
import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const EMPTY: AddressInput = { label: "", recipientName: "", phone: "", line1: "", line2: "", city: "Phnom Penh", defaultAddress: false };

export function AccountAddresses({ user }: { user: AuthUser }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<AddressInput>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    api
      .addresses()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm({ ...EMPTY, recipientName: user.name, phone: user.phone || "", defaultAddress: addresses.length === 0 });
    setError("");
    setEditingId("new");
  };

  const openEdit = (a: Address) => {
    setForm({ label: a.label || "", recipientName: a.recipientName, phone: a.phone, line1: a.line1, line2: a.line2 || "", city: a.city, defaultAddress: a.defaultAddress });
    setError("");
    setEditingId(a.id);
  };

  const set = (key: keyof AddressInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId === "new") await api.createAddress(form);
      else if (typeof editingId === "number") await api.updateAddress(editingId, form);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(errorMessage(err, "Could not save this address."));
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (a: Address) => {
    await api.updateAddress(a.id, { ...a, line2: a.line2 || "", label: a.label || "", defaultAddress: true });
    await load();
  };

  const remove = async (a: Address) => {
    if (!window.confirm("Remove this address?")) return;
    await api.deleteAddress(a.id);
    await load();
  };

  return (
    <section>
      <SectionHeader
        title="Addresses"
        description="Save delivery addresses for faster checkout."
        action={editingId === null && addresses.length > 0 && <TextButton onClick={openNew}>Add address</TextButton>}
      />

      {editingId !== null ? (
        <form onSubmit={onSubmit} className="mt-8 max-w-lg space-y-4">
          <h3 className="text-[17px] font-medium text-navy">{editingId === "new" ? "New address" : "Edit address"}</h3>
          <TextField label="Label (optional)" value={form.label || ""} onChange={set("label")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Recipient name" value={form.recipientName} onChange={set("recipientName")} autoComplete="name" required />
            <TextField label="Phone" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" required />
          </div>
          <TextField label="Street address" value={form.line1} onChange={set("line1")} autoComplete="address-line1" required />
          <TextField label="Apartment, building, floor (optional)" value={form.line2 || ""} onChange={set("line2")} autoComplete="address-line2" />
          <TextField label="City / Province" value={form.city} onChange={set("city")} autoComplete="address-level1" required />
          <label className="flex items-center gap-3 pt-1 text-[14px] text-navy">
            <input
              type="checkbox"
              checked={!!form.defaultAddress}
              onChange={(e) => setForm((f) => ({ ...f, defaultAddress: e.target.checked }))}
              className="h-4 w-4 accent-[#0071e3]"
            />
            Use as default delivery address
          </label>
          {error && <Notice tone="error">{error}</Notice>}
          <div className="flex items-center gap-5 pt-2">
            <PrimaryButton disabled={saving}>{saving ? "Saving…" : "Save address"}</PrimaryButton>
            <TextButton tone="muted" onClick={() => setEditingId(null)}>
              Cancel
            </TextButton>
          </div>
        </form>
      ) : loading ? (
        <p className="mt-8 text-[15px] text-apple-muted">Loading…</p>
      ) : addresses.length === 0 ? (
        <button
          type="button"
          onClick={openNew}
          className="mt-8 flex w-full max-w-sm flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 px-6 py-12 text-center transition hover:border-gold hover:bg-apple-gray"
        >
          <Plus size={20} className="text-gold" />
          <span className="text-[15px] font-medium text-navy">Add your first address</span>
          <span className="text-[13px] text-apple-muted">We&apos;ll use it to speed up checkout.</span>
        </button>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className={`rounded-2xl border p-5 ${a.defaultAddress ? "border-gold/40 bg-gold/[0.03]" : "border-black/10"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-medium text-navy">{a.label || a.recipientName}</p>
                {a.defaultAddress && <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">Default</span>}
              </div>
              <div className="mt-2 space-y-0.5 text-[14px] text-navy/80">
                {a.label && <p>{a.recipientName}</p>}
                <p>{a.line1}</p>
                {a.line2 && <p>{a.line2}</p>}
                <p>{a.city}</p>
                <p className="text-apple-muted">{a.phone}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <TextButton onClick={() => openEdit(a)}>Edit</TextButton>
                {!a.defaultAddress && (
                  <TextButton tone="muted" onClick={() => makeDefault(a)}>
                    Set as default
                  </TextButton>
                )}
                <TextButton tone="danger" onClick={() => remove(a)}>
                  Remove
                </TextButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
