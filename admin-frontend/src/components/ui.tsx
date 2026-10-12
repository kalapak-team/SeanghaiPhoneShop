import { cn } from "@/lib/format";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-navy md:text-[32px]">{title}</h1>
        {description && <p className="mt-1 text-[14px] text-apple-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl bg-white", className)}>{children}</div>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-5 py-12 text-center text-[14px] text-apple-muted">{children}</p>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "CANCELLED"
        ? "bg-rose-50 text-rose-600"
        : status === "PENDING"
          ? "bg-apple-gray text-navy"
          : "bg-gold/10 text-gold";
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${tone}`}>{label}</span>;
}

export function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-apple-muted">{label}</span>
      {children}
    </label>
  );
}

export function confirmDelete(name: string) {
  return window.confirm(`Delete “${name}”? This cannot be undone.`);
}
