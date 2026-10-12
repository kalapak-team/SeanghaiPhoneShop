"use client";

import { AuthField, AuthLink, AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(email, password);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
      setPending(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your Seanghai account to shop and track orders."
      onSubmit={onSubmit}
      submitLabel="Sign in"
      pending={pending}
      error={error}
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/register">Create yours now</AuthLink>
        </>
      }
    >
      <AuthField id="email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} />
      <AuthField id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
    </AuthShell>
  );
}
