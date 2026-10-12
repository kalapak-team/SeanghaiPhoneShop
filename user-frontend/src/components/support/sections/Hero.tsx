"use client";

import { CUTOUT, HERO, clamp, lerp, r2, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { FillText, FlapWord, GlitchText } from "@/components/support/fx";
import { cn } from "@/lib/format";
import type { Settings } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, useEffect, useRef, useState } from "react";

export type SupportFacts = { stores: number; products: number };

export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const QUICK = [
  { label: "Track an order", href: "/account" },
  { label: "Warranty", href: "#warranty" },
  { label: "Help topics", href: "#topics" },
  { label: "FAQ", href: "#faq" },
  { label: "Message us", href: "#message" }
];

function QuickLink({ href, label, primary }: { href: string; label: string; primary: boolean }) {
  const [n, setN] = useState(0);
  return (
    <Link
      href={href}
      onMouseEnter={() => setN((v) => v + 1)}
      onFocus={() => setN((v) => v + 1)}
      className={cn(
        "group rounded-full px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] transition",
        primary ? "bg-navy text-white hover:bg-black" : "bg-white text-navy shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:text-gold"
      )}
    >
      <GlitchText text={label} trigger={n} />
    </Link>
  );
}

const CHAT = [
  { me: true, text: "Hi! I ordered a Galaxy S26 yesterday. When will it arrive?", at: 0.4 },
  { me: false, text: "Hello! Your order is confirmed and out for delivery this afternoon. The rider will call before arriving.", at: 2.4 },
  { me: true, text: "Great. Is it covered by warranty?", at: 4.6 },
  { me: false, text: "Yes — written store warranty, and your receipt is on record with us.", at: 6.6 }
];

export function SupportHero({ settings, facts }: { settings: Settings; facts: SupportFacts }) {
  const [loop, setLoop] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setLoop((n) => n + 1), 13000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-60 right-[-10%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(41,151,255,0.18),transparent_65%)]" />

      <div className="container-xl relative grid min-h-[calc(100svh-3.5rem)] items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-apple-gray px-4 py-1.5 text-[12px] font-semibold text-navy">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Seanghai Support · Online 24/7
          </p>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] text-navy md:text-[72px]">
            We’re here to help with your{" "}
            <FlapWord
              words={["order.", "warranty.", "delivery.", "new phone.", "payment."]}
              wordClassName="bg-gradient-to-r from-gold to-[#2997ff] bg-clip-text pb-[0.08em] text-transparent"
            />
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-apple-muted md:text-[20px]">
            Talk to the people who sold you your device — by phone, Telegram, Facebook, email, or at any of our {facts.stores} stores.
            In Khmer or English, before and long after you buy.
          </p>
          <nav aria-label="Support shortcuts" className="mt-9 flex flex-wrap gap-2.5">
            {QUICK.map((q, i) => (
              <QuickLink key={q.label} href={q.href} label={q.label} primary={i === 0} />
            ))}
          </nav>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-[14px] text-apple-muted">
            <a href={tel(settings.khmerPhone)} className="hover:text-navy">
              <span className="block text-[12px]">Khmer</span>
              <span className="text-[20px] font-semibold text-navy">{settings.khmerPhone}</span>
            </a>
            <a href={tel(settings.englishPhone)} className="hover:text-navy">
              <span className="block text-[12px]">English</span>
              <span className="text-[20px] font-semibold text-navy">{settings.englishPhone}</span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px]">
          <div
            className="absolute -left-24 top-[46%] z-10 hidden rounded-2xl bg-white/80 px-4 py-3 text-[13px] font-medium text-navy shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur md:block"
            style={{ animation: reduced ? undefined : "sup-float 6s ease-in-out infinite" }}
          >
            Khmer & English
          </div>
          <div
            className="absolute -right-12 bottom-24 z-10 hidden rounded-2xl bg-white/80 px-4 py-3 text-[13px] font-medium text-navy shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur md:block"
            style={{ animation: reduced ? undefined : "sup-float 7s ease-in-out 1.2s infinite" }}
          >
            Warranty on record ✓
          </div>

          <div className="relative rounded-[48px] bg-navy p-3 shadow-[0_50px_100px_rgba(0,30,80,0.25)]">
            <div className="relative h-[600px] overflow-hidden rounded-[38px] bg-apple-gray">
              <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-navy" />
              <div className="flex items-center gap-3 border-b border-black/5 bg-white/90 px-5 pb-3 pt-12 backdrop-blur">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-[13px] font-bold text-white">S</span>
                <span>
                  <span className="block text-[14px] font-semibold text-navy">Seanghai Support</span>
                  <span className="block text-[11px] text-emerald-600">Online now</span>
                </span>
              </div>
              <div key={loop} className="space-y-3 p-4">
                {CHAT.map((m) => (
                  <div key={m.text} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                    <p
                      className={cn(
                        "sup-bubble max-w-[82%] rounded-[20px] px-4 py-2.5 text-[13.5px] leading-snug",
                        m.me ? "rounded-br-md bg-gold text-white" : "rounded-bl-md bg-white text-navy shadow-sm"
                      )}
                      style={{ animationDelay: `${m.at}s` }}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}
                <div className="sup-bubble flex" style={{ animationDelay: "8.4s" }}>
                  <span className="sup-typing flex gap-1 rounded-[20px] rounded-bl-md bg-white px-4 py-3 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-apple-muted" />
                    <span className="h-1.5 w-1.5 rounded-full bg-apple-muted" />
                    <span className="h-1.5 w-1.5 rounded-full bg-apple-muted" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const LAYERS = [
  { src: CUTOUT.phone, cls: "left-[8%] top-[18%] w-28 md:w-40", depth: 1.4, card: false },
  { src: CUTOUT.buds, cls: "right-[12%] top-[10%] w-24 md:w-36", depth: 2.2, card: false },
  { src: CUTOUT.watch, cls: "right-[6%] bottom-[14%] w-28 md:w-44", depth: 1.1, card: false },
  { src: shot("ipad-pro.jpg"), cls: "left-[16%] bottom-[8%] w-32 md:w-48", depth: 0.7, card: true },
  { src: shot("macbook-air.jpg"), cls: "left-[42%] top-[4%] hidden w-36 md:block", depth: 0.45, card: true },
  { src: shot("airpods-max.jpg"), cls: "right-[30%] bottom-[2%] hidden w-28 md:block", depth: 1.8, card: true }
];

/** Many layers moving at different speeds with scroll and pointer (Framer “Insane Parallax”). */
export function DepthParallax() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const target = useRef({ x: 0, y: 0 });
  const [m, setM] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      setM((cur) => {
        const nx = lerp(cur.x, target.current.x, 0.08);
        const ny = lerp(cur.y, target.current.y, 0.08);
        return Math.abs(nx - cur.x) < 0.001 && Math.abs(ny - cur.y) < 0.001 ? cur : { x: r2(nx * 1000) / 1000, y: r2(ny * 1000) / 1000 };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    target.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
  };

  const s = reduced ? 0.5 : p;

  return (
    <section ref={ref} className="relative h-[210vh] bg-apple-gray">
      <div onMouseMove={onMove} className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-[radial-gradient(80%_70%_at_50%_45%,#ffffff,#e8f1fc_60%,#f5f5f7)]">
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 text-center text-[17vw] font-bold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgba(0,113,227,0.22)]"
          style={{ transform: `translate3d(${r2(m.x * -40)}px, calc(-50% + ${r2((0.5 - s) * 220)}px), 0) scale(${r2(lerp(1.15, 0.9, s))})` }}
        >
          WE’VE GOT YOU
        </p>

        {LAYERS.map((l) => (
          <div
            key={l.src}
            aria-hidden
            className={cn("pointer-events-none absolute", l.cls)}
            style={{ transform: `translate3d(${r2(m.x * l.depth * 60)}px, ${r2((0.5 - s) * l.depth * 520 + m.y * l.depth * 40)}px, 0) rotate(${r2((s - 0.5) * l.depth * 16)}deg)` }}
          >
            {l.card ? (
              <div className="rounded-[22px] bg-white p-4 shadow-[0_30px_60px_rgba(0,40,100,0.12)]">
                <img src={l.src} alt="" className="w-full object-contain" />
              </div>
            ) : (
              <img src={l.src} alt="" className="w-full drop-shadow-[0_30px_40px_rgba(0,40,100,0.25)]" />
            )}
          </div>
        ))}

        <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 text-center" style={{ opacity: r2(clamp(1 - Math.abs(s - 0.5) * 1.6)) }}>
          <p className="mx-auto max-w-3xl text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-navy md:text-[58px]">
            Whatever you bought from us, we help you with it.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-apple-muted">
            Phones, tablets, watches, laptops, audio, and accessories — set up, protected, and supported by the same team.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Oversized contact rows that scramble and channel-split on hover, with a preview that trails the cursor (Framer “Scramble Glitch Hover”). */
export function ChannelGlitch({ settings }: { settings: Settings }) {
  const rows = [
    { tag: "Phone · Khmer", value: settings.khmerPhone, note: "Fastest for urgent questions", href: tel(settings.khmerPhone), img: HERO.apple },
    { tag: "Phone · English", value: settings.englishPhone, note: "Stock checks and advice", href: tel(settings.englishPhone), img: HERO.fold },
    { tag: "Telegram", value: "Chat with us", note: "Send photos or a short video", href: settings.telegramUrl, img: HERO.watch },
    { tag: "Facebook", value: "Seanghai Phone Shop", note: "Two official pages", href: settings.facebookUrl, img: HERO.used },
    { tag: "Email", value: settings.email, note: "Invoices and business orders", href: `mailto:${settings.email}`, img: HERO.apple }
  ];
  const [hover, setHover] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<number[]>(rows.map(() => 0));
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const box = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
  };

  return (
    <section className="relative z-10 bg-navy py-24 text-white md:py-32">
      <div className="container-xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">Reach us</p>
        <FillText dark text="Pick a channel. A person answers." className="mt-4 max-w-[18ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[60px]" />

        <div ref={box} onMouseMove={onMove} onMouseLeave={() => setHover(null)} className="relative mt-14">
          {rows.map((row, i) => (
            <a
              key={row.tag}
              href={row.href}
              target={row.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              onMouseEnter={() => {
                setHover(i);
                setTriggers((t) => t.map((v, k) => (k === i ? v + 1 : v)));
              }}
              className="group relative grid items-center gap-2 border-t border-white/10 py-7 transition-colors last:border-b md:grid-cols-[200px_1fr_auto] md:gap-8"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/45">
                0{i + 1} · {row.tag}
              </span>
              <GlitchText
                text={row.value}
                trigger={triggers[i]}
                className={cn("break-all text-[28px] font-semibold tracking-[-0.02em] transition-colors md:text-[52px]", hover !== null && hover !== i && "text-white/25")}
              />
              <span className="flex items-center gap-3 text-[14px] text-white/55">
                {row.note}
                <ArrowUpRight size={20} className="text-[#2997ff] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </a>
          ))}

          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 hidden h-[190px] w-[270px] overflow-hidden rounded-[22px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-[opacity,scale] duration-300 lg:block"
            style={{
              transform: `translate3d(${pos.x + 30}px, ${pos.y - 95}px, 0)`,
              opacity: hover === null ? 0 : 1,
              scale: hover === null ? "0.8" : "1"
            }}
          >
            {rows.map((row, i) => (
              <img key={i} src={row.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: hover === i ? 1 : 0 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Marquee that skews and stretches with scroll speed (Framer “Text Distortion on Scroll”). */
export function VelocityMarquee() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let last = window.scrollY;
    let vel = 0;
    let x = 0;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      vel = lerp(vel, y - last, 0.12);
      last = y;
      x -= 0.6 + Math.abs(vel) * 0.25;
      const skew = clamp(vel * 0.4, -18, 18);
      const stretch = 1 + Math.min(Math.abs(vel) * 0.012, 0.35);
      rows.current.forEach((row, i) => {
        if (!row) return;
        const w = row.scrollWidth / 2;
        const off = ((x * (i ? -1 : 1)) % w + w) % w;
        row.style.transform = `translate3d(${(-off).toFixed(1)}px,0,0) skewX(${(i ? skew : -skew).toFixed(2)}deg) scaleY(${stretch.toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const lines = [
    "24/7 customer service · Khmer & English · Free delivery over $140 · ",
    "Written warranty · Setup in store · Genuine devices · "
  ];

  return (
    <section aria-label="Support highlights" className="relative z-10 overflow-hidden bg-white py-16 md:py-24">
      {lines.map((line, i) => (
        <div key={line} className="overflow-hidden py-1">
          <div
            ref={(n) => {
              rows.current[i] = n;
            }}
            className={cn(
              "flex w-max origin-center whitespace-nowrap text-[56px] font-semibold leading-[1.1] tracking-[-0.04em] will-change-transform md:text-[110px]",
              i ? "text-transparent [-webkit-text-stroke:1.5px_#1d1d1f]" : "text-navy"
            )}
          >
            <span>{line.repeat(3)}</span>
            <span aria-hidden>{line.repeat(3)}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
