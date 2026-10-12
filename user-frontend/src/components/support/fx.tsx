"use client";

import { ScrambleText, clamp, r2, useReducedMotion } from "@/components/about/motion";
import { cn } from "@/lib/format";
import { type ElementType, useEffect, useRef, useState } from "react";

/** 0 when the element's top enters the viewport, 1 once it has risen ~65% of the viewport. */
export function useEnterProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(r2(clamp((vh - r.top) / (vh * 0.65))));
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
  }, []);
  return { ref, p };
}

/** Each line fills with ink from left to right as it scrolls into view (Framer “Text Mask”). */
export function FillText({
  text,
  className,
  as: Tag = "h2",
  dark = false
}: {
  text: string;
  className?: string;
  as?: ElementType;
  dark?: boolean;
}) {
  const { ref, p } = useEnterProgress<HTMLHeadingElement>();
  const reduced = useReducedMotion();
  const pos = reduced ? 0 : r2(100 - p * 100);
  const on = dark ? "#ffffff" : "#1d1d1f";
  const off = dark ? "rgba(255,255,255,0.18)" : "rgba(29,29,31,0.14)";
  return (
    <Tag ref={ref} className={className}>
      <span
        className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
        style={{
          backgroundImage: `linear-gradient(90deg, ${on} 0%, ${on} 46%, #0071e3 50%, ${off} 54%, ${off} 100%)`,
          backgroundSize: "220% 100%",
          backgroundPosition: `${pos}% 0`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}
      >
        {text}
      </span>
    </Tag>
  );
}

/** Words flip over a horizontal axis like a split-flap board (Framer “3D Flipping Hero”). */
export function FlapWord({
  words,
  className,
  wordClassName,
  interval = 2400
}: {
  words: string[];
  className?: string;
  /** Applied to each word; put background-clip text styles here, not on `className`. */
  wordClassName?: string;
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduced, words.length, interval]);
  const prev = (idx - 1 + words.length) % words.length;
  return (
    <span className={cn("sup-flap", className)} aria-live="polite">
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== idx}
          className={wordClassName}
          style={{
            transform: i === idx ? "rotateX(0deg)" : i === prev ? "rotateX(90deg)" : "rotateX(-90deg)",
            opacity: i === idx ? 1 : 0
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/** Scrambled characters with red/blue channel split on hover of the closest `.group`. */
export function GlitchText({ text, trigger, className }: { text: string; trigger: number; className?: string }) {
  return (
    <span className={cn("sup-glitch", className)} data-text={text}>
      <ScrambleText text={text} trigger={trigger} />
    </span>
  );
}
