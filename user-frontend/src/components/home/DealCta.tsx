"use client";

import { Settings } from "@/lib/types";
import { Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DEVICES = [
  { src: "/cta/phone.png?v=2", alt: "Smartphone", className: "cta-phone", depth: 1 },
  { src: "/cta/watch.png", alt: "Smartwatch", className: "cta-watch", depth: 1.8 },
  { src: "/cta/buds.png", alt: "Wireless earbuds", className: "cta-buds", depth: 2.4 }
];

export function DealCta({ settings }: { settings: Settings }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: x * 2, y: y * 2 });
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* ambient light */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_75%_50%,rgba(0,113,227,0.28),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_15%_90%,rgba(0,113,227,0.14),transparent_70%)]" />
      <div className="cta-grid pointer-events-none absolute inset-0 opacity-[0.35]" />

      <div
        ref={sceneRef}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className={`container-xl relative grid min-h-[560px] items-center gap-10 py-20 lg:grid-cols-2 lg:py-24 ${visible ? "cta-in" : ""}`}
      >
        <div className="relative z-10 max-w-xl text-center lg:text-left">
          <p className="cta-reveal text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">Seanghai Exclusive</p>
          <h2 className="cta-reveal mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]" style={{ animationDelay: "90ms" }}>
            The latest tech.
            <br />
            <span className="cta-shimmer">Before anyone else.</span>
          </h2>
          <p className="cta-reveal mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg lg:mx-0" style={{ animationDelay: "180ms" }}>
            New arrivals, flash deals and price drops. Join our Telegram channel and be first to know.
          </p>
          <div className="cta-reveal mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start" style={{ animationDelay: "270ms" }}>
            <a
              href={settings.telegramChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(0,113,227,0.45)] transition hover:bg-gold-dark hover:shadow-[0_14px_50px_rgba(0,113,227,0.6)]"
            >
              <Send size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Join Telegram
            </a>
            <Link href="/products?featured=true" className="inline-flex min-h-12 items-center text-sm font-medium text-white/85 transition hover:text-white">
              Explore new arrivals <span aria-hidden className="ml-1.5 text-base leading-none">›</span>
            </Link>
          </div>
        </div>

        {/* 3D scene */}
        <div className="cta-scene relative mx-auto h-[380px] w-full max-w-[560px] md:h-[460px]" aria-hidden>
          <div className="cta-ring absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/30 md:h-[380px] md:w-[380px]" />
          <div className="cta-ring absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 md:h-[520px] md:w-[520px]" style={{ animationDelay: "-6s", animationDirection: "reverse" }} />
          <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/30 blur-[90px] md:h-[300px] md:w-[300px]" />

          {DEVICES.map((d) => (
            <div
              key={d.src}
              className={`${d.className} absolute will-change-transform`}
              style={{
                transform: `translate3d(${(-tilt.x * 14 * d.depth).toFixed(1)}px, ${(-tilt.y * 10 * d.depth).toFixed(1)}px, 0)`,
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)"
              }}
            >
              <img
                src={d.src}
                alt={d.alt}
                className="cta-float h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
                style={{ animationDelay: `${d.depth * -1.3}s` }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
