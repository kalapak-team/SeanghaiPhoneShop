"use client";

import { HERO, clamp, easeOut, lerp, r2, range, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { FillText } from "@/components/support/fx";
import { cn } from "@/lib/format";
import type { Settings } from "@/lib/types";
import {
  BadgeCheck,
  Camera,
  Clock,
  Hash,
  Languages,
  type LucideIcon,
  Receipt,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Truck
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STRIPS = 7;

const WARRANTY = [
  { step: "01", title: "Tell us", body: "Describe the issue by phone or Telegram. Many problems are solved with a setting or an update." },
  { step: "02", title: "Bring it in", body: "If it needs a closer look, bring the device and your receipt to the store you bought it from." },
  { step: "03", title: "We resolve it", body: "We inspect it, explain what’s covered, then repair, replace, or advise — before any cost." }
];

/** The photo splits into horizontal blinds that turn away to reveal the steps (Framer “3D Image Split Scroll”). */
export function BlindsWarranty() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();

  return (
    <section ref={ref} id="warranty" className="relative z-10 h-[230vh] scroll-mt-14 bg-white">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Warranty</p>
              <FillText text="A warranty claim in three steps." className="mt-4 text-[34px] font-semibold tracking-[-0.03em] md:text-[54px]" />
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-apple-muted">
              New devices include written store warranty terms, typically one to two years depending on the product.
            </p>
          </div>

          <div className="relative mt-10 h-[56vh] overflow-hidden rounded-[32px] [perspective:1600px]">
            <div className="absolute inset-0 grid gap-4 bg-[linear-gradient(135deg,#eef5ff,#f5f5f7)] p-6 md:grid-cols-3 md:p-10">
              {WARRANTY.map((w, i) => {
                const t = reduced ? 1 : easeOut(range(p, 0.45 + i * 0.07, 0.7 + i * 0.07));
                return (
                  <div
                    key={w.step}
                    className="flex flex-col justify-between rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(0,40,100,0.08)] md:p-8"
                    style={{ opacity: r2(t), transform: `translateY(${r2(lerp(30, 0, t))}px)` }}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold font-mono text-[14px] font-semibold text-white">{w.step}</span>
                    <div>
                      <h3 className="mt-6 text-[26px] font-semibold text-navy md:text-[32px]">{w.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-apple-muted">{w.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {Array.from({ length: STRIPS }).map((_, i) => {
              const t = reduced ? 1 : easeOut(range(p, 0.08 + i * 0.035, 0.42 + i * 0.035));
              return (
                <div
                  key={i}
                  aria-hidden
                  className="absolute inset-x-0 overflow-hidden"
                  style={{
                    top: `${(i * 100) / STRIPS}%`,
                    height: `${100 / STRIPS + 0.2}%`,
                    transform: `rotateX(${r2(t * -92)}deg)`,
                    opacity: r2(1 - range(t, 0.75, 1)),
                    transformOrigin: "50% 50%"
                  }}
                >
                  <img
                    src={HERO.apple}
                    alt=""
                    className="absolute inset-x-0 w-full object-cover"
                    style={{ top: `${-i * 100}%`, height: `${STRIPS * 100}%` }}
                  />
                </div>
              );
            })}

            <p
              className="pointer-events-none absolute bottom-8 left-8 text-[22px] font-semibold text-white md:text-[30px]"
              style={{ opacity: r2(1 - range(p, 0.06, 0.18)) }}
            >
              Keep your receipt. It’s your warranty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROMISES: { icon: LucideIcon; title: string; body: string; band: string; x: number; rot: number }[] = [
  { icon: Clock, title: "Customer service, 24/7", body: "Phone, Telegram, and Facebook messages are answered by our own team, day or night.", band: "bg-gold", x: -14, rot: -5 },
  { icon: Languages, title: "Khmer and English", body: "Explain the problem in the language you’re most comfortable with.", band: "bg-navy", x: 16, rot: 4 },
  { icon: ShieldCheck, title: "Written warranty", body: "Terms you can read before you pay, handled by the store you bought from.", band: "bg-emerald-500", x: -6, rot: -2 },
  { icon: Truck, title: "Free delivery over $140", body: "Across Phnom Penh, with a call from the rider before arrival.", band: "bg-orange-500", x: 12, rot: 6 },
  { icon: BadgeCheck, title: "Genuine devices only", body: "Box, serial number, and IMEI checked with you at the counter.", band: "bg-black", x: 0, rot: -1 }
];

/** Cards drop onto a pile one after another as you scroll (Framer “Stacking Cards”). */
export function PromisePile() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const n = PROMISES.length;
  const s = reduced ? n : clamp(range(p, 0.04, 0.9)) * n;
  const active = Math.min(n - 1, Math.max(0, Math.ceil(s) - 1));

  return (
    <section ref={ref} className="relative z-10 h-[300vh] bg-apple-gray">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="container-xl grid h-full items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Our promises</p>
            <FillText text="Five promises, stacked in your favour." className="mt-4 max-w-[14ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
            <ol className="mt-10 space-y-3">
              {PROMISES.map((pr, i) => (
                <li key={pr.title} className="flex items-center gap-4">
                  <span className={cn("h-1.5 rounded-full transition-all duration-500", i <= active && s > 0.1 ? cn("w-10", pr.band) : "w-4 bg-black/15")} />
                  <span className={cn("text-[15px] transition-colors", i === active && s > 0.1 ? "font-semibold text-navy" : "text-apple-muted")}>{pr.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[460px]">
            {PROMISES.map((pr, i) => {
              const t = easeOut(range(s, i, i + 0.8));
              const below = clamp(s - (i + 1), 0, n);
              return (
                <article
                  key={pr.title}
                  className="absolute left-1/2 top-1/2 flex h-[420px] w-[min(86vw,360px)] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.14)]"
                  style={{
                    zIndex: i + 1,
                    opacity: t > 0 ? 1 : 0,
                    filter: `brightness(${r2(1 - Math.min(below, 3) * 0.06)})`,
                    transform: `translate(calc(-50% + ${pr.x}px), calc(-50% + ${r2(lerp(-120, 0, t))}vh)) rotate(${r2(lerp(pr.rot * 4, pr.rot, t))}deg) scale(${r2(lerp(1.2, 1, t))})`
                  }}
                >
                  <div className={cn("h-3", pr.band)} />
                  <div className="flex flex-1 flex-col justify-between p-8">
                    <div className="flex items-center justify-between">
                      <pr.icon size={34} strokeWidth={1.5} className="text-navy" />
                      <span className="font-mono text-[13px] text-apple-muted">
                        0{i + 1}/0{n}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[30px] font-semibold leading-tight tracking-tight text-navy">{pr.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-apple-muted">{pr.body}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const PREPARE: { icon: LucideIcon; title: string; hint: string }[] = [
  { icon: Hash, title: "Order number", hint: "In your confirmation, and in Account → Orders." },
  { icon: Receipt, title: "Receipt", hint: "Your proof of purchase for any warranty request." },
  { icon: Smartphone, title: "Device model", hint: "Settings → About shows the exact model." },
  { icon: Camera, title: "Photo or video", hint: "Show us the issue — it can save you a trip." },
  { icon: ScanLine, title: "IMEI", hint: "Dial *#06# to see it on screen." }
];

/** Cards are drawn from a deck and fanned out like a hand (Framer “Card Draw Scroll”). */
export function PrepareFan() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const mid = (PREPARE.length - 1) / 2;

  return (
    <section ref={ref} className="relative z-10 h-[240vh] bg-navy text-white">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden pt-[8vh]">
        <div className="container-xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">Before you contact us</p>
          <FillText dark text="Have these ready. We’ll be faster." className="mx-auto mt-4 max-w-[18ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]" />
        </div>
        <div className="relative mx-auto mt-auto h-[58vh] w-full max-w-[1100px]">
          {PREPARE.map((c, i) => {
            const t = reduced ? 1 : easeOut(range(p, 0.08 + i * 0.09, 0.42 + i * 0.09));
            const d = i - mid;
            const lift = hover === i ? -36 : 0;
            return (
              <article
                key={c.title}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="absolute bottom-[10%] left-1/2 flex h-[min(48vh,340px)] w-[min(40vw,230px)] flex-col justify-between rounded-[24px] bg-white p-6 text-navy shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-[translate] duration-300"
                style={{
                  transformOrigin: "50% 140%",
                  transform: `translateX(-50%) translate(${r2(lerp(0, d * 150, t))}px, calc(${r2(lerp(75, 0, t))}vh + ${r2(Math.abs(d) * 26 * t)}px)) rotate(${r2(lerp(0, d * 11, t))}deg)`,
                  translate: `0 ${lift}px`,
                  zIndex: hover === i ? 20 : i
                }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-apple-gray text-gold">
                  <c.icon size={22} />
                </span>
                <div>
                  <p className="font-mono text-[12px] text-apple-muted">0{i + 1}</p>
                  <h3 className="mt-1 text-[22px] font-semibold leading-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-apple-muted">{c.hint}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type Faq = { q: string; a: string; link?: { label: string; href: string } };

function faqs(settings: Settings): Faq[] {
  return [
    { q: "How do I track my order?", a: "Sign in and open Account → Orders to see each order’s status: Pending, Confirmed, Processing, or Completed. Or message us your order number.", link: { label: "Go to my orders", href: "/account" } },
    { q: "Is delivery free?", a: `${settings.freeDeliveryNote} in Phnom Penh. For smaller orders or addresses outside the city, we tell you the fee when we call to confirm — before anything is charged.` },
    { q: "Can I pick up in store?", a: "Yes. Write “pickup” and your preferred store in the order note at checkout. We’ll confirm when it’s ready so you can try it before you leave.", link: { label: "See our stores", href: "#stores" } },
    { q: "How do I pay?", a: "Place your order online and our team contacts you to confirm. Pay by KHQR, ABA PayWay, ACLEDA Bank, Wing Bank, or Chip Mong Bank — or at the counter." },
    { q: "What warranty comes with my device?", a: "New devices include written store warranty terms, typically one to two years depending on the product. Keep your receipt as proof of purchase." },
    { q: "My device has a problem. What now?", a: "Call or message us first — many issues are solved in minutes. If it needs inspection, bring it with your receipt to the store you bought it from." },
    { q: "How are pre-owned devices graded?", a: "Each listing shows a condition percentage. Devices are tested and battery-checked before sale, and we show you the exact unit before you buy.", link: { label: "Browse pre-owned", href: "/secondhand" } },
    { q: "Will you help set up my new phone?", a: "Yes. In store we help you sign in, move photos, contacts, and chats from your old phone, and fit a case and protector for your model." }
  ];
}

const TINTS = ["bg-[#eaf3ff]", "bg-[#f1f0ff]", "bg-[#e9f9f1]", "bg-[#fff4e8]", "bg-[#fdeef1]", "bg-[#eef7fb]", "bg-[#f4f4f6]", "bg-[#fffbe6]"];

/** The top card slides out and tucks behind the deck, one question at a time (Framer “Card Shuffle”). */
export function FaqShuffle({ settings }: { settings: Settings }) {
  const items = faqs(settings);
  const n = items.length;
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const s = reduced ? 0 : clamp(range(p, 0.05, 0.95)) * (n - 1);
  const current = Math.round(s);
  const [list, setList] = useState(false);

  return (
    <section ref={ref} id="faq" className={cn("relative z-10 scroll-mt-14 bg-white", list ? "py-24" : "h-[380vh]")}>
      <div className={cn(!list && "sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden")}>
        <div className="container-xl grid h-full items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Common questions</p>
            <FillText text="Questions we hear every day." className="mt-4 max-w-[13ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
            <p className="mt-6 font-mono text-[14px] text-apple-muted">
              {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} — keep scrolling to shuffle
            </p>
            <div className="mt-4 flex gap-1.5">
              {items.map((f, i) => (
                <span key={f.q} className={cn("h-1.5 rounded-full transition-all duration-300", i === current ? "w-8 bg-gold" : "w-3 bg-black/10")} />
              ))}
            </div>
            <button type="button" onClick={() => setList((v) => !v)} className="mt-8 text-[14px] font-semibold text-gold hover:underline">
              {list ? "Back to the deck" : "Show all questions as a list"}
            </button>
          </div>

          {list ? (
            <ul className="divide-y divide-black/10 rounded-[28px] bg-apple-gray px-7">
              {items.map((f) => (
                <li key={f.q} className="py-5">
                  <p className="text-[17px] font-semibold text-navy">{f.q}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-apple-muted">{f.a}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="relative h-[440px]">
              {items.map((f, i) => {
                const d = (((i - s) % n) + n) % n;
                let x = 0;
                let y = d * 16;
                let scale = 1 - d * 0.05;
                let rot = d * 1.5;
                let z = n - Math.floor(d);
                let opacity = d > 3.2 ? 0 : 1;
                if (d > n - 1) {
                  const u = n - d;
                  const arc = Math.sin(u * Math.PI);
                  x = arc * 72;
                  rot = arc * 10;
                  y = lerp(0, 3 * 16, u) - arc * 40;
                  scale = lerp(1, 0.85, u);
                  z = u < 0.5 ? n + 1 : 0;
                  opacity = u < 0.6 ? 1 : r2(1 - (u - 0.6) / 0.4);
                }
                return (
                  <article
                    key={f.q}
                    className={cn("absolute inset-x-0 top-0 mx-auto flex h-[380px] max-w-[520px] flex-col justify-between rounded-[32px] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.1)] md:p-10", TINTS[i % TINTS.length])}
                    style={{ zIndex: z, opacity, transform: `translate(${r2(x)}%, ${r2(y)}px) rotate(${r2(rot)}deg) scale(${r2(scale)})` }}
                    aria-hidden={i !== current}
                  >
                    <span className="font-mono text-[13px] font-semibold text-gold">Q.{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[26px] font-semibold leading-tight tracking-tight text-navy md:text-[30px]">{f.q}</h3>
                      <p className="mt-4 text-[15px] leading-relaxed text-navy/65 md:text-[16px]">{f.a}</p>
                      {f.link && (
                        <Link href={f.link.href} className="mt-5 inline-block text-[14px] font-semibold text-gold hover:underline">
                          {f.link.label} ›
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
