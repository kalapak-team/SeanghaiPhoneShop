"use client";

import { Logo } from "@/components/Logo";
import { isNavActive, NAV_LINKS, QUICK_LINKS } from "@/components/layout/nav";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/format";
import { ArrowRight, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, menuOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const toggleMenu = () => {
    setSearchOpen(false);
    setMenuOpen((v) => !v);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center px-4">
          <button
            type="button"
            className="flex h-14 w-11 items-center justify-center text-white/80 lg:hidden"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center lg:flex-none lg:justify-start">
            <Logo light compact />
          </div>

          <nav
            className={cn(
              "hidden flex-1 items-center justify-center gap-5 px-3 text-[12px] tracking-tight xl:gap-7 xl:px-5 xl:text-[13px] lg:flex",
              searchOpen && "pointer-events-none invisible"
            )}
            aria-label="Global"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isNavActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap transition-colors hover:text-white",
                  isNavActive(pathname, link.href) ? "text-white" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              className="flex h-14 w-11 items-center justify-center text-white/80 transition hover:text-white"
              onClick={() => (searchOpen ? setSearchOpen(false) : openSearch())}
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={18} strokeWidth={1.75} /> : <Search size={18} strokeWidth={1.75} />}
            </button>
            <Link
              href={user ? "/account" : "/login"}
              className="flex h-14 w-11 items-center justify-center text-white/80 transition hover:text-white"
              aria-label={user ? "Account" : "Sign in"}
            >
              <UserRound size={18} strokeWidth={1.75} />
            </Link>
            <Link
              href="/cart"
              className="relative flex h-14 w-11 items-center justify-center text-white/80 transition hover:text-white"
              aria-label={count > 0 ? `Bag, ${count} items` : "Bag"}
            >
              <ShoppingBag size={18} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute right-1.5 top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold leading-none text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="animate-search-panel border-t border-white/10 bg-[#1d1d1f]">
            <div className="mx-auto max-w-[680px] px-6 pb-10 pt-7">
              <form onSubmit={onSearch} role="search" className="flex items-center gap-3">
                <Search size={22} className="shrink-0 text-white/35" strokeWidth={1.75} />
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Seanghai"
                  aria-label="Search Seanghai"
                  className="w-full bg-transparent text-[28px] font-semibold leading-tight text-white outline-none placeholder:font-normal placeholder:text-white/35"
                />
              </form>
              <p className="mt-8 text-[12px] text-white/40">Quick Links</p>
              <ul className="mt-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 py-1.5 text-[14px] text-white/80 transition hover:text-white"
                    >
                      <ArrowRight size={14} className="text-white/35" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="animate-search-panel border-t border-white/10 bg-black lg:hidden" aria-label="Menu">
            <nav className="px-8 pb-8 pt-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-[28px] font-semibold tracking-tight text-white/90"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="mt-4 block py-2 text-[17px] text-white/70"
              >
                {user ? "Account" : "Sign in"}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {(searchOpen || menuOpen) && (
        <button
          type="button"
          aria-label="Close"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => {
            setSearchOpen(false);
            setMenuOpen(false);
          }}
        />
      )}
    </>
  );
}
