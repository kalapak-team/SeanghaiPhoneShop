"use client";

import { HERO, Kicker, TextMask, clamp, easeOut, lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { cn } from "@/lib/format";
import { BadgeCheck, Headphones, type LucideIcon, ShieldCheck, Truck } from "lucide-react";

export type StackCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  detail: string;
  image: string;
  theme: string;
  muted: string;
  action?: { label: string; href: string };
  imageBg?: string;
};

const PROMISES: StackCard[] = [
  {
    icon: BadgeCheck,
    title: "Genuine products only",
    body: "Every device we sell is genuine. Boxes, serial numbers, and included accessories are checked with you at the counter, and pre-owned devices are graded and tested before they go on sale.",
    detail: "New and certified pre-owned",
    image: shot("galaxy-s26-ultra.jpg"),
    theme: "bg-white text-navy",
    muted: "text-apple-muted"
  },
  {
    icon: ShieldCheck,
    title: "Store warranty, in writing",
    body: "New devices come with warranty terms you can read before you pay — typically one to two years depending on the product. Warranty questions are handled by the store you bought from.",
    detail: "1–2 years on new devices",
    image: shot("macbook-air.jpg"),
    theme: "bg-navy text-white",
    muted: "text-white/60"
  },
  {
    icon: Truck,
    title: "Free and fast delivery",
    body: "Orders over $140 are delivered free across Phnom Penh. Prefer to collect? Reserve online and pick up from any of our stores once your order is confirmed.",
    detail: "Free over $140 in Phnom Penh",
    image: shot("apple-watch.jpg"),
    theme: "bg-gold text-white",
    muted: "text-white/75"
  },
  {
    icon: Headphones,
    title: "Customer service, 24/7",
    body: "Reach us by phone, Telegram, or Facebook in Khmer or English. Questions about an order, a device, or a warranty go to a real person on our team.",
    detail: "Khmer and English",
    image: shot("airpods-max.jpg"),
    theme: "bg-black text-white",
    muted: "text-white/60"
  }
];

/** Sticky cards that scale back as the next one arrives (Framer “Stacking Cards”). */
export function StackingPromise({
  id,
  kicker = "Our promise",
  title = "Four things you can count on.",
  intro = "The same promises apply in every store and on every online order.",
  items = PROMISES
}: {
  id?: string;
  kicker?: string;
  title?: string;
  intro?: string;
  items?: StackCard[];
}) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const n = items.length;

  return (
    <section id={id} className="relative z-10 scroll-mt-14 bg-apple-gray pt-24 md:pt-32">
      <div className="container-xl">
        <Kicker>{kicker}</Kicker>
        <TextMask text={title} className="mt-4 max-w-[18ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[56px]" />
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-apple-muted">{intro}</p>
      </div>
      <div ref={ref} className="container-xl relative mt-14 pb-24">
        {items.map((item, i) => {
          const depth = reduced ? 0 : clamp(p * (n - 0.4) - i, 0, n - 1 - i);
          const scale = r2(1 - depth * 0.05);
          return (
              <article
                key={item.title}
                className={cn(
                  "sticky grid min-h-[60vh] origin-top overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.12)] md:grid-cols-[1.1fr_0.9fr]",
                  i < n - 1 && "mb-[22vh]",
                  item.theme
                )}
                style={{ top: `calc(5.5rem + ${i * 22}px)`, transform: `scale(${scale})` }}
              >
                <div className="flex flex-col justify-between p-8 md:p-12">
                  <div className="flex items-center justify-between">
                    <item.icon size={28} strokeWidth={1.6} />
                    <span className={cn("text-[13px] font-semibold tracking-[0.2em]", item.muted)}>0{i + 1} / 0{n}</span>
                  </div>
                  <div className="mt-10">
                    <h3 className="text-[30px] font-semibold leading-tight tracking-tight md:text-[44px]">{item.title}</h3>
                    <p className={cn("mt-4 max-w-lg text-[16px] leading-relaxed md:text-[18px]", item.muted)}>{item.body}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <p className="inline-flex rounded-full border border-current/20 px-4 py-1.5 text-[13px] font-medium">{item.detail}</p>
                      {item.action && (
                        <a
                          href={item.action.href}
                          target={item.action.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="text-[15px] font-semibold underline-offset-4 hover:underline"
                        >
                          {item.action.label} ›
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn("hidden items-center justify-center p-10 md:flex", item.imageBg || "bg-white")}>
                  <img src={item.image} alt="" className="max-h-[46vh] object-contain" />
                </div>
              </article>
          );
        })}
      </div>
    </section>
  );
}

const SLICES = [
  { step: "01", title: "Choose", body: "Tell us your budget and what matters. We shortlist the models that fit." },
  { step: "02", title: "Compare", body: "Hold them side by side. Cameras, screens, and battery life, explained clearly." },
  { step: "03", title: "Own it", body: "Set up in store, matched with the right accessories, covered by written warranty." }
];

/** One photo splits into three cards that flip to reveal the next layer (Framer “3D Image Split”). */
export function SplitScroll({
  kicker = "The Seanghai way",
  title = "See it. Compare it. Then decide.",
  intro = "Buying a phone should be a clear decision, not a guess. Every visit follows three simple steps.",
  slices = SLICES,
  image = HERO.fold
}: {
  kicker?: string;
  title?: string;
  intro?: string;
  slices?: typeof SLICES;
  image?: string;
}) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const expand = reduced ? 1 : easeOut(range(p, 0.08, 0.42));
  const gap = r2(lerp(0, 22, expand));

  return (
    <section ref={ref} className="relative z-10 h-[260vh] bg-black text-white">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker light>{kicker}</Kicker>
              <TextMask text={title} className="mt-4 text-[34px] font-semibold tracking-[-0.025em] md:text-[52px]" />
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-white/55">{intro}</p>
          </div>

          <div className="about-persp mt-10 grid h-[52vh] grid-cols-3" style={{ gap: `${gap}px` }}>
            {slices.map((s, i) => {
              const flip = reduced ? 1 : easeOut(range(p, 0.48 + i * 0.08, 0.72 + i * 0.08));
              const lift = r2(lerp(0, (i - 1) * -18, expand));
              const outer = i === 0 ? "24px 0 0 24px" : i === 2 ? "0 24px 24px 0" : "0";
              const radius = expand > 0.05 ? "24px" : outer;
              return (
                <div key={s.step} className="relative" style={{ transform: `translateY(${lift}px)` }}>
                  <div className="about-preserve relative h-full w-full" style={{ transform: `rotateY(${r2(flip * 180)}deg)` }}>
                    <div
                      className="about-face"
                      style={{
                        borderRadius: radius,
                        backgroundImage: `url(${image})`,
                        backgroundSize: "300% 100%",
                        backgroundPosition: `${i * 50}% 50%`
                      }}
                    />
                    <div className="about-face about-face-back flex flex-col justify-between bg-[#1d1d1f] p-6 md:p-8" style={{ borderRadius: "24px" }}>
                      <span className="text-[13px] font-semibold tracking-[0.2em] text-[#2997ff]">{s.step}</span>
                      <div>
                        <h3 className="text-[26px] font-semibold md:text-[36px]">{s.title}</h3>
                        <p className="mt-3 text-[14px] leading-relaxed text-white/60 md:text-[16px]">{s.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
