import { Logo } from "@/components/Logo";
import { PaymentBadges } from "@/components/layout/PaymentBadges";
import { Settings, Store } from "@/lib/types";
import { Facebook, Megaphone, Send } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const shopLinks = [
  { href: "/category/smartphone", label: "Smartphone" },
  { href: "/category/tablet", label: "Tablet" },
  { href: "/category/watch", label: "Watch" },
  { href: "/category/computer", label: "Computer" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/secondhand", label: "Pre-Owned" },
  { href: "/brands", label: "Brands" }
];

function tel(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-navy transition hover:bg-white"
    >
      {children}
    </a>
  );
}

export function Footer({ settings, stores }: { settings: Settings; stores: Store[] }) {
  return (
    <footer className="border-t border-black/10 bg-apple-gray text-navy">
      <div className="container-xl py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.35fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-apple-muted">{settings.about}</p>
            <div className="mt-5 flex gap-2">
              <SocialLink href={settings.facebookUrl} label="Messenger">
                <Facebook size={16} />
              </SocialLink>
              <SocialLink href={settings.telegramUrl} label="Telegram">
                <Send size={15} />
              </SocialLink>
              <SocialLink href={settings.telegramChannelUrl} label="Telegram channel">
                <Megaphone size={15} />
              </SocialLink>
            </div>
          </div>

          <div>
            <h2 className="text-[13px] font-semibold">Shop</h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-apple-muted">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-navy">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-semibold">Support</h2>
            <ul className="mt-4 space-y-2.5 text-[13px] text-apple-muted">
              <li>
                <Link href="/about" className="transition hover:text-navy">
                  About Seanghai
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-navy">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition hover:text-navy">
                  Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-navy">
                  Cart
                </Link>
              </li>
              <li>
                <a href={`tel:${tel(settings.khmerPhone)}`} className="transition hover:text-navy">
                  KH {settings.khmerPhone}
                </a>
              </li>
              <li>
                <a href={`tel:${tel(settings.englishPhone)}`} className="transition hover:text-navy">
                  EN {settings.englishPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="break-all transition hover:text-navy">
                  {settings.email}
                </a>
              </li>
            </ul>
            {settings.freeDeliveryNote && (
              <p className="mt-4 text-[13px] leading-relaxed text-apple-muted">{settings.freeDeliveryNote}</p>
            )}
          </div>

          <div>
            <h2 className="text-[13px] font-semibold">Stores</h2>
            <ul className="mt-4 space-y-5">
              {stores.map((store) => (
                <li key={store.id}>
                  <p className="text-[13px] font-medium">{store.name}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-apple-muted">{store.addressEn || store.addressKh}</p>
                  {store.phones && <p className="mt-1 text-[13px] text-apple-muted">{store.phones}</p>}
                  {store.facebookUrl && (
                    <a href={store.facebookUrl} className="mt-1 inline-block text-[13px] text-apple-muted transition hover:text-navy" target="_blank" rel="noreferrer">
                      Facebook
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-apple-muted">Payment methods</span>
          <PaymentBadges className="sm:justify-end" />
        </div>

        <div className="mt-6 border-t border-black/10 pt-5 text-[12px] text-apple-muted">
          <p>© {new Date().getFullYear()} Seanghai Phone Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
