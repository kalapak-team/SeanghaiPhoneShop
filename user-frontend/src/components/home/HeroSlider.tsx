"use client";

import { Banner } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Slide = Pick<Banner, "id" | "title" | "subtitle" | "imageUrl" | "linkUrl" | "buttonText" | "theme">;

const THEMES: Record<string, { eyebrow: string; image: string }> = {
  fold: { eyebrow: "Samsung Galaxy", image: "/hero/fold.jpg" },
  apple: { eyebrow: "Apple", image: "/hero/apple.jpg" },
  used: { eyebrow: "Certified pre-owned", image: "/hero/used.jpg" },
  watch: { eyebrow: "Wearables", image: "/hero/watch.jpg" }
};

const FALLBACK: Slide = {
  id: 0,
  title: "Ready to upgrade",
  subtitle: "Genuine phones, best prices in Cambodia",
  imageUrl: "/hero/apple.jpg",
  linkUrl: "/products",
  buttonText: "Shop Now",
  theme: "apple"
};

const AUTOPLAY_MS = 7000;

function heroImage(slide: Slide) {
  const theme = THEMES[slide.theme || ""];
  return theme?.image || slide.imageUrl || FALLBACK.imageUrl!;
}

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const slides: Slide[] = banners.length ? banners : [FALLBACK];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => setIndex((i) => (i + n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, paused, slides.length]);

  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white"
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Full-bleed backgrounds, crossfaded */}
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${active ? "opacity-100" : "opacity-0"}`}
          >
            <img
              key={active ? `on-${slide.id}` : `off-${slide.id}`}
              src={heroImage(slide)}
              alt=""
              className={`h-full w-full object-cover object-[70%_center] ${active ? "animate-kenburns" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        );
      })}
      {/* Legibility scrims: left-to-right and bottom-to-top */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Copy */}
      <div className="container-xl relative flex min-h-[520px] items-center py-20 md:min-h-[600px] lg:min-h-[640px]">
        {slides.map((slide, i) => {
          const active = i === index;
          const eyebrow = THEMES[slide.theme || ""]?.eyebrow || "Seanghai selection";
          return (
            <div
              key={slide.id}
              className={`max-w-xl lg:pl-8 ${active ? "" : "pointer-events-none absolute inset-x-4 opacity-0"}`}
              aria-hidden={!active}
            >
              {active && (
                <>
                  <p className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{eyebrow}</p>
                  <h1
                    className="mt-4 animate-fade-up text-[40px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl md:text-6xl"
                    style={{ animationDelay: "80ms" }}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="mt-5 max-w-md animate-fade-up text-base leading-relaxed text-white/75 md:text-lg" style={{ animationDelay: "160ms" }}>
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: "240ms" }}>
                    {slide.linkUrl && (
                      <Link
                        href={slide.linkUrl}
                        className="inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-navy transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/70"
                      >
                        {slide.buttonText || "Shop Now"}
                      </Link>
                    )}
                    <Link href="/contact" className="inline-flex min-h-11 items-center text-sm font-medium text-white/85 transition hover:text-white">
                      Talk to an expert <span aria-hidden className="ml-1.5 text-base leading-none">›</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 sm:flex lg:left-5"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 sm:flex lg:right-5"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
