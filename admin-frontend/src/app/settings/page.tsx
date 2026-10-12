"use client";

import { Field, PageHeader } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";

const FIELDS: { key: string; label: string; rows?: number }[] = [
  { key: "shopName", label: "Shop name" },
  { key: "tagline", label: "Tagline" },
  { key: "khmerPhone", label: "Khmer phone" },
  { key: "englishPhone", label: "English phone" },
  { key: "email", label: "Email" },
  { key: "telegramUrl", label: "Telegram chat URL" },
  { key: "telegramChannelUrl", label: "Telegram channel URL" },
  { key: "facebookUrl", label: "Facebook URL" },
  { key: "announcement", label: "Announcement", rows: 3 },
  { key: "about", label: "About", rows: 4 },
  { key: "freeDeliveryNote", label: "Free delivery note" }
];

export default function SettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest<Record<string, string>>("/settings")
      .then((data) => {
        setForm(data);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load settings"));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await adminRequest("/admin/settings", { method: "PUT", body: JSON.stringify(form) });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <PageHeader title="Settings" description="Contact details and copy used across the store." />
      <div className="space-y-4 rounded-2xl bg-white p-6">
        {FIELDS.map((field) => (
          <Field key={field.key} label={field.label}>
            {field.rows ? (
              <textarea
                className="field py-2.5"
                style={{ height: field.rows * 28 }}
                value={form[field.key] || ""}
                onChange={(e) => {
                  setSaved(false);
                  setForm({ ...form, [field.key]: e.target.value });
                }}
              />
            ) : (
              <input
                className="field"
                value={form[field.key] || ""}
                onChange={(e) => {
                  setSaved(false);
                  setForm({ ...form, [field.key]: e.target.value });
                }}
              />
            )}
          </Field>
        ))}
        {error && <p className="text-[13px] text-rose-600">{error}</p>}
        {saved && <p className="text-[13px] text-emerald-700">Saved.</p>}
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
