"use client";

import { cn } from "@/lib/format";
import { type ElementType, type RefObject, useEffect, useRef, useState } from "react";

export const shot = (file: string) => `/products/${file}`;

export const HERO = {
  apple: "/hero/apple.jpg",
  fold: "/hero/fold.jpg",
  watch: "/hero/watch.jpg",
  used: "/hero/used.jpg"
};

export const CUTOUT = {
  phone: "/cta/phone.png?v=2",
  watch: "/cta/watch.png",
  buds: "/cta/buds.png"
};

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
/** Maps progress p inside [start, end] to 0..1. */
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
/** Rounded so server and client style strings match during hydration. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/**
 * Scroll progress of a tall section with a sticky child: 0 when its top reaches the
 * header, 1 when its bottom leaves the viewport. Skips work while far off-screen.
 */
export function usePinProgress<T extends HTMLElement = HTMLDivElement>(offset = 56) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const total = Math.max(el.offsetHeight - (window.innerHeight - offset), 1);
      setP(r2(clamp((offset - rect.top) / total) * 1000) / 1000);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [offset]);

  return { ref, p };
}

/** -1..1 position of an element relative to the viewport center (for in-flow parallax). */
export function useViewportShift<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [shift, setShift] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      setShift(r2(clamp((rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2), -1, 1) * 100) / 100);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return { ref, shift };
}

export function useInView<T extends HTMLElement>(threshold = 0.3): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Line-masked word reveal (Framer “Text Mask”). */
export function TextMask({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 45
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.35);
  return (
    <Tag ref={ref} aria-label={text} className={cn("about-mask", inView && "about-mask-in", className)}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="about-mask-word">
          <span style={{ transitionDelay: `${delay + i * stagger}ms` }}>{word}</span>
        </span>
      ))}
    </Tag>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";

/** Characters resolve left to right (Framer “Scramble”). Replays when `trigger` changes. */
export function ScrambleText({ text, className, trigger = 0 }: { text: string; className?: string; trigger?: number }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      setOut(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < frame / 2 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (frame / 2 > text.length) {
        window.clearInterval(id);
        setOut(text);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [trigger, text]);
  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}

/** Scroll-velocity wave that settles when scrolling stops (Framer “Text Distortion”). */
export function DistortText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    let last = window.scrollY;
    let energy = 0;
    let t = 0;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      energy = Math.min(1, energy * 0.9 + Math.abs(y - last) / 220);
      last = y;
      t += 0.06;
      chars.forEach((c, i) => {
        const wave = Math.sin(t * 3 + i * 0.42) * 16 * energy;
        const skew = Math.cos(t * 2 + i * 0.3) * 10 * energy;
        c.style.transform = energy < 0.01 ? "" : `translateY(${wave.toFixed(2)}px) skewX(${skew.toFixed(2)}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((ch, i) => (
            <span key={i} data-ch className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}

/** Eyebrow label used across sections. */
export function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={cn("text-[12px] font-semibold uppercase tracking-[0.22em]", light ? "text-[#2997ff]" : "text-gold")}>{children}</p>
  );
}

/** Seeded catalog names carry a "#123" suffix; strip it for display. */
export function cleanName(name: string) {
  return name.replace(/\s*#\d+\s*$/, "");
}
