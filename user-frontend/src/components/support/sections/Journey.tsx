"use client";

import { CUTOUT, HERO, clamp, easeOut, lerp, r2, range, shot, usePinProgress, useReducedMotion } from "@/components/about/motion";
import { FillText } from "@/components/support/fx";
import { cn } from "@/lib/format";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FLOW = [
  { title: "You reach out", body: "Call, message, or visit. Share your order number or device model.", x: 80, y: 360 },
  { title: "We confirm", body: "A team member checks your order, purchase date, and warranty.", x: 290, y: 180 },
  { title: "We diagnose", body: "Many issues are solved on the spot with a setting or update.", x: 500, y: 360 },
  { title: "We resolve", body: "Repair, replacement, or a clear explanation — before any cost.", x: 710, y: 180 },
  { title: "We follow up", body: "We check everything works, and the case stays on record.", x: 920, y: 360 }
];

const VB = { w: 1000, h: 560 };
const FLOW_PATH = FLOW.slice(1).reduce((d, n, i) => {
  const a = FLOW[i];
  const mid = (a.x + n.x) / 2;
  return `${d} C${mid},${a.y} ${mid},${n.y} ${n.x},${n.y}`;
}, `M${FLOW[0].x},${FLOW[0].y}`);

/** A path draws itself through each step as you scroll, lighting nodes on arrival (Framer “Line Connections”). */
export function RequestFlow() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const prog = reduced ? 1 : clamp(range(p, 0.08, 0.88));
  const path = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState({ x: FLOW[0].x, y: FLOW[0].y });

  useEffect(() => {
    const el = path.current;
    if (!el) return;
    const pt = el.getPointAtLength(prog * el.getTotalLength());
    setDot({ x: r2(pt.x), y: r2(pt.y) });
  }, [prog]);

  return (
    <section ref={ref} className="relative z-10 h-[260vh] bg-white">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden">
        <div className="container-xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">How support works</p>
          <FillText text="Where your request goes next." className="mt-4 text-[34px] font-semibold tracking-[-0.03em] md:text-[56px]" />

          <div className="relative mx-auto mt-6 hidden aspect-[1000/560] w-full max-w-[min(100%,calc(62vh*1000/560))] lg:block">
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${VB.w} ${VB.h}`} aria-hidden>
              <path d={FLOW_PATH} fill="none" stroke="rgba(29,29,31,0.12)" strokeWidth="2" strokeDasharray="6 8" />
              <path
                ref={path}
                d={FLOW_PATH}
                fill="none"
                stroke="url(#sup-flow)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={r2(1 - prog)}
              />
              <defs>
                <linearGradient id="sup-flow" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#0071e3" />
                  <stop offset="100%" stopColor="#2997ff" />
                </linearGradient>
              </defs>
            </svg>

            <span
              className="absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_8px_rgba(0,113,227,0.18),0_0_30px_rgba(0,113,227,0.6)]"
              style={{ left: `${r2((dot.x / VB.w) * 100)}%`, top: `${r2((dot.y / VB.h) * 100)}%` }}
            />

            {FLOW.map((n, i) => {
              const on = prog >= i / (FLOW.length - 1) - 0.01;
              const high = n.y < 300;
              return (
                <div key={n.title} className="absolute" style={{ left: `${(n.x / VB.w) * 100}%`, top: `${(n.y / VB.h) * 100}%` }}>
                  <span
                    className={cn(
                      "absolute left-0 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[13px] font-semibold transition-all duration-500",
                      on ? "scale-110 border-gold bg-gold text-white" : "border-black/10 bg-white text-apple-muted"
                    )}
                  >
                    {on ? <Check size={18} /> : `0${i + 1}`}
                  </span>
                  <div
                    className={cn(
                      "absolute left-0 w-[210px] -translate-x-1/2 rounded-2xl p-4 text-center transition-all duration-500",
                      high ? "bottom-8" : "top-8",
                      on ? "bg-apple-gray opacity-100" : "translate-y-2 opacity-40"
                    )}
                  >
                    <p className="text-[16px] font-semibold text-navy">{n.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-apple-muted">{n.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <ol className="mt-10 space-y-4 lg:hidden">
            {FLOW.map((n, i) => (
              <li key={n.title} className="flex gap-4 rounded-2xl bg-apple-gray p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-[13px] font-semibold text-white">0{i + 1}</span>
                <span>
                  <span className="block text-[16px] font-semibold text-navy">{n.title}</span>
                  <span className="mt-1 block text-[14px] text-apple-muted">{n.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const STAGES = [
  {
    kicker: "Before you buy",
    title: "Advice, without the pressure.",
    body: "Call to check stock and prices, ask which model fits your budget, or come in and hold devices side by side. We’ll tell you when the cheaper option is the better choice.",
    points: ["Stock checks by phone", "Honest comparisons", "Try devices in hand"],
    bg: "bg-white",
    text: "text-navy",
    muted: "text-apple-muted",
    media: <div className="flex h-full items-center justify-center rounded-[36px] bg-apple-gray"><img src={shot("galaxy-s26-ultra.jpg")} alt="" className="h-[78%] object-contain mix-blend-multiply" /></div>
  },
  {
    kicker: "On the day",
    title: "Checked, set up, and ready.",
    body: "We verify the box, serial number, and IMEI with you, explain the warranty terms, and help you sign in and move your data — so you leave with a phone that’s ready to use.",
    points: ["Box and IMEI verified", "Warranty explained", "Data transfer"],
    bg: "bg-gold",
    text: "text-white",
    muted: "text-white/75",
    media: <div className="flex h-full items-center justify-center"><img src={CUTOUT.phone} alt="" className="h-[88%] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.35)]" /></div>
  },
  {
    kicker: "After the sale",
    title: "Still here next month, and next year.",
    body: "A setting you can’t find, a warranty claim, or the right charger — contact the same team any time. Your purchase is on record, so you never start from zero.",
    points: ["24/7 customer service", "Purchase on record", "Warranty handled in store"],
    bg: "bg-navy",
    text: "text-white",
    muted: "text-white/60",
    media: <img src={HERO.used} alt="" className="h-full w-full rounded-[36px] object-cover" />
  }
];

/** Each new chapter grows out of a circle on top of the last (Framer “Unmask Sections on Scroll”). */
export function CircleUnmask() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const windows = [null, [0.1, 0.42], [0.55, 0.87]] as const;

  return (
    <section ref={ref} className="relative z-10 h-[320vh]">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        {STAGES.map((st, i) => {
          const w = windows[i];
          const t = !w || reduced ? 1 : easeOut(range(p, w[0], w[1]));
          const radius = r2(lerp(0, 115, t));
          return (
            <div
              key={st.kicker}
              className={cn("absolute inset-0 flex items-center", st.bg, st.text)}
              style={{ clipPath: w ? `circle(${radius}% at 78% 50%)` : undefined, zIndex: i }}
            >
              <div className="container-xl grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]" style={{ transform: `scale(${r2(lerp(0.94, 1, t))})` }}>
                <div>
                  <p className={cn("font-mono text-[13px] font-semibold uppercase tracking-[0.16em]", st.muted)}>
                    {i + 1} / 3 · {st.kicker}
                  </p>
                  <h2 className="mt-4 max-w-[15ch] text-[38px] font-semibold leading-[1.04] tracking-[-0.03em] md:text-[62px]">{st.title}</h2>
                  <p className={cn("mt-6 max-w-xl text-[17px] leading-relaxed md:text-[19px]", st.muted)}>{st.body}</p>
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {st.points.map((pt) => (
                      <li key={pt} className="rounded-full border border-current/20 px-4 py-1.5 text-[13px] font-medium">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden h-[62vh] lg:block">{st.media}</div>
              </div>
            </div>
          );
        })}
        {!reduced && (
          <span
            aria-hidden
            className="absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold"
            style={{ left: "78%", top: "50%", opacity: p < 0.1 || (p > 0.45 && p < 0.55) ? 1 : 0 }}
          />
        )}
      </div>
    </section>
  );
}

const FACES = [
  { title: "Warranty checks", body: "Bring the device and receipt. We inspect it and explain what’s covered before any cost.", img: shot("iphone-16-pro.jpg"), points: ["Written terms", "Inspection in store"] },
  { title: "Setup and transfer", body: "Sign-in, contacts, photos, and chats moved from your old phone while you wait.", img: shot("galaxy-z-fold.jpg"), points: ["iPhone and Android", "Done in store"] },
  { title: "Delivery and pickup", body: "Free delivery over $140 in Phnom Penh, or collect from the store you choose.", img: shot("apple-watch.jpg"), points: ["Rider calls ahead", "Pickup at any store"] },
  { title: "Accessories that fit", body: "Cases, protectors, and chargers matched to your exact model — no guesswork.", img: shot("clear-magsafe-case.jpg"), points: ["Model-matched", "Certified chargers"] }
];

/** A cube turns face by face as you scroll (Framer “Rotating 3D Showcase”). */
export function ServiceCube() {
  const { ref, p } = usePinProgress();
  const reduced = useReducedMotion();
  const s = reduced ? 0 : clamp(range(p, 0.08, 0.92)) * (FACES.length - 1);
  const seg = Math.min(Math.floor(s), FACES.length - 2);
  const f = s - seg;
  const eased = f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
  const angle = r2(-(seg + eased) * 90);
  const active = Math.round(seg + eased);

  return (
    <section ref={ref} className="relative z-10 h-[280vh] bg-black text-white">
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_68%_55%,rgba(0,113,227,0.28),transparent_70%)]" />
        <div className="container-xl relative grid h-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2997ff]">What we help with</p>
            <FillText dark text="Four sides of good service." className="mt-4 max-w-[13ch] text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]" />
            <div className="relative mt-10 h-[190px]">
              {FACES.map((face, i) => (
                <div
                  key={face.title}
                  className="absolute inset-0 transition-all duration-500"
                  style={{ opacity: active === i ? 1 : 0, transform: `translateY(${active === i ? 0 : active > i ? -16 : 16}px)` }}
                  aria-hidden={active !== i}
                >
                  <p className="font-mono text-[13px] text-white/40">0{i + 1} / 0{FACES.length}</p>
                  <h3 className="mt-2 text-[28px] font-semibold">{face.title}</h3>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/60">{face.body}</p>
                  <ul className="mt-5 flex gap-2">
                    {face.points.map((pt) => (
                      <li key={pt} className="rounded-full bg-white/10 px-3 py-1 text-[12px]">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center [--half:150px] [perspective:1400px] md:[--half:190px]">
            <div className="sup-3d relative h-[calc(var(--half)*2)] w-[calc(var(--half)*2)]" style={{ transform: `translateZ(calc(var(--half) * -1)) rotateX(-12deg) rotateY(${angle}deg)` }}>
              {FACES.map((face, i) => (
                <div
                  key={face.title}
                  className="sup-face flex flex-col items-center justify-between rounded-[28px] border border-black/5 bg-white p-6 text-navy"
                  style={{ transform: `rotateY(${i * 90}deg) translateZ(var(--half))` }}
                >
                  <span className="self-start font-mono text-[12px] text-apple-muted">0{i + 1}</span>
                  <img src={face.img} alt="" className="h-[62%] object-contain" />
                  <span className="text-[18px] font-semibold">{face.title}</span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-[-12%] h-10 w-[60%] rounded-[50%] bg-[#2997ff]/30 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
