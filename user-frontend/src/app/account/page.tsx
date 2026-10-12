"use client";

import { AccountAddresses } from "@/components/account/AccountAddresses";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountProfile } from "@/components/account/AccountProfile";
import { AccountSecurity } from "@/components/account/AccountSecurity";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "orders", label: "Orders" },
  { id: "profile", label: "Personal information" },
  { id: "addresses", label: "Addresses" },
  { id: "security", label: "Sign-in & security" },
  { id: "support", label: "Support" }
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function isSection(value: string): value is SectionId {
  return SECTIONS.some((s) => s.id === value);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<SectionId>("orders");

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1);
      if (isSection(hash)) setSection(hash);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = (id: SectionId) => {
    setSection(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const signOut = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-[40px] font-semibold tracking-tight text-navy">Account</h1>
        <p className="mt-3 text-[17px] text-apple-muted">Sign in to see your orders, addresses and personal information.</p>
        <div className="mt-8 flex items-center gap-6">
          <Link href="/login" className="inline-flex h-11 items-center rounded-full bg-gold px-7 text-sm font-medium text-white hover:bg-gold-dark">
            Sign in
          </Link>
          <Link href="/register" className="text-[15px] font-medium text-gold hover:underline">
            Create account ›
          </Link>
        </div>
      </main>
    );
  }

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1080px] px-6 py-12 md:py-16">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-[20px] font-semibold text-white">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <h1 className="text-[32px] font-semibold tracking-tight text-navy md:text-[40px]">Hi, {firstName}.</h1>
            <p className="truncate text-[15px] text-apple-muted">{user.email}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Account" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="-mx-6 flex gap-6 overflow-x-auto border-b border-black/10 px-6 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:border-b-0 lg:px-0">
              {SECTIONS.map((item) => (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={section === item.id ? "page" : undefined}
                    className={cn(
                      "w-full whitespace-nowrap border-b-2 py-3 text-left text-[14px] transition lg:rounded-lg lg:border-b-0 lg:px-3 lg:py-2",
                      section === item.id
                        ? "border-gold font-medium text-navy lg:bg-apple-gray"
                        : "border-transparent text-apple-muted hover:text-navy"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={signOut} className="mt-6 hidden px-3 text-[14px] text-apple-muted hover:text-navy lg:block">
              Sign out
            </button>
          </nav>

          <div key={section} className="min-w-0 animate-fade-up">
            {section === "orders" && <AccountOrders />}
            {section === "profile" && <AccountProfile user={user} />}
            {section === "addresses" && <AccountAddresses user={user} />}
            {section === "security" && <AccountSecurity user={user} onSignOut={signOut} />}
            {section === "support" && <SupportSection />}
          </div>
        </div>
      </div>
    </main>
  );
}

function SupportSection() {
  const rows = [
    { href: "/contact", title: "Contact Seanghai", detail: "Call, email or message us on Telegram" },
    { href: "/contact", title: "Find a store", detail: "Toul Tom Poung · Street 271 · Phsar Depo" },
    { href: "/secondhand", title: "Trade in & Pre-Owned", detail: "Certified pre-owned devices" },
    { href: "/cart", title: "Your bag", detail: "Review items before checkout" }
  ];
  return (
    <section>
      <h2 className="text-[28px] font-semibold tracking-tight text-navy">Support</h2>
      <p className="mt-1.5 text-[15px] text-apple-muted">Get help with an order, or visit us in person.</p>
      <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {rows.map((row) => (
          <li key={row.title}>
            <Link href={row.href} className="group flex items-center justify-between gap-4 py-5">
              <span>
                <span className="block text-[15px] text-navy group-hover:text-gold">{row.title}</span>
                <span className="mt-0.5 block text-[13px] text-apple-muted">{row.detail}</span>
              </span>
              <span className="text-[18px] text-apple-muted transition group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
