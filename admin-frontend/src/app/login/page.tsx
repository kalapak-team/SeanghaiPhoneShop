"use client";

import { adminRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@seanghaiphone.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await adminRequest<{ token: string; user: { role: string; name?: string; email?: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      if (res.user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        setPending(false);
        return;
      }
      localStorage.setItem("sg_admin_token", res.token);
      localStorage.setItem("sg_admin_user", JSON.stringify(res.user));
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-apple-gray px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center">
          <svg width={44} height={44} viewBox="0 0 64 64" fill="none" aria-hidden>
            <rect width="64" height="64" rx="16" fill="#1d1d1f" />
            <path
              d="M42 21.2c-1.5-2.6-4.6-4.2-8.6-4.2-6.7 0-11.1 3.5-11.1 8.4 0 4.3 3.1 6.7 9.5 8.1l3.3.7c4.1.9 5.8 2.1 5.8 4.3 0 2.6-2.5 4.3-6.4 4.3-3.6 0-6.2-1.5-7.5-4.1l-.4-.8-5.6 2.1.3.7c2.1 4.7 7.1 7.5 13.3 7.5 7.6 0 12.6-4 12.6-9.6 0-4.5-3.2-7.1-9.8-8.5l-3.2-.7c-3.8-.8-5.4-2-5.4-4 0-2.4 2.2-4 5.7-4 3 0 5.2 1.3 6.3 3.6l.3.7 5.6-2.1-.3-.8Z"
              fill="#ffffff"
            />
            <circle cx="46.5" cy="17.5" r="4" fill="#0071e3" />
          </svg>
        </div>
        <h1 className="mt-6 text-center text-[32px] font-semibold tracking-tight text-navy">Admin</h1>
        <p className="mt-1 text-center text-[14px] text-apple-muted">Sign in to manage Seanghai Phone Shop.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-apple-muted">Email</span>
            <input
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-apple-muted">Password</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
          </label>
          {error && <p className="text-[13px] text-rose-500">{error}</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
