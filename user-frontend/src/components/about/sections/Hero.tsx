"use client";

import { CUTOUT, HERO, Kicker, ScrambleText, TextMask, easeOut, lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const TILES = [
  { front: HERO.apple, back: HERO.watch, label: "Apple" },
  { front: HERO.fold, back: HERO.apple, label: "Galaxy" },
  { front: HERO.watch, back: HERO.used, label: "Wearables" }
];

export type AboutFacts = { products: number; brands: number; stores: number };

export function FlipHero({ facts }: { facts: AboutFacts }) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [scramble, setScramble] = useState(0);

  useEffect(() => {
    setScramble(1);
    if (reduced) return;
    const id = window.setInterval(() => setFlipped((v) => !v), 4200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const stats = [
    { value: "10+", label: "Years in Phnom Penh" },
    { value: String(facts.stores), label: "Retail stores" },
    { value: facts.products.toLocaleString("en-US"), label: "Products in catalog" },
    { value: String(facts.brands), label: "Brands carried" }
  ];

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_75%_40%,rgba(0,113,227,0.26),transparent_70%)]" />
      <div className="container-xl relative grid min-h-[calc(100svh-3.5rem)] items-center gap-12 py-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <Kicker light>
            <ScrambleText text="About Seanghai Phone Shop" trigger={scramble} />
          </Kicker>
          <TextMask
            as="h1"
            text="The phone shop Phnom Penh trusts."
            className="mt-5 max-w-[12ch] text-[46px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[76px]"
          />
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/65 md:text-[20px]">
            For more than ten years, Seanghai has helped people in Cambodia choose genuine smartphones, tablets, watches,
            computers, and accessories — with honest advice, written warranty, and support that continues after the sale.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/products" className="btn-gold">
              Shop the store
            </Link>
            <a href="#stores" className="text-[15px] font-medium text-[#2997ff] hover:underline">
              Find a store ›
            </a>
          </div>
          <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[30px] font-semibold tracking-tight">{s.value}</dd>
                <dd className="mt-1 text-[12px] leading-snug text-white/45">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about-persp grid h-[460px] grid-cols-3 gap-3 md:h-[600px] md:gap-4" aria-hidden>
          {TILES.map((tile, i) => (
            <div
              key={tile.label}
              className={i === 1 ? "relative h-full" : "relative mt-12 h-[85%]"}
            >
              <div
                className="about-flip-card relative h-full w-full"
                style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transitionDelay: `${i * 140}ms` }}
              >
                <div className="about-face rounded-[24px]">
                  <img src={tile.front} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="about-face about-face-back rounded-[24px]">
                  <img src={tile.back} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
              <p className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">
                {tile.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Pinned scene: a framed photo opens to full screen while layers move at different speeds. */
export function ParallaxOpening() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const open = reduced ? 1 : easeOut(range(p, 0.05, 0.6));
  const inset = r2(lerp(22, 0, open));
  const radius = r2(lerp(32, 0, open));
  const textOut = range(p, 0.55, 0.8);
  const finalIn = range(p, 0.62, 0.85);

  return (
    <section ref={ref} className="relative h-[240vh] bg-black text-white">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <p
          className="pointer-events-none absolute inset-x-0 top-[8%] z-0 text-center text-[18vw] font-bold leading-none tracking-[-0.05em] text-white/[0.06]"
          style={{ transform: `translateY(${r2(lerp(0, -160, p))}px)` }}
        >
          SEANGHAI
        </p>

        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ clipPath: `inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)` }}
        >
          <img
            src={HERO.fold}
            alt="Samsung Galaxy foldables on display"
            className="h-full w-full object-cover"
            style={{ transform: `scale(${r2(lerp(1.25, 1, open))})` }}
          />
          <div className="absolute inset-0 bg-black/45" style={{ opacity: r2(finalIn) }} />
        </div>

        <img
          src={CUTOUT.watch}
          alt=""
          className="pointer-events-none absolute left-[6%] top-[58%] z-20 w-32 md:w-44"
          style={{ transform: `translateY(${r2(lerp(140, -260, p))}px) rotate(${r2(lerp(-8, 8, p))}deg)` }}
        />
        <img
          src={CUTOUT.buds}
          alt=""
          className="pointer-events-none absolute right-[7%] top-[18%] z-20 w-28 md:w-40"
          style={{ transform: `translateY(${r2(lerp(220, -380, p))}px)` }}
        />
        <img
          src={shot("apple-watch-milanese.jpg")}
          alt=""
          className="pointer-events-none absolute bottom-[-4%] right-[24%] z-0 hidden w-40 rounded-2xl opacity-40 md:block"
          style={{ transform: `translateY(${r2(lerp(0, -120, p))}px)` }}
        />

        <div className="absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center" style={{ opacity: r2(1 - textOut) }}>
          <Kicker light>Since the first counter</Kicker>
          <p className="mx-auto mt-4 max-w-3xl text-[34px] font-semibold leading-[1.08] tracking-tight md:text-[56px]">
            Genuine devices. Honest advice. One standard in every store.
          </p>
        </div>

        <div
          className="absolute inset-x-0 bottom-[12%] z-30 px-6 text-center"
          style={{ opacity: r2(finalIn), transform: `translateY(${r2(lerp(40, 0, finalIn))}px)` }}
        >
          <p className="mx-auto max-w-2xl text-[20px] leading-relaxed text-white/85 md:text-[24px]">
            New flagships reach our counters at launch — from iPhone and Galaxy Z Fold to Apple Watch and Mac — with clear
            pricing and stock you can see in person.
          </p>
        </div>
      </div>
    </section>
  );
}
