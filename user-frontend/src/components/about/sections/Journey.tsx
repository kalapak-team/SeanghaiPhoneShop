"use client";

import { CUTOUT, HERO, Kicker, TextMask, clamp, easeOut, lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";

type Frame = { x: number; y: number; w: number; h: number; r: number; z: number; o?: number };

const SHUFFLE_IMGS = [HERO.fold, HERO.apple, HERO.watch, HERO.used];

/** Keyframes per stage for images 0–3, in % of the pinned stage. */
const STAGES: Frame[][] = [
  [
    { x: 50, y: 50, w: 100, h: 100, r: 0, z: 1 },
    { x: 50, y: 50, w: 100, h: 100, r: 0, z: 4 },
    { x: 50, y: 50, w: 100, h: 100, r: 0, z: 2 },
    { x: 50, y: 50, w: 100, h: 100, r: 0, z: 3 }
  ],
  [
    { x: 31, y: 31, w: 34, h: 38, r: 24, z: 1 },
    { x: 69, y: 31, w: 34, h: 38, r: 24, z: 2 },
    { x: 31, y: 71, w: 34, h: 38, r: 24, z: 3 },
    { x: 69, y: 71, w: 34, h: 38, r: 24, z: 4 }
  ],
  [
    { x: 31, y: 31, w: 34, h: 38, r: 24, z: 1 },
    { x: 69, y: 71, w: 34, h: 38, r: 24, z: 4 },
    { x: 31, y: 31, w: 34, h: 38, r: 24, z: 3 },
    { x: 69, y: 71, w: 34, h: 38, r: 24, z: 2 }
  ],
  [
    { x: 50, y: 30, w: 30, h: 34, r: 24, z: 1 },
    { x: 50, y: 70, w: 30, h: 34, r: 24, z: 4 },
    { x: 50, y: 30, w: 30, h: 34, r: 24, z: 3 },
    { x: 50, y: 70, w: 30, h: 34, r: 24, z: 2 }
  ],
  [
    { x: 50, y: 50, w: 30, h: 46, r: 24, z: 1 },
    { x: 50, y: 50, w: 30, h: 46, r: 24, z: 4 },
    { x: 50, y: 50, w: 30, h: 46, r: 24, z: 3 },
    { x: 50, y: 50, w: 30, h: 46, r: 24, z: 2 }
  ],
  [
    { x: 50, y: 50, w: 26, h: 40, r: 24, z: 1, o: 0 },
    { x: 50, y: 50, w: 100, h: 100, r: 0, z: 4 },
    { x: 50, y: 50, w: 26, h: 40, r: 24, z: 3, o: 0 },
    { x: 50, y: 50, w: 26, h: 40, r: 24, z: 2, o: 0 }
  ]
];

const CAPTIONS = [
  { k: "Your visit", t: "Every visit starts with you." },
  { k: "Step 1", t: "Four good options, side by side." },
  { k: "Step 2", t: "Narrowed to the two that fit." },
  { k: "Step 3", t: "Compared in hand, not on paper." },
  { k: "Step 4", t: "One clear choice." },
  { k: "Done", t: "Set up, under warranty, and ready to go." }
];

/** Four photos move through grid, pairs, stack, and full screen (Framer “Card Shuffle”). */
export function CardShuffle({
  images = SHUFFLE_IMGS,
  captions = CAPTIONS
}: {
  /** Exactly four images. */
  images?: string[];
  /** One caption per stage (six). */
  captions?: { k: string; t: string }[];
}) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const s = reduced ? 1 : p * (STAGES.length - 1);
  const from = Math.min(Math.floor(s), STAGES.length - 2);
  const t = easeOut(clamp(s - from));
  const caption = captions[Math.round(s)];

  return (
    <section ref={ref} className="relative z-10 h-[420vh] bg-black text-white">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        {images.map((src, i) => {
          const a = STAGES[from][i];
          const b = STAGES[from + 1][i];
          const f = {
            x: lerp(a.x, b.x, t),
            y: lerp(a.y, b.y, t),
            w: lerp(a.w, b.w, t),
            h: lerp(a.h, b.h, t),
            r: lerp(a.r, b.r, t),
            o: lerp(a.o ?? 1, b.o ?? 1, t)
          };
          return (
            <img
              key={i}
              src={src}
              alt=""
              className="absolute object-cover"
              style={{
                left: `${r2(f.x - f.w / 2)}%`,
                top: `${r2(f.y - f.h / 2)}%`,
                width: `${r2(f.w)}%`,
                height: `${r2(f.h)}%`,
                borderRadius: `${r2(f.r)}px`,
                zIndex: t < 0.5 ? a.z : b.z,
                opacity: r2(f.o)
              }}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-8 z-20 px-6 text-center md:bottom-12">
          <div key={caption.t} className="animate-fade-up">
            <Kicker light>{caption.k}</Kicker>
            <p className="mt-2 text-[24px] font-semibold tracking-tight md:text-[36px]">{caption.t}</p>
          </div>
        </div>
        <div className="absolute left-6 top-6 z-20 flex gap-1.5 md:left-10 md:top-10">
          {captions.map((c, i) => (
            <span key={c.t} className="h-1 w-8 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full bg-white" style={{ width: `${r2(clamp(s - i + 1) * 100)}%` }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export type DrawCard = { title: string; body: string; img: string; cutout: boolean };

const SERVICES: DrawCard[] = [
  { title: "New devices", body: "The latest iPhone, Galaxy, Pixel, and more — sealed, genuine, and covered by warranty.", img: CUTOUT.phone, cutout: true },
  { title: "Certified pre-owned", body: "Graded by condition, battery-checked, and tested before sale. Quality at a lower price.", img: shot("iphone-16-pro-max.jpg"), cutout: false },
  { title: "Watches and audio", body: "Apple Watch, Galaxy Watch, AirPods, Buds, and speakers, matched to the phone you use.", img: CUTOUT.watch, cutout: true },
  { title: "Accessories and protection", body: "Cases, screen protectors, chargers, and cables that fit your exact model.", img: shot("clear-magsafe-case.jpg"), cutout: false },
  { title: "Delivery and pickup", body: "Free delivery over $140 in Phnom Penh, or collect from any Seanghai store.", img: CUTOUT.buds, cutout: true }
];

/** Cards rise from below, settle, then lift back as the next is drawn (Framer “Card Draw”). */
export function CardDrawServices({
  id,
  kicker = "What we offer",
  title = "Everything you need, from one store.",
  items = SERVICES
}: {
  id?: string;
  kicker?: string;
  title?: string;
  items?: DrawCard[];
}) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const n = items.length;
  const s = reduced ? n : p * (n + 0.4);

  return (
    <section ref={ref} id={id} className="relative z-10 h-[360vh] scroll-mt-14 bg-[#1d1d1f] text-white">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="container-xl grid h-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Kicker light>{kicker}</Kicker>
            <TextMask text={title} className="mt-4 max-w-[14ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[52px]" />
            <ol className="mt-8 space-y-2">
              {items.map((sv, i) => (
                <li key={sv.title} className="flex items-center gap-3 text-[15px] transition-colors duration-300" style={{ color: s >= i + 0.5 ? "#fff" : "rgba(255,255,255,0.35)" }}>
                  <span className="w-6 text-[12px] font-semibold text-[#2997ff]">0{i + 1}</span>
                  {sv.title}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[66vh]">
            {items.map((sv, i) => {
              const enter = easeOut(range(s, i, i + 1));
              const depth = clamp(s - (i + 1), 0, n);
              const y = lerp(110, 0, enter);
              const rot = lerp(-14 + i * 6, 0, enter);
              const scale = lerp(0.82, 1, enter) - depth * 0.05;
              return (
                <article
                  key={sv.title}
                  className="absolute left-1/2 top-1/2 flex h-[min(60vh,520px)] w-[min(80vw,420px)] flex-col overflow-hidden rounded-[28px] bg-white text-navy shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                  style={{
                    transform: `translate(-50%, calc(-50% + ${r2(y)}vh - ${r2(depth * 26)}px)) rotate(${r2(rot)}deg) scale(${r2(scale)})`,
                    opacity: depth > 3 ? 0 : 1,
                    zIndex: i + 1
                  }}
                >
                  <div className={sv.cutout ? "flex flex-1 items-center justify-center bg-[radial-gradient(60%_60%_at_50%_50%,#d2e8ff,#f5f5f7)] p-8" : "flex flex-1 items-center justify-center p-8"}>
                    <img src={sv.img} alt="" className="max-h-[32vh] object-contain" />
                  </div>
                  <div className="p-7">
                    <p className="text-[12px] font-semibold tracking-[0.2em] text-gold">0{i + 1}</p>
                    <h3 className="mt-2 text-[24px] font-semibold tracking-tight">{sv.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-apple-muted">{sv.body}</p>
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
