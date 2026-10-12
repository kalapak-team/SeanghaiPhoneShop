"use client";

import { errorMessage, Notice, PrimaryButton, SectionHeader, TextButton, TextField } from "@/components/account/ui";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import { FormEvent, useState } from "react";

export function AccountProfile({ user }: { user: AuthUser }) {
  const { updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const startEdit = () => {
    setName(user.name);
    setPhone(user.phone || "");
    setNotice(null);
    setEditing(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const next = await api.updateProfile({ name, phone });
      updateUser(next);
      setEditing(false);
      setNotice({ tone: "success", text: "Your information has been updated." });
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err, "Could not save your information.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeader
        title="Personal information"
        description="Used on your orders, receipts and when we contact you."
        action={!editing && <TextButton onClick={startEdit}>Edit</TextButton>}
      />

      {notice && (
        <div className="mt-6">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}

      {editing ? (
        <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
          <TextField label="Full name" value={name} onChange={setName} autoComplete="name" required />
          <TextField label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
          <TextField label="Email" value={user.email} disabled />
          <p className="text-[12px] text-apple-muted">To change your email, contact Seanghai support.</p>
          <div className="flex items-center gap-5 pt-2">
            <PrimaryButton disabled={saving}>{saving ? "Saving…" : "Save"}</PrimaryButton>
            <TextButton tone="muted" onClick={() => setEditing(false)}>
              Cancel
            </TextButton>
          </div>
        </form>
      ) : (
        <dl className="mt-8 divide-y divide-black/10 border-y border-black/10">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Phone" value={user.phone || "Not added"} muted={!user.phone} />
        </dl>
      )}
    </section>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
      <dt className="text-[14px] text-apple-muted">{label}</dt>
      <dd className={`break-all text-[15px] ${muted ? "text-apple-muted" : "text-navy"}`}>{value}</dd>
    </div>
  );
}
