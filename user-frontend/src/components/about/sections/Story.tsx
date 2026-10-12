"use client";

import { CUTOUT, DistortText, HERO, Kicker, TextMask, shot } from "@/components/about/motion";
import { cn } from "@/lib/format";

export type Chapter = {
  kicker: string;
  title: string;
  body: string;
  points: string[];
  tone: "black" | "graphite" | "light";
  media: { src: string; kind: "photo" | "cutout" | "product" };
};

const CHAPTERS: Chapter[] = [
  {
    kicker: "Who we are",
    title: "A specialist, not a supermarket.",
    body: "Seanghai Phone Shop focuses on one thing: mobile technology. We carry flagship and everyday devices from Apple, Samsung, OPPO, Xiaomi, Vivo, Huawei, Google, and more — plus certified pre-owned devices for customers who want quality at a lower price.",
    points: ["New and certified pre-owned", "Smartphones to Mac", "Khmer and English service"],
    tone: "black",
    media: { src: HERO.apple, kind: "photo" }
  },
  {
    kicker: "How we work",
    title: "Advice first. Then the right device.",
    body: "Tell us how you use your phone — photos, work, gaming, battery life, budget. Our team compares the options side by side, lets you try them in hand, and explains the difference in plain language before you pay.",
    points: ["Side-by-side comparison", "Hands-on before purchase", "Transparent, listed pricing"],
    tone: "graphite",
    media: { src: CUTOUT.phone, kind: "cutout" }
  },
  {
    kicker: "After the sale",
    title: "Support that continues after checkout.",
    body: "Every purchase comes with written warranty terms. We help set up your new device, match the right case, charger, and protection, and handle warranty questions through the store — so you always know who to call.",
    points: ["Written warranty terms", "Setup and accessory matching", "One store contact for follow-up"],
    tone: "light",
    media: { src: shot("iphone-16-pro.jpg"), kind: "product" }
  }
];

const TONES = {
  black: { bg: "bg-black", text: "text-white", body: "text-white/65", line: "border-white/12", light: true },
  graphite: { bg: "bg-[#1d1d1f]", text: "text-white", body: "text-white/65", line: "border-white/12", light: true },
  light: { bg: "bg-apple-gray", text: "text-navy", body: "text-apple-muted", line: "border-black/10", light: false }
};

/** Each panel scrolls away to reveal the next one already pinned underneath (Framer “Unmask”). */
export function UnmaskChapters({ chapters = CHAPTERS }: { chapters?: Chapter[] }) {
  return (
    <div className="relative">
      {chapters.map((ch, i) => {
        const tone = TONES[ch.tone];
        return (
          <div
            key={ch.kicker}
            className="relative"
            style={{
              height: "calc(2 * (100svh - 3.5rem))",
              marginTop: i === 0 ? 0 : "calc(-1 * (100svh - 3.5rem))",
              zIndex: chapters.length - i
            }}
          >
            <section className={cn("sticky top-14 flex h-[calc(100svh-3.5rem)] items-center overflow-hidden", tone.bg, tone.text)}>
              <div className="container-xl grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <Kicker light={tone.light}>
                    0{i + 1} — {ch.kicker}
                  </Kicker>
                  <TextMask text={ch.title} className="mt-4 max-w-[16ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[58px]" />
                  <p className={cn("mt-6 max-w-xl text-[17px] leading-relaxed md:text-[19px]", tone.body)}>{ch.body}</p>
                  <ul className={cn("mt-8 grid max-w-xl gap-3 border-t pt-6 sm:grid-cols-3", tone.line)}>
                    {ch.points.map((pt) => (
                      <li key={pt} className="text-[14px] font-medium leading-snug">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative hidden h-[64vh] lg:block">
                  {ch.media.kind === "photo" && (
                    <img src={ch.media.src} alt="" className="h-full w-full rounded-[32px] object-cover" />
                  )}
                  {ch.media.kind === "cutout" && (
                    <div className="relative flex h-full items-center justify-center rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,113,227,0.35),transparent_70%)]">
                      <img src={ch.media.src} alt="" className="h-[86%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]" />
                    </div>
                  )}
                  {ch.media.kind === "product" && (
                    <div className="flex h-full items-center justify-center rounded-[32px] bg-white">
                      <img src={ch.media.src} alt="" className="h-[80%] object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}

export function DistortStatement({
  kicker = "Our standard",
  text = "Technology changes every season. Our standard doesn’t.",
  body = "Genuine stock, clear prices, and a team that tells you when the cheaper model is the better choice."
}: {
  kicker?: string;
  text?: string;
  body?: string;
}) {
  return (
    <section className="relative z-10 bg-black py-28 text-white md:py-40">
      <div className="container-xl text-center">
        <Kicker light>{kicker}</Kicker>
        <DistortText text={text} className="mx-auto mt-6 max-w-5xl text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[80px]" />
        <p className="mx-auto mt-8 max-w-2xl text-[17px] leading-relaxed text-white/55">{body}</p>
      </div>
    </section>
  );
}
