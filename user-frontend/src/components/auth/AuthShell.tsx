import { Logo } from "@/components/Logo";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel,
  pending,
  error,
  footer
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
  submitLabel: string;
  pending?: boolean;
  error?: string;
  footer: ReactNode;
}) {
  return (
    <main className="bg-apple-gray">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[420px] flex-col items-center px-6 py-16">
        <Logo compact />
        <h1 className="mt-7 text-center text-[32px] font-semibold tracking-tight text-navy md:text-[40px]">{title}</h1>
        <p className="mt-2 text-center text-[15px] text-apple-muted">{subtitle}</p>
        <form onSubmit={onSubmit} className="mt-8 w-full space-y-4">
          {children}
          {error && (
            <p className="text-[13px] text-rose-500" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-gold text-[15px] font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {pending ? "Please wait…" : submitLabel}
          </button>
        </form>
        <p className="mt-8 text-center text-[13px] text-apple-muted">{footer}</p>
      </div>
    </main>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-apple-muted">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-navy outline-none transition placeholder:text-apple-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </label>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-gold hover:underline">
      {children}
    </Link>
  );
}
