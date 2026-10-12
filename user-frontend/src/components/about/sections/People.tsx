"use client";

import { HERO, Kicker, TextMask, r2, useReducedMotion, useViewportShift } from "@/components/about/motion";
import { cn } from "@/lib/format";
import type { Settings, Store } from "@/lib/types";
import { Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, useState } from "react";

const VOICES = [
  {
    quote: "They compared three phones against how I actually use mine and recommended the cheaper one. I trust them for that.",
    name: "Sokha M.",
    meta: "Smartphone · Toul Tom Poung",
    img: HERO.apple
  },
  {
    quote: "Box, serial number, and warranty card were checked in front of me before I paid. Clear and professional.",
    name: "Daniel R.",
    meta: "Galaxy · Street 271",
    img: HERO.fold
  },
  {
    quote: "My pre-owned iPad came with a condition grade and battery check. It felt like buying new.",
    name: "Sreyneang P.",
    meta: "Pre-owned tablet · Phsar Depo",
    img: HERO.used
  },
  {
    quote: "I asked on Telegram in Khmer at lunch and had my watch delivered the same afternoon.",
    name: "Vannak C.",
    meta: "Watch · Delivery",
    img: HERO.watch
  }
];

/** Hovered card widens, its photo brightens and floats with the pointer (Framer “Fluid Testimonial Cards”). */
export function FluidTestimonials() {
  const [open, setOpen] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: r2(((e.clientX - r.left) / r.width - 0.5) * 24), y: r2(((e.clientY - r.top) / r.height - 0.5) * 24) });
  };

  return (
    <section className="relative z-10 bg-white py-24 md:py-32">
      <div className="container-xl">
        <Kicker>Customer stories</Kicker>
        <TextMask as="h2" text="What customers tell us at the counter." className="mt-4 max-w-[18ch] text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[52px]" />
        <div className="mt-14 flex flex-col gap-3 md:h-[440px] md:flex-row">
          {VOICES.map((v, i) => {
            const active = open === i;
            return (
              <article
                key={v.name}
                tabIndex={0}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onMouseMove={active ? onMove : undefined}
                className={cn(
                  "relative min-h-[280px] overflow-hidden rounded-[28px] bg-black text-white outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active ? "md:flex-[2.6]" : "md:flex-1"
                )}
              >
                <img
                  src={v.img}
                  alt=""
                  className={cn("absolute inset-[-24px] h-[calc(100%+48px)] w-[calc(100%+48px)] max-w-none object-cover transition-[filter,opacity] duration-700", active ? "opacity-70" : "opacity-35 grayscale")}
                  style={{ transform: active ? `translate3d(${tilt.x}px, ${tilt.y}px, 0)` : undefined }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
                  <p className={cn("text-[17px] leading-relaxed transition-opacity duration-500 md:text-[20px]", active ? "opacity-100" : "md:opacity-0")}>
                    “{v.quote}”
                  </p>
                  <p className="mt-5 text-[15px] font-semibold">{v.name}</p>
                  <p className="mt-0.5 text-[12px] text-white/55">{v.meta}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STORE_PHOTOS = [HERO.apple, HERO.fold, HERO.watch];

function StoreCard({ store, photo }: { store: Store; photo: string }) {
  const { ref, shift } = useViewportShift<HTMLDivElement>();
  const reduced = useReducedMotion();
  const address = store.addressEn || store.addressKh || "";
  return (
    <article className="overflow-hidden rounded-[28px] bg-[#1d1d1f]">
      <div ref={ref} className="relative h-[300px] overflow-hidden">
        <img
          src={photo}
          alt=""
          className="absolute inset-x-0 top-[-15%] h-[130%] w-full object-cover"
          style={{ transform: reduced ? undefined : `translate3d(0, ${r2(shift * 40)}px, 0)` }}
        />
      </div>
      <div className="p-7">
        <h3 className="text-[20px] font-semibold">{store.name}</h3>
        <p className="mt-3 flex gap-2 text-[14px] leading-relaxed text-white/60">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#2997ff]" />
          {address}
        </p>
        {store.phones && (
          <p className="mt-2 flex gap-2 text-[14px] leading-relaxed text-white/60">
            <Phone size={16} className="mt-0.5 shrink-0 text-[#2997ff]" />
            {store.phones}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-4 text-[14px] font-medium">
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="text-[#2997ff] hover:underline">
            Get directions ›
          </a>
          {store.facebookUrl && (
            <a href={store.facebookUrl} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white">
              Facebook
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Store cards with photos that drift inside their frames on scroll (Framer “Parallax Image Scroll”). */
export function StoresParallax({ stores }: { stores: Store[] }) {
  return (
    <section id="stores" className="relative z-10 scroll-mt-14 bg-black py-24 text-white md:py-32">
      <div className="container-xl">
        <Kicker light>Visit us</Kicker>
        <TextMask text={`${stores.length} stores across Phnom Penh.`} className="mt-4 text-[34px] font-semibold tracking-[-0.025em] md:text-[52px]" />
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/55">Same catalog, same prices, and the same warranty at every location.</p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {stores.map((store, i) => (
            <StoreCard key={store.id} store={store} photo={STORE_PHOTOS[i % STORE_PHOTOS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingContact({ settings }: { settings: Settings }) {
  const channels = [
    { icon: Phone, label: "Khmer", value: settings.khmerPhone, href: `tel:${settings.khmerPhone.replace(/[^\d+]/g, "")}` },
    { icon: Phone, label: "English", value: settings.englishPhone, href: `tel:${settings.englishPhone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: Send, label: "Telegram", value: "Message us", href: settings.telegramUrl },
    { icon: Facebook, label: "Facebook", value: "Seanghai Phone Shop", href: settings.facebookUrl }
  ];

  return (
    <section className="relative z-10 bg-apple-gray py-24 md:py-32">
      <div className="container-xl grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Kicker>Get in touch</Kicker>
          <TextMask as="h2" text="Questions before you buy? Just ask." className="mt-4 max-w-[16ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.025em] text-navy md:text-[60px]" />
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-apple-muted">
            Our team answers in Khmer and English — about a device, an order, or a warranty. {settings.freeDeliveryNote}.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products" className="btn-gold">
              Shop the store
            </Link>
            <Link href="/contact" className="rounded-full border border-black/15 px-6 py-2.5 font-semibold text-navy transition hover:bg-white">
              Contact support
            </Link>
          </div>
        </div>
        <ul className="divide-y divide-black/10 rounded-[28px] bg-white px-7">
          {channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 py-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-apple-gray text-navy transition group-hover:bg-gold group-hover:text-white">
                  <c.icon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-[12px] text-apple-muted">{c.label}</span>
                  <span className="block text-[16px] font-medium text-navy">{c.value}</span>
                </span>
                <span className="text-apple-muted transition group-hover:translate-x-1 group-hover:text-gold">›</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
