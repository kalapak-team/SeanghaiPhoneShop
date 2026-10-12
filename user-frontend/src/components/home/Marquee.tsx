export const SITE_MARQUEE = [
  "Genuine phones & accessories",
  "Official warranty",
  "Free delivery over $140",
  "នៅកន្លែងតែមួយ",
  "From everyday to premium — all in one place",
  "Seanghai Phone Shop"
];

export function Marquee({ items = SITE_MARQUEE }: { items?: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-black/5 bg-apple-gray py-3">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 text-sm tracking-wide text-navy">
            {item}
            <span className="text-gold">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
