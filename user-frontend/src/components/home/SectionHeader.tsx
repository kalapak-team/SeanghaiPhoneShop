import Link from "next/link";

export function SectionHeader({
  title,
  accent,
  subtitle,
  href,
  light = false
}: {
  title: string;
  accent: string;
  subtitle?: string;
  href?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          <span className={light ? "text-white" : "text-navy"}>{title} </span>
          <em className={`not-italic ${light ? "text-white/80" : "text-gold"}`}>{accent}</em>
        </h2>
        {subtitle && <p className={`mt-1 text-sm ${light ? "text-white/60" : "text-apple-muted"}`}>{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-medium text-gold hover:underline">
          View more
        </Link>
      )}
    </div>
  );
}
