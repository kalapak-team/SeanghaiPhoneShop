"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCard as ProductCardType } from "@/lib/types";
import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

export function ProductRow({ products }: { products: ProductCardType[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 1 });
  const [canScroll, setCanScroll] = useState({ prev: false, next: false });

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const width = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    const left = max > 0 ? (el.scrollLeft / max) * (1 - width) : 0;
    setThumb({ left, width: Math.min(1, width) });
    setCanScroll({ prev: el.scrollLeft > 4, next: max - el.scrollLeft > 4 });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [products, update]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const seek = (clientX: number, track: HTMLDivElement, smooth = true) => {
    const el = scrollerRef.current;
    if (!el) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.scrollTo({ left: ratio * (el.scrollWidth - el.clientWidth), behavior: smooth ? "smooth" : "auto" });
  };

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    track.setPointerCapture(e.pointerId);
    seek(e.clientX, track, false);
    const move = (ev: globalThis.PointerEvent) => seek(ev.clientX, track, false);
    const up = () => {
      track.releasePointerCapture(e.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  if (!products?.length) {
    return <p className="py-16 text-center text-slate-500">No products found.</p>;
  }

  return (
    <div className="relative">
      <div ref={scrollerRef} className="product-row flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex w-[72%] shrink-0 snap-start flex-col sm:w-[46%] md:w-[calc((100%-5rem)/5.2)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {canScroll.next && (
        <button
          type="button"
          aria-label="Next products"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 md:flex"
        >
          <span className="text-xl text-[#1d1d1f]">›</span>
        </button>
      )}
      {canScroll.prev && (
        <button
          type="button"
          aria-label="Previous products"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 md:flex"
        >
          <span className="text-xl text-[#1d1d1f]">‹</span>
        </button>
      )}

      <div
        className="mt-4 h-[3px] w-full cursor-pointer rounded-full bg-[#d2d2d7] [.bg-black_&]:bg-white/25"
        onPointerDown={onTrackPointerDown}
        role="scrollbar"
        aria-valuenow={Math.round(thumb.left * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#1d1d1f] transition-[margin,width] duration-150 [.bg-black_&]:bg-white"
          style={{ width: `${thumb.width * 100}%`, marginLeft: `${thumb.left * 100}%` }}
        />
      </div>
    </div>
  );
}
