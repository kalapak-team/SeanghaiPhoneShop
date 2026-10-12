"use client";

import { lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { FillText } from "@/components/support/fx";
import { cn } from "@/lib/format";
import { ArrowUpRight, CreditCard, type LucideIcon, Package, RefreshCw, ShieldCheck, Smartphone, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Topic = { icon: LucideIcon; title: string; desc: string; steps: string[]; link?: { label: string; href: string }; span: string; img?: string };

const TOPICS: Topic[] = [
  {
    icon: Package,
    title: "Orders and tracking",
    desc: "Every order you place is saved in your account with its current status.",
    steps: ["Sign in and open Account → Orders.", "Follow the status: Pending → Confirmed → Processing → Completed.", "Something looks wrong? Message us your order number."],
    link: { label: "Go to my orders", href: "/account" },
    span: "col-span-2 row-span-2",
    img: "iphone-16-pro-max.jpg"
  },
  {
    icon: Truck,
    title: "Delivery and pickup",
    desc: "Free delivery over $140 in Phnom Penh, or collect in store.",
    steps: ["Orders over $140 are delivered free across Phnom Penh.", "The rider calls you before arriving.", "Prefer pickup? Write “pickup” and your store in the order note."],
    span: "col-span-2"
  },
  {
    icon: CreditCard,
    title: "Payment",
    desc: "Local banks and KHQR.",
    steps: ["Pay by KHQR, ABA PayWay, ACLEDA, Wing, or Chip Mong.", "We confirm your order by phone before you pay.", "Picking up? You can pay at the counter."],
    span: "col-span-1"
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    desc: "Written terms, handled in store.",
    steps: ["Warranty terms are shown before you pay.", "Keep your receipt as proof of purchase.", "Bring the device to the store you bought it from."],
    link: { label: "See warranty steps", href: "#warranty" },
    span: "col-span-1"
  },
  {
    icon: RefreshCw,
    title: "Pre-owned devices",
    desc: "Graded, tested, and battery-checked.",
    steps: ["Every listing shows a condition percentage.", "Devices are tested and battery-checked before sale.", "We show you the exact unit before you buy."],
    link: { label: "Browse pre-owned", href: "/secondhand" },
    span: "col-span-2"
  },
  {
    icon: Smartphone,
    title: "Setup and transfer",
    desc: "Leave with a phone that’s ready.",
    steps: ["We help you sign in to your accounts.", "Photos, contacts, and chats moved from your old phone.", "Case and screen protector fitted for your model."],
    span: "col-span-2"
  }
];

type Open = { i: number; rect: { x: number; y: number; w: number; h: number }; expanded: boolean };

/** Picking a tile grows it from its own spot into a full preview of the topic (Framer “Grid Morphs Into Preview”). */
export function TopicBento() {
  const box = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<Open | null>(null);

  const show = (i: number) => {
    const c = box.current?.getBoundingClientRect();
    const t = tiles.current[i]?.getBoundingClientRect();
    if (!c || !t) return;
    setOpen({ i, rect: { x: t.left - c.left, y: t.top - c.top, w: t.width, h: t.height }, expanded: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen((o) => (o ? { ...o, expanded: true } : o))));
  };

  const hide = () => {
    setOpen((o) => (o ? { ...o, expanded: false } : o));
    window.setTimeout(() => setOpen(null), 560);
  };

  const topic = open ? TOPICS[open.i] : null;

  return (
    <section id="topics" className="relative z-10 scroll-mt-14 bg-apple-gray py-24 md:py-32">
      <div className="container-xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Help topics</p>
            <FillText text="Find your answer in a tap." className="mt-4 max-w-[14ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-apple-muted">Open a topic for step-by-step guidance. Each one links to the right page or team.</p>
        </div>

        <div ref={box} className="relative mt-14">
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
            {TOPICS.map((t, i) => (
              <button
                key={t.title}
                ref={(n) => {
                  tiles.current[i] = n;
                }}
                type="button"
                onClick={() => show(i)}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-[26px] bg-white p-6 text-left transition duration-500 hover:shadow-[0_20px_50px_rgba(0,40,100,0.1)]",
                  t.span,
                  open && "pointer-events-none scale-[0.97] opacity-0"
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-apple-gray text-gold transition group-hover:bg-gold group-hover:text-white">
                    <t.icon size={19} />
                  </span>
                  <ArrowUpRight size={20} className="text-apple-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                </span>
                {t.img && <img src={shot(t.img)} alt="" className="absolute bottom-6 right-6 hidden h-[58%] object-contain transition duration-500 group-hover:scale-105 md:block" />}
                <span className="relative">
                  <span className="block text-[20px] font-semibold text-navy md:text-[24px]">{t.title}</span>
                  <span className="mt-1 block max-w-[30ch] text-[14px] text-apple-muted">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>

          {open && topic && (
            <div
              role="dialog"
              aria-label={topic.title}
              className="absolute z-20 overflow-hidden rounded-[26px] bg-navy text-white shadow-[0_40px_90px_rgba(0,0,0,0.25)] transition-all duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={
                open.expanded
                  ? { left: 0, top: 0, width: "100%", height: "100%" }
                  : { left: open.rect.x, top: open.rect.y, width: open.rect.w, height: open.rect.h }
              }
            >
              <div className={cn("flex h-full flex-col justify-between gap-6 overflow-auto p-7 transition-opacity duration-300 md:p-10", open.expanded ? "opacity-100 delay-200" : "opacity-0")}>
                <div className="flex items-start justify-between gap-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold">
                    <topic.icon size={22} />
                  </span>
                  <button type="button" onClick={hide} aria-label="Close topic" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-end">
                  <div>
                    <h3 className="text-[32px] font-semibold leading-tight tracking-tight md:text-[44px]">{topic.title}</h3>
                    <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/65">{topic.desc}</p>
                    {topic.link && (
                      <Link href={topic.link.href} onClick={hide} className="mt-6 inline-block text-[15px] font-semibold text-[#2997ff] hover:underline">
                        {topic.link.label} ›
                      </Link>
                    )}
                  </div>
                  <ol className="space-y-3">
                    {topic.steps.map((step, k) => (
                      <li key={step} className="flex gap-4 rounded-2xl bg-white/[0.07] p-4">
                        <span className="font-mono text-[13px] font-semibold text-[#2997ff]">0{k + 1}</span>
                        <span className="text-[15px] leading-relaxed text-white/85">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const FLOOR = [
  "iphone-16-pro.jpg", "galaxy-z-flip.jpg", "apple-watch.jpg", "ipad-air.jpg", "airpods.jpg", "mac-mini.jpg",
  "oppo-reno16.jpg", "galaxy-buds4-pro.jpg", "huawei-mate-x7.jpg", "power-bank.jpg", "galaxy-tab.jpg", "macbook-air.jpg",
  "google-pixel.jpg", "clear-magsafe-case.jpg", "smartwatch-sport.jpg", "vivo-v50.jpg"
];

/** Columns of tiles glide across a tilted floor at different speeds (Framer “3D Grid Scroll”). */
export function ProductFloor({ products }: { products: number }) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const s = reduced ? 0.5 : p;
  const cols = 6;

  return (
    <section ref={ref} className="relative z-10 h-[220vh] bg-black text-white">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="absolute inset-x-0 top-[9%] z-20 px-6 text-center" style={{ opacity: r2(lerp(0.4, 1, range(s, 0, 0.25))) }}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">Coverage</p>
          <p className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[60px]">Support for all {products.toLocaleString("en-US")} products.</p>
          <p className="mx-auto mt-3 max-w-lg text-[16px] text-white/55">Phones, tablets, watches, computers, audio, and accessories — one team helps with all of them.</p>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[30%] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_80%,transparent)] [perspective:900px]">
          <div
            className="mx-auto grid h-[180%] w-[min(1200px,130vw)] grid-cols-6 gap-4"
            style={{ transform: `rotateX(${r2(lerp(62, 48, s))}deg) translateY(${r2(lerp(-8, -30, s))}%)`, transformOrigin: "50% 0%" }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="flex flex-col gap-4" style={{ transform: `translateY(${r2((c % 2 ? 1 : -1) * lerp(-140, 140, s) + c * 30)}px)` }}>
                {Array.from({ length: 7 }).map((__, k) => (
                  <div key={k} className="flex aspect-square items-center justify-center rounded-2xl bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <img src={shot(FLOOR[(c * 5 + k * 3) % FLOOR.length])} alt="" className="max-h-full object-contain" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const NOTES = [
  { title: "Back up before you switch", body: "Use iCloud or Google One so photos and chats come with you." },
  { title: "Keep your receipt", body: "It’s your proof of purchase for any warranty request." },
  { title: "Check the IMEI", body: "Dial *#06# — it should match the number on the box." },
  { title: "Use a certified charger", body: "Cheap adapters can damage batteries and void warranty." },
  { title: "Turn off Find My", body: "Sign out of Find My or Find My Device before service." },
  { title: "Install updates", body: "Updates fix bugs, improve battery life, and patch security." },
  { title: "Check battery health", body: "Settings → Battery shows capacity and charging habits." },
  { title: "Protect it on day one", body: "A fitted case and screen protector prevent most repairs." },
  { title: "Keep the box", body: "Boxes and accessories help with warranty and resale value." },
  { title: "Avoid heat", body: "Don’t leave devices in a parked car or in direct sun." },
  { title: "Write down passwords", body: "Know your Apple ID or Google password before a reset." },
  { title: "Clean ports gently", body: "Use a dry, soft brush — never metal pins." }
];

const PAPER = ["bg-[#fff3b0]", "bg-[#d7ecff]", "bg-[#ffe0e6]", "bg-[#d9f7e6]", "bg-[#efe3ff]", "bg-[#ffe7cc]"];
const CELL_W = 250;
const CELL_H = 230;

/** Endless, draggable board of sticky notes on a dotted canvas (Framer “Infinite Canvas”). */
export function NotesCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const [grid, setGrid] = useState({ cols: 7, rows: 4 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setGrid({ cols: Math.ceil(e.contentRect.width / CELL_W) + 2, rows: Math.ceil(e.contentRect.height / CELL_H) + 2 })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const drift = { x: reduced ? 0 : -0.25, y: reduced ? 0 : 0.18 };
    let ox = 0;
    let oy = 0;
    let vx = drift.x;
    let vy = drift.y;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    const W = grid.cols * CELL_W;
    const H = grid.rows * CELL_H;
    const mod = (n: number, m: number) => ((n % m) + m) % m;

    const frame = () => {
      if (!dragging) {
        ox += vx;
        oy += vy;
        vx = lerp(vx, drift.x, 0.03);
        vy = lerp(vy, drift.y, 0.03);
      }
      el.style.backgroundPosition = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
      tiles.current.forEach((tile, i) => {
        if (!tile) return;
        const c = i % grid.cols;
        const r = Math.floor(i / grid.cols);
        const x = mod(c * CELL_W + ox + (r % 2) * (CELL_W / 3), W) - CELL_W;
        const y = mod(r * CELL_H + oy, H) - CELL_H;
        tile.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      ox += dx;
      oy += dy;
      vx = dx;
      vy = dy;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [grid, reduced]);

  const count = grid.cols * grid.rows;

  return (
    <section className="relative z-10 bg-white py-24 md:py-32">
      <div className="container-xl flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Device care</p>
          <FillText text="Small habits that save a repair." className="mt-4 max-w-[16ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-apple-muted">Notes our team shares every day at the counter. Grab the board and drag in any direction.</p>
      </div>
      <div
        ref={wrap}
        className="sup-dots relative mt-12 h-[72vh] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        aria-label="Device care notes, drag to explore"
      >
        {Array.from({ length: count }).map((_, i) => {
          const note = NOTES[(i * 5) % NOTES.length];
          return (
            <div key={i} ref={(n) => { tiles.current[i] = n; }} className="absolute left-0 top-0 p-4" style={{ width: CELL_W, height: CELL_H }}>
              <div
                className={cn("flex h-full w-full flex-col justify-between rounded-[6px] p-5 shadow-[0_14px_24px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06)]", PAPER[i % PAPER.length])}
                style={{ transform: `rotate(${((i * 37) % 9) - 4}deg)` }}
              >
                <span className="mx-auto -mt-8 block h-5 w-16 rounded-sm bg-white/60 shadow-sm" />
                <span>
                  <span className="block text-[17px] font-semibold leading-snug text-navy">{note.title}</span>
                  <span className="mt-1.5 block text-[13px] leading-relaxed text-navy/65">{note.body}</span>
                </span>
              </div>
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_75%_at_50%_50%,transparent_60%,rgba(255,255,255,0.9))]" />
      </div>
    </section>
  );
}
