"use client";

import { errorMessage, Notice, PrimaryButton, SectionHeader, TextButton, TextField } from "@/components/account/ui";
import { api } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import { FormEvent, useState } from "react";

export function AccountSecurity({ user, onSignOut }: { user: AuthUser; onSignOut: () => void }) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (next.length < 6) {
      setNotice({ tone: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (next !== confirm) {
      setNotice({ tone: "error", text: "New passwords don't match." });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await api.changePassword({ currentPassword: current, newPassword: next });
      reset();
      setEditing(false);
      setNotice({ tone: "success", text: "Your password has been changed." });
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err, "Could not change your password.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeader title="Sign-in & security" description="Manage how you sign in to Seanghai." />

      {notice && (
        <div className="mt-6">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}

      <dl className="mt-8 divide-y divide-black/10 border-y border-black/10">
        <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
          <dt className="text-[14px] text-apple-muted">Email</dt>
          <dd className="break-all text-[15px] text-navy">{user.email}</dd>
        </div>
        <div className="py-4">
          <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:items-baseline">
            <dt className="text-[14px] text-apple-muted">Password</dt>
            <dd className="flex items-center justify-between gap-4">
              <span className="text-[15px] tracking-[0.2em] text-navy">••••••••</span>
              {!editing && (
                <TextButton
                  onClick={() => {
                    setNotice(null);
                    setEditing(true);
                  }}
                >
                  Change password
                </TextButton>
              )}
            </dd>
          </div>
          {editing && (
            <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4 sm:ml-[180px]">
              <TextField label="Current password" type="password" value={current} onChange={setCurrent} autoComplete="current-password" required />
              <TextField label="New password" type="password" value={next} onChange={setNext} autoComplete="new-password" required />
              <TextField label="Confirm new password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" required />
              <p className="text-[12px] text-apple-muted">Use at least 6 characters.</p>
              <div className="flex items-center gap-5 pt-1">
                <PrimaryButton disabled={saving}>{saving ? "Saving…" : "Change password"}</PrimaryButton>
                <TextButton
                  tone="muted"
                  onClick={() => {
                    reset();
                    setEditing(false);
                  }}
                >
                  Cancel
                </TextButton>
              </div>
            </form>
          )}
        </div>
      </dl>

      <div className="mt-10">
        <TextButton tone="danger" onClick={onSignOut}>
          Sign out of this device
        </TextButton>
      </div>
    </section>
  );
}
