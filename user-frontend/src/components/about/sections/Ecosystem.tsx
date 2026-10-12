"use client";

import { Kicker, ScrambleText, TextMask, shot, useInView } from "@/components/about/motion";
import { cn } from "@/lib/format";
import { Cable, Headphones, Laptop, type LucideIcon, RefreshCw, Smartphone, Tablet, Watch } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type LinkNode = { label: string; href: string; icon: LucideIcon; x: number; y: number };

const NODES: LinkNode[] = [
  { label: "Smartphone", href: "/category/smartphone", icon: Smartphone, x: 0.16, y: 0.24 },
  { label: "Tablet", href: "/category/tablet", icon: Tablet, x: 0.5, y: 0.1 },
  { label: "Watch", href: "/category/watch", icon: Watch, x: 0.84, y: 0.24 },
  { label: "Audio", href: "/category/accessories", icon: Headphones, x: 0.88, y: 0.72 },
  { label: "Computer", href: "/category/computer", icon: Laptop, x: 0.12, y: 0.74 },
  { label: "Accessories", href: "/category/accessories", icon: Cable, x: 0.36, y: 0.9 },
  { label: "Pre-Owned", href: "/secondhand", icon: RefreshCw, x: 0.64, y: 0.9 }
];

const RING: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 3]
];

/** Animated lines linking every category back to one store (Framer “Line Connections”). */
export function LineConnections({
  kicker = "One store, everything connected",
  title = "Everything you carry, from one counter.",
  body = "Phone, watch, earbuds, tablet, laptop, and the cables and cases that tie them together — chosen to work as a set, supported by the same team.",
  nodes = NODES,
  ring = RING,
  hub = { title: "SEANGHAI", sub: "Phone Shop" }
}: {
  kicker?: string;
  title?: string;
  body?: string;
  nodes?: LinkNode[];
  ring?: [number, number][];
  hub?: { title: string; sub: string };
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 520 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const center = { x: size.w * 0.5, y: size.h * 0.5 };
  const pt = (n: LinkNode) => ({ x: n.x * size.w, y: n.y * size.h });

  return (
    <section className="relative z-10 overflow-hidden bg-black py-24 text-white md:py-32">
      <div className="container-xl">
        <div className="max-w-2xl">
          <Kicker light>{kicker}</Kicker>
          <TextMask text={title} className="mt-4 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[52px]" />
          <p className="mt-5 text-[17px] leading-relaxed text-white/55">{body}</p>
        </div>

        <div ref={ref} className={cn("relative mt-14", inView && "about-links-in")}>
          <div ref={box} className="relative h-[520px] md:h-[560px]">
            <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
              {nodes.map((n, i) => {
                const b = pt(n);
                const d = `M${center.x},${center.y} L${b.x},${b.y}`;
                return (
                  <g key={n.label}>
                    <path d={d} pathLength={1} className="about-link" stroke="rgba(41,151,255,0.55)" strokeWidth="1.25" fill="none" style={{ transitionDelay: `${i * 90}ms` }} />
                    <path d={d} pathLength={1} className="about-pulse" stroke="#2997ff" strokeWidth="3" strokeLinecap="round" fill="none" style={{ animationDelay: `${i * 0.4}s` }} />
                  </g>
                );
              })}
              {ring.map(([a, b], i) => {
                const pa = pt(nodes[a]);
                const pb = pt(nodes[b]);
                return (
                  <path
                    key={i}
                    d={`M${pa.x},${pa.y} L${pb.x},${pb.y}`}
                    pathLength={1}
                    className="about-link"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1"
                    fill="none"
                    style={{ transitionDelay: `${700 + i * 80}ms` }}
                  />
                );
              })}
            </svg>

            <div className="about-node absolute left-1/2 top-1/2 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gold text-center shadow-[0_0_80px_rgba(0,113,227,0.6)] md:h-32 md:w-32">
              <span className="text-[15px] font-semibold tracking-[0.14em]">{hub.title}</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-white/70">{hub.sub}</span>
            </div>

            {nodes.map((n, i) => (
              <Link
                key={n.label}
                href={n.href}
                target={n.href.startsWith("http") ? "_blank" : undefined}
                rel={n.href.startsWith("http") ? "noreferrer" : undefined}
                className="about-node group absolute flex items-center gap-2 rounded-full border border-white/15 bg-[#1d1d1f]/90 px-4 py-2.5 text-[13px] font-medium backdrop-blur transition-colors hover:border-[#2997ff] hover:bg-[#2997ff]/15"
                style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%`, transitionDelay: `${300 + i * 90}ms` }}
              >
                <n.icon size={16} className="text-[#2997ff]" />
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const BRANDS = [
  { name: "Apple", file: "iphone-16-pro.jpg" },
  { name: "Samsung", file: "galaxy-s26-ultra.jpg" },
  { name: "OPPO", file: "oppo-find-x8-ultra.jpg" },
  { name: "Xiaomi", file: "redmi-note-14.jpg" },
  { name: "Vivo", file: "vivo-v50.jpg" },
  { name: "Huawei", file: "huawei-pura-90.jpg" },
  { name: "Google", file: "google-pixel.jpg" },
  { name: "Honor", file: "honor-phone.jpg" },
  { name: "Realme", file: "realme-phone.jpg" },
  { name: "Infinix", file: "infinix-phone.jpg" },
  { name: "Tecno", file: "tecno-phone.jpg" },
  { name: "Nokia", file: "nokia-phone.jpg" }
];

/** Cards arranged on a cylinder that rotates continuously (Framer “Rotating 3D Showcase”). */
export function BrandCarousel({
  kicker = "Brands we carry",
  title = "The brands you know, side by side.",
  body = "Compare Apple, Samsung, and the best of Android in one place, without visiting five different shops."
}: {
  kicker?: string;
  title?: string;
  body?: string;
}) {
  const step = 360 / BRANDS.length;
  return (
    <section className="relative z-10 overflow-hidden bg-apple-gray py-24 md:py-32">
      <div className="container-xl text-center">
        <Kicker>{kicker}</Kicker>
        <TextMask as="h2" text={title} className="mx-auto mt-4 max-w-[20ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[52px]" />
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-apple-muted">{body}</p>
      </div>
      <div className="about-persp relative mx-auto mt-16 h-[360px] w-full [--r:300px] md:h-[420px] md:[--r:440px]" style={{ perspective: "1600px" }}>
        <div className="about-carousel absolute left-1/2 top-1/2 h-0 w-0">
          {BRANDS.map((b, i) => (
            <Link
              key={b.name}
              href={`/brands/${b.name.toLowerCase()}`}
              className="absolute -left-[80px] -top-[120px] flex h-[240px] w-[160px] flex-col items-center justify-between rounded-[22px] bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:-left-[95px] md:-top-[140px] md:h-[280px] md:w-[190px]"
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))`, backfaceVisibility: "hidden" }}
            >
              <img src={shot(b.file)} alt={`${b.name} smartphone`} className="h-[78%] w-full object-contain" />
              <span className="text-[15px] font-semibold text-navy">{b.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const CATEGORIES = [
  { name: "Smartphone", tag: "iPhone · Galaxy · Pixel", href: "/category/smartphone", file: "iphone-16-pro-max.jpg" },
  { name: "Tablet", tag: "iPad · Galaxy Tab · Pad", href: "/category/tablet", file: "ipad-pro.jpg" },
  { name: "Watch", tag: "Apple Watch · Galaxy Watch", href: "/category/watch", file: "apple-watch.jpg" },
  { name: "Computer", tag: "MacBook · Mac mini", href: "/category/computer", file: "macbook-air.jpg" },
  { name: "Audio", tag: "AirPods · Buds · Speakers", href: "/category/accessories", file: "airpods-max.jpg" },
  { name: "Pre-Owned", tag: "Graded · Tested · Warranty", href: "/secondhand", file: "google-pixel.jpg" }
];

/** Angled 3D deck; hover lifts a card, draws a line, and scrambles its tag (Framer “Scramble Glitch Hover”). */
export function CategoryDeck() {
  const [hover, setHover] = useState<Record<number, number>>({});
  return (
    <section className="relative z-10 overflow-hidden bg-black py-24 text-white md:py-32">
      <div className="container-xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker light>Shop by category</Kicker>
            <TextMask text="Find your next device." className="mt-4 text-[34px] font-semibold tracking-[-0.025em] md:text-[52px]" />
          </div>
          <Link href="/products" className="text-[15px] font-medium text-[#2997ff] hover:underline">
            Browse all products ›
          </Link>
        </div>

        <div className="about-persp mt-16 hidden h-[460px] items-center justify-center lg:flex">
          <div className="about-preserve relative h-[380px] w-[1000px]" style={{ transform: "rotateY(-20deg) rotateX(6deg)" }}>
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.name}
                href={c.href}
                onMouseEnter={() => setHover((h) => ({ ...h, [i]: (h[i] || 0) + 1 }))}
                onFocus={() => setHover((h) => ({ ...h, [i]: (h[i] || 0) + 1 }))}
                className="about-deck-card group absolute top-0 h-[380px] w-[230px] overflow-hidden rounded-[22px] border border-white/10 bg-[#141416] shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out [transform:translate3d(var(--x),0,var(--z))] hover:[transform:translate3d(var(--x),-28px,calc(var(--z)+50px))]"
                style={{ ["--x" as string]: `${i * 150}px`, ["--z" as string]: `${i * 20}px`, zIndex: i + 1 }}
              >
                <div className="flex h-[62%] items-center justify-center bg-white p-6">
                  <img src={shot(c.file)} alt="" className="max-h-full object-contain transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-[20px] font-semibold">{c.name}</p>
                  <span className="about-deck-line mt-3 block h-px w-full bg-[#2997ff]" />
                  <p className="about-deck-tag mt-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[#2997ff]">
                    <ScrambleText text={c.tag} trigger={hover[i] || 0} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {CATEGORIES.map((c) => (
            <Link key={c.name} href={c.href} className="overflow-hidden rounded-2xl bg-[#141416]">
              <div className="flex h-36 items-center justify-center bg-white p-4">
                <img src={shot(c.file)} alt="" className="max-h-full object-contain" />
              </div>
              <div className="p-4">
                <p className="text-[16px] font-semibold">{c.name}</p>
                <p className="mt-1 text-[12px] text-white/50">{c.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
