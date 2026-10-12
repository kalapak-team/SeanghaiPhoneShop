"use client";

import { HERO, r2, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { FillText } from "@/components/support/fx";
import { tel } from "@/components/support/sections/Hero";
import { cn } from "@/lib/format";
import type { Settings, Store } from "@/lib/types";
import { Check, Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import { type FormEvent, type MouseEvent, useEffect, useRef, useState } from "react";

const STORIES = [
  {
    quote: "My screen stopped responding two weeks after purchase. I sent a video on Telegram, they asked me to come in, and it was sorted the same day under warranty.",
    name: "Dara K.",
    meta: "Warranty · Smartphone",
    blob: "from-[#2997ff] to-[#0071e3]",
    offset: "lg:mt-0"
  },
  {
    quote: "I called the English line to check stock before driving across town. They held the colour I wanted at the counter.",
    name: "Emily T.",
    meta: "Product advice · Pickup",
    blob: "from-[#a78bfa] to-[#6366f1]",
    offset: "lg:mt-20"
  },
  {
    quote: "They moved everything from my old Android to my new iPhone — photos, contacts, even my chats — while I waited.",
    name: "Bopha S.",
    meta: "Setup · Data transfer",
    blob: "from-[#34d399] to-[#059669]",
    offset: "lg:mt-6"
  },
  {
    quote: "The order was confirmed by phone within the hour, and the rider called before arriving. Simple and clear.",
    name: "Kimheng L.",
    meta: "Delivery · Watch",
    blob: "from-[#fb923c] to-[#f43f5e]",
    offset: "lg:mt-28"
  }
];

function StoryCard({ story, i }: { story: (typeof STORIES)[number]; i: number }) {
  const [pull, setPull] = useState({ x: 0, y: 0, on: false });
  const reduced = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPull({ x: r2((e.clientX - r.left - r.width / 2) * 0.12), y: r2((e.clientY - r.top - r.height / 2) * 0.12), on: true });
  };

  return (
    <div className={cn("relative", story.offset)} style={{ animation: reduced ? undefined : `sup-float ${6 + i}s ease-in-out ${i * 0.7}s infinite` }}>
      <div
        aria-hidden
        className={cn("sup-blob absolute -inset-6 bg-gradient-to-br opacity-70 blur-[2px] transition-transform duration-700", story.blob)}
        style={{ transform: `translate(${r2(pull.x * -0.6)}px, ${r2(pull.y * -0.6)}px) scale(${pull.on ? 1.08 : 0.94})`, animationDelay: `${i * -3}s` }}
      />
      <article
        tabIndex={0}
        onMouseMove={onMove}
        onMouseLeave={() => setPull({ x: 0, y: 0, on: false })}
        className="relative flex min-h-[300px] flex-col justify-between rounded-[30px] bg-white/85 p-7 shadow-[0_30px_60px_rgba(0,40,100,0.12)] outline-none backdrop-blur-xl transition-transform duration-300 ease-out"
        style={{ transform: `translate(${pull.x}px, ${pull.y}px)` }}
      >
        <p className="text-[17px] leading-relaxed text-navy">“{story.quote}”</p>
        <div className="mt-6 flex items-center gap-3">
          <span className={cn("sup-blob flex h-11 w-11 items-center justify-center bg-gradient-to-br text-[14px] font-semibold text-white", story.blob)}>{story.name[0]}</span>
          <span>
            <span className="block text-[15px] font-semibold text-navy">{story.name}</span>
            <span className="block text-[12px] text-apple-muted">{story.meta}</span>
          </span>
        </div>
      </article>
    </div>
  );
}

/** Floating cards on morphing blobs that lean toward the cursor (Framer “Fluid Testimonial Cards”). */
export function BlobStories() {
  return (
    <section className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,#f5f5f7,#e9f2ff)] py-24 md:py-32">
      <div className="container-xl">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Support stories</p>
          <FillText text="Problems solved, in their words." className="mx-auto mt-4 max-w-[16ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
        </div>
        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STORIES.map((story, i) => (
            <StoryCard key={story.name} story={story} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const STORE_PHOTOS = [HERO.apple, HERO.fold, HERO.watch, HERO.used];

/** Pinned horizontal rail; photos drift inside their frames as cards pass (Framer “Parallax Image Scroll”). */
export function StoresRail({ stores }: { stores: Store[] }) {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [geo, setGeo] = useState({ max: 0, vw: 1440, centers: [] as number[] });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () =>
      setGeo({
        max: Math.max(0, el.scrollWidth - el.clientWidth),
        vw: el.clientWidth,
        centers: cards.current.map((c) => (c ? c.offsetLeft + c.offsetWidth / 2 : 0))
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stores.length]);

  const shift = reduced ? 0 : r2(p * geo.max);

  return (
    <section ref={ref} id="stores" className={cn("relative z-10 scroll-mt-14 bg-black text-white", reduced ? "py-24" : "h-[280vh]")}>
      <div className={cn(!reduced && "sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden")}>
        <div ref={track} className={cn("flex gap-5 px-[max(1.5rem,calc((100vw-1120px)/2))]", reduced && "overflow-x-auto")} style={{ transform: `translate3d(${-shift}px,0,0)` }}>
          <div className="flex w-[min(80vw,400px)] shrink-0 flex-col justify-center pr-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">Walk-in help</p>
            <FillText dark text={`${stores.length} stores across Phnom Penh.`} className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[54px]" />
            <p className="mt-5 text-[16px] leading-relaxed text-white/55">Bring your device and receipt to any store for setup, accessories, and warranty checks. Same team, same standards.</p>
          </div>
          {stores.map((store, i) => {
            const address = store.addressEn || store.addressKh || "";
            const offset = geo.centers[i] ? (geo.centers[i] - shift - geo.vw / 2) * -0.14 : 0;
            return (
              <article
                key={store.id}
                ref={(n) => {
                  cards.current[i] = n;
                }}
                className="flex h-[min(68vh,560px)] w-[min(84vw,500px)] shrink-0 flex-col overflow-hidden rounded-[30px] bg-[#1d1d1f]"
              >
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={STORE_PHOTOS[i % STORE_PHOTOS.length]}
                    alt=""
                    className="absolute inset-y-0 left-[-20%] h-full w-[140%] max-w-none object-cover"
                    style={{ transform: `translate3d(${r2(offset)}px,0,0)` }}
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 font-mono text-[12px] backdrop-blur">0{i + 1}</span>
                </div>
                <div className="p-7">
                  <h3 className="text-[22px] font-semibold">{store.name}</h3>
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
                  <div className="mt-5 flex gap-5 text-[14px] font-medium">
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
          })}
        </div>
        {!reduced && (
          <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-[#2997ff]" style={{ width: `${r2(p * 100)}%` }} />
          </div>
        )}
      </div>
    </section>
  );
}

const TOPICS = ["Order status", "Delivery", "Warranty or repair", "Product advice", "Pre-owned", "Something else"];

export function MessageComposer({ settings, stores }: { settings: Settings; stores: Store[] }) {
  const [form, setForm] = useState({ name: "", phone: "", order: "", store: "", message: "" });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [notice, setNotice] = useState("");

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const compose = () => {
    const header = [
      `Topic: ${topic}`,
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.order && `Order number: ${form.order}`,
      form.store && `Preferred store: ${form.store}`
    ].filter(Boolean);
    return `${header.join("\n")}\n\n${form.message}`;
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    const subject = `[${topic}] ${form.name}`;
    window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`;
    setNotice("Your email app should open with the message ready to send.");
  };

  const sendTelegram = async (e: MouseEvent<HTMLButtonElement>) => {
    const formEl = e.currentTarget.form;
    if (formEl && !formEl.reportValidity()) return;
    try {
      await navigator.clipboard.writeText(compose());
      setNotice("Message copied. Paste it into the Telegram chat that just opened.");
    } catch {
      setNotice("Telegram opened. Type or paste your message there.");
    }
    window.open(settings.telegramUrl, "_blank", "noreferrer");
  };

  const field = "w-full rounded-xl border border-black/10 bg-apple-gray px-4 py-3 text-[15px] text-navy outline-none transition focus:border-gold focus:bg-white";

  const channels = [
    { icon: Phone, label: "Khmer line", value: settings.khmerPhone, href: tel(settings.khmerPhone) },
    { icon: Phone, label: "English line", value: settings.englishPhone, href: tel(settings.englishPhone) },
    { icon: Send, label: "Telegram", value: "Chat with our team", href: settings.telegramUrl },
    { icon: Facebook, label: "Facebook", value: "Seanghai Phone Shop in Cambodia", href: settings.facebookUrl },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` }
  ];

  return (
    <section id="message" className="relative z-10 scroll-mt-14 bg-white py-24 md:py-32">
      <div className="container-xl grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">Send a message</p>
          <FillText text="Tell us what you need." className="mt-4 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-apple-muted">
            Include your order number or device model and a short description. The more detail you share, the faster we can help.
          </p>

          <form onSubmit={sendEmail} className="mt-10 space-y-6">
            <fieldset>
              <legend className="mb-3 text-[13px] font-semibold text-navy">Topic</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[13px] font-medium transition",
                      topic === t ? "border-gold bg-gold text-white" : "border-black/10 text-navy hover:border-gold"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">Your name</span>
                <input required value={form.name} onChange={set("name")} className={field} autoComplete="name" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">Phone</span>
                <input value={form.phone} onChange={set("phone")} className={field} inputMode="tel" autoComplete="tel" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">
                  Order number <span className="font-normal text-apple-muted">(optional)</span>
                </span>
                <input value={form.order} onChange={set("order")} className={field} placeholder="e.g. SG-20261012-4821" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-navy">Preferred store</span>
                <select value={form.store} onChange={set("store")} className={field}>
                  <option value="">Any store</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-navy">Message</span>
              <textarea required rows={5} value={form.message} onChange={set("message")} className={cn(field, "resize-none")} />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-gold inline-flex items-center gap-2">
                <Mail size={16} /> Send by email
              </button>
              <button
                type="button"
                onClick={sendTelegram}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-2.5 font-semibold text-navy transition hover:bg-apple-gray"
              >
                <Send size={16} /> Send on Telegram
              </button>
            </div>
            {notice && (
              <p role="status" className="flex items-center gap-2 text-[14px] text-emerald-700">
                <Check size={16} /> {notice}
              </p>
            )}
          </form>
        </div>

        <aside className="lg:pt-16">
          <div className="rounded-[28px] bg-apple-gray p-7">
            <h3 className="text-[18px] font-semibold text-navy">Prefer to talk?</h3>
            <p className="mt-1 text-[14px] text-apple-muted">Customer service is available 24/7.</p>
            <ul className="mt-5 divide-y divide-black/10">
              {channels.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 py-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy transition group-hover:bg-gold group-hover:text-white">
                      <c.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] text-apple-muted">{c.label}</span>
                      <span className="block truncate text-[15px] font-medium text-navy">{c.value}</span>
                    </span>
                    <span className="text-apple-muted transition group-hover:translate-x-1 group-hover:text-gold">›</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 px-2 text-[13px] leading-relaxed text-apple-muted">{settings.announcement}</p>
        </aside>
      </div>
    </section>
  );
}
