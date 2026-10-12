import Link from "next/link";

function Mark({ size, invert }: { size: number; invert?: boolean }) {
  const bg = invert ? "#f5f5f7" : "#1d1d1f";
  const letter = invert ? "#1d1d1f" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect width="64" height="64" rx="16" fill={bg} />
      <path
        d="M42 21.2c-1.5-2.6-4.6-4.2-8.6-4.2-6.7 0-11.1 3.5-11.1 8.4 0 4.3 3.1 6.7 9.5 8.1l3.3.7c4.1.9 5.8 2.1 5.8 4.3 0 2.6-2.5 4.3-6.4 4.3-3.6 0-6.2-1.5-7.5-4.1l-.4-.8-5.6 2.1.3.7c2.1 4.7 7.1 7.5 13.3 7.5 7.6 0 12.6-4 12.6-9.6 0-4.5-3.2-7.1-9.8-8.5l-3.2-.7c-3.8-.8-5.4-2-5.4-4 0-2.4 2.2-4 5.7-4 3 0 5.2 1.3 6.3 3.6l.3.7 5.6-2.1-.3-.8Z"
        fill={letter}
      />
      <circle cx="46.5" cy="17.5" r="4" fill="#0071e3" />
    </svg>
  );
}

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  const size = compact ? 28 : 44;
  return (
    <Link href="/" className={compact ? "flex items-center" : "flex items-center gap-3"} aria-label="Seanghai Phone Shop">
      <Mark size={size} invert={light} />
      {!compact && (
        <span className="leading-[1.05]">
          <span className={`block text-[17px] font-semibold tracking-[0.18em] ${light ? "text-white" : "text-navy"}`}>
            SEANGHAI
          </span>
          <span className={`block text-[10px] font-medium uppercase tracking-[0.32em] ${light ? "text-white/55" : "text-apple-muted"}`}>
            Phone Shop
          </span>
        </span>
      )}
    </Link>
  );
}
