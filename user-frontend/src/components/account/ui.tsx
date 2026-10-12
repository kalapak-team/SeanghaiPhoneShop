import type { ReactNode } from "react";

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-navy">{title}</h2>
        {description && <p className="mt-1.5 text-[15px] text-apple-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  disabled
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-apple-muted">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:bg-apple-gray disabled:text-apple-muted"
      />
    </label>
  );
}

export function PrimaryButton({ children, disabled, type = "submit", onClick }: { children: ReactNode; disabled?: boolean; type?: "submit" | "button"; onClick?: () => void }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, tone = "blue" }: { children: ReactNode; onClick: () => void; tone?: "blue" | "muted" | "danger" }) {
  const color = tone === "blue" ? "text-gold" : tone === "danger" ? "text-rose-600" : "text-apple-muted hover:text-navy";
  return (
    <button type="button" onClick={onClick} className={`text-[14px] font-medium transition hover:underline ${color}`}>
      {children}
    </button>
  );
}

export function Notice({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-[13px] ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}
    >
      {children}
    </p>
  );
}

export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}
