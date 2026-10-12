"use client";

import { Kicker, TextMask, easeOut, lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { cn } from "@/lib/format";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SHOWCASE = [
  { name: "iPhone 16 Pro", note: "Titanium design, pro camera system", file: "iphone-16-pro.jpg", q: "iPhone 16 Pro" },
  { name: "Galaxy Z Fold", note: "A phone that opens into a tablet", file: "galaxy-z-fold.jpg", q: "Galaxy Z Fold" },
  { name: "Galaxy S26 Ultra", note: "S Pen, 200MP camera, Galaxy AI", file: "galaxy-s26-ultra.jpg", q: "Galaxy S26" },
  { name: "Apple Watch", note: "Health, fitness, and safety on your wrist", file: "apple-watch.jpg", q: "Apple Watch" },
  { name: "MacBook Air", note: "Thin, silent, all-day battery", file: "macbook-air.jpg", q: "MacBook" },
  { name: "iPad Pro", note: "Studio-grade display, Apple Pencil ready", file: "ipad-pro.jpg", q: "iPad" },
  { name: "AirPods Max", note: "Over-ear sound with noise cancellation", file: "airpods-max.jpg", q: "AirPods" },
  { name: "Google Pixel", note: "Clean Android, standout photos", file: "google-pixel.jpg", q: "Pixel" }
];

const QUADS = [
  { pos: "0% 0%", from: "translate(-36px,-36px) scale(0.92)" },
  { pos: "100% 0%", from: "translate(36px,-36px) scale(0.92)" },
  { pos: "0% 100%", from: "translate(-36px,36px) scale(0.92)" },
  { pos: "100% 100%", from: "translate(36px,36px) scale(0.92)" }
];

/** Hovering a thumbnail assembles a large preview from four pieces (Framer “Grid Morphs Into Preview”). */
export function GridMorphPreview() {
  const [active, setActive] = useState(0);
  const [joined, setJoined] = useState(true);
  const item = SHOWCASE[active];

  const pick = (i: number) => {
    if (i === active) return;
    setJoined(false);
    setActive(i);
    requestAnimationFrame(() => requestAnimationFrame(() => setJoined(true)));
  };

  const thumb = (i: number) => (
    <button
      type="button"
      key={SHOWCASE[i].name}
      onMouseEnter={() => pick(i)}
      onFocus={() => pick(i)}
      onClick={() => pick(i)}
      aria-label={SHOWCASE[i].name}
      className={cn(
        "flex aspect-square items-center justify-center rounded-2xl bg-white p-3 transition duration-300",
        active === i ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"
      )}
    >
      <img src={shot(SHOWCASE[i].file)} alt="" className="max-h-full object-contain" />
    </button>
  );

  return (
    <section className="relative z-10 bg-apple-gray py-24 md:py-32">
      <div className="container-xl">
        <div className="text-center">
          <Kicker>Featured devices</Kicker>
          <TextMask as="h2" text="Hold the one you’re curious about." className="mx-auto mt-4 max-w-[20ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[52px]" />
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-apple-muted">Most of what you see online is on display in store, ready to try before you buy.</p>
        </div>

        <div className="mt-14 grid items-center gap-5 md:grid-cols-[1fr_1.6fr_1fr]">
          <div className="grid grid-cols-4 gap-3 md:grid-cols-2">{[0, 1, 2, 3].map(thumb)}</div>

          <div className="order-first rounded-[32px] bg-white p-6 md:order-none md:p-8">
            <div className="relative mx-auto grid aspect-square w-full max-w-[440px] grid-cols-2 grid-rows-2">
              {QUADS.map((q) => (
                <div
                  key={q.pos}
                  className="about-quad"
                  style={{
                    backgroundImage: `url(${shot(item.file)})`,
                    backgroundPosition: q.pos,
                    transform: joined ? "none" : q.from,
                    opacity: joined ? 1 : 0,
                    transition: joined ? undefined : "none"
                  }}
                />
              ))}
            </div>
            <div className="mt-4 overflow-hidden text-center">
              <div key={item.name} className="animate-fade-up">
                <p className="text-[22px] font-semibold text-navy">{item.name}</p>
                <p className="mt-1 text-[14px] text-apple-muted">{item.note}</p>
                <Link href={`/search?q=${encodeURIComponent(item.q)}`} className="mt-3 inline-block text-[14px] font-medium text-gold hover:underline">
                  See models and prices ›
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:grid-cols-2">{[4, 5, 6, 7].map(thumb)}</div>
        </div>
      </div>
    </section>
  );
}

const GRID_FILES = [
  "iphone-16-pro-max.jpg", "galaxy-z-flip.jpg", "apple-watch-milanese.jpg", "ipad-air.jpg",
  "galaxy-buds4-pro.jpg", "mac-mini.jpg", "oppo-reno16.jpg", "smartwatch-sport.jpg",
  "huawei-mate-x7.jpg", "airpods.jpg", "galaxy-tab.jpg", "power-bank.jpg"
];

/** Tiles fall from depth into a 3D grid in four timed groups (Framer “3D Grid Scroll”). */
export function Grid3DScroll({
  products,
  kicker = "The catalog",
  title,
  body = "Phones, tablets, watches, computers, audio, and accessories — online and in store."
}: {
  products: number;
  kicker?: string;
  title?: string;
  body?: string;
}) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="relative z-10 h-[240vh] bg-apple-gray">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col items-center justify-center overflow-hidden">
        <div className="relative z-20 px-6 text-center">
          <Kicker>{kicker}</Kicker>
          <p className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[52px]">
            {title ?? `${products.toLocaleString("en-US")} products. One catalog.`}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[16px] text-apple-muted">{body}</p>
        </div>
        <div className="about-persp mt-8 w-full max-w-[920px] px-4">
          <div className="about-preserve grid grid-cols-4 gap-3 md:gap-4" style={{ transform: "rotateX(14deg)" }}>
            {GRID_FILES.map((file, i) => {
              const group = i % 4;
              const t = reduced ? 1 : easeOut(range(p, 0.05 + group * 0.1, 0.4 + group * 0.1));
              return (
                <div
                  key={file}
                  className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                  style={{
                    opacity: r2(t),
                    transform: `translate3d(0, ${r2(lerp(-220, 0, t))}px, ${r2(lerp(-600, 0, t))}px) rotateX(${r2(lerp(60, 0, t))}deg) rotateZ(${r2(lerp((group - 1.5) * 8, 0, t))}deg)`
                  }}
                >
                  <img src={shot(file)} alt="" className="max-h-full object-contain" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const WALL = [
  "iphone-15.jpg", "galaxy-s25-fe.jpg", "airpods.jpg", "matepad.jpg", "galaxy-buds4-rose.jpg", "laptop-windows.jpg",
  "poco-phone.jpg", "clear-magsafe-case.jpg", "bluetooth-speaker.jpg", "fitness-band.jpg", "external-ssd.jpg", "iphone-14.jpg",
  "galaxy-a-series.jpg", "wireless-charger.jpg", "keyboard.jpg", "projector.jpg", "action-camera.jpg", "gaming-phone.jpg"
];

const CELL = 210;

/** Drag-to-explore wall that wraps endlessly, with child parallax (Framer “Infinite Canvas”). */
export function InfiniteCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const [grid, setGrid] = useState({ cols: 8, rows: 4 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setGrid({ cols: Math.ceil(e.contentRect.width / CELL) + 2, rows: Math.ceil(e.contentRect.height / CELL) + 2 })
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let ox = 0;
    let oy = 0;
    let vx = reduced ? 0 : -0.35;
    let vy = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    const W = grid.cols * CELL;
    const H = grid.rows * CELL;
    const mod = (n: number, m: number) => ((n % m) + m) % m;

    const frame = () => {
      if (!dragging) {
        ox += vx;
        oy += vy;
        vx = lerp(vx, reduced ? 0 : -0.35, 0.03);
        vy *= 0.94;
      }
      const cx = el.clientWidth / 2;
      const cy = el.clientHeight / 2;
      tiles.current.forEach((tile, i) => {
        if (!tile) return;
        const c = i % grid.cols;
        const r = Math.floor(i / grid.cols);
        const x = mod(c * CELL + ox + (r % 2) * (CELL / 2), W) - CELL;
        const y = mod(r * CELL + oy, H) - CELL;
        tile.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        const img = imgs.current[i];
        if (img) img.style.transform = `translate3d(${((x - cx) * -0.04).toFixed(1)}px, ${((y - cy) * -0.04).toFixed(1)}px, 0)`;
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
          <Kicker>Explore</Kicker>
          <TextMask as="h2" text="A wall of choice. Drag to explore." className="mt-4 max-w-[18ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[52px]" />
        </div>
        <Link href="/products" className="btn-gold">
          Open the full catalog
        </Link>
      </div>
      <div
        ref={wrap}
        className="relative mt-12 h-[70vh] cursor-grab touch-pan-y select-none overflow-hidden bg-apple-gray active:cursor-grabbing"
        aria-label="Product wall, drag to explore"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} ref={(n) => { tiles.current[i] = n; }} className="absolute left-0 top-0 p-2" style={{ width: CELL, height: CELL }}>
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <img
                ref={(n) => { imgs.current[i] = n; }}
                src={shot(WALL[(i * 7) % WALL.length])}
                alt=""
                draggable={false}
                className="max-h-full object-contain"
              />
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,transparent_55%,rgba(245,245,247,0.95))]" />
      </div>
    </section>
  );
}
