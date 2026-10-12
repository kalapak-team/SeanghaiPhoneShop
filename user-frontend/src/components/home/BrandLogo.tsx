import { BRAND_ICONS } from "@/components/home/brandIcons";

const WORDMARKS: Record<string, { text: string; className: string }> = {
  realme: { text: "realme", className: "font-bold lowercase tracking-tight" },
  tecno: { text: "TECNO", className: "font-extrabold tracking-[0.12em]" },
  infinix: { text: "Infinix", className: "font-bold italic tracking-tight" },
  anker: { text: "ANKER", className: "font-extrabold tracking-[0.18em]" },
  xundd: { text: "XUNDD", className: "font-black tracking-[0.08em]" },
  hoco: { text: "hoco.", className: "font-bold lowercase tracking-tight" }
};

export function BrandLogo({ slug, name }: { slug: string; name: string }) {
  const key = slug.toLowerCase();
  const icon = BRAND_ICONS[key];

  if (icon) {
    return (
      <svg
        viewBox={icon.viewBox}
        role="img"
        aria-label={name}
        className={`fill-current ${icon.wide ? "h-6 w-auto max-w-[110px]" : "h-9 w-auto"}`}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const mark = WORDMARKS[key];
  return (
    <span className={`flex h-9 items-center text-[22px] leading-none ${mark?.className ?? "font-bold tracking-tight"}`}>
      {mark?.text ?? name}
    </span>
  );
}
