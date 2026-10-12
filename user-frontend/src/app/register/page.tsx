"use client";

import { AuthField, AuthLink, AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm({ ...form, [key]: value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
      setPending(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for orders, wishlist and faster checkout."
      onSubmit={onSubmit}
      submitLabel="Continue"
      pending={pending}
      error={error}
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <AuthField id="name" label="Name" autoComplete="name" value={form.name} onChange={set("name")} />
      <AuthField id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
      <AuthField id="phone" label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
      <AuthField id="password" label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
    </AuthShell>
  );
}
