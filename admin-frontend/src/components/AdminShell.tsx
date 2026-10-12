"use client";

import { cn } from "@/lib/format";
import {
  Bell,
  ChevronsUpDown,
  Image,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Package,
  PanelLeft,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

const GROUPS = [
  {
    label: "General",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/orders", label: "Orders", icon: ShoppingBag },
      { href: "/products", label: "Products", icon: Package },
      { href: "/banners", label: "Banners", icon: Image }
    ]
  },
  {
    label: "Catalog",
    items: [
      { href: "/brands", label: "Brands", icon: Tags },
      { href: "/categories", label: "Categories", icon: Layers }
    ]
  },
  {
    label: "Other",
    items: [
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/settings", label: "Settings", icon: Settings }
    ]
  }
];

const TOP_LINKS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/customers", label: "Customers" },
  { href: "/products", label: "Products" },
  { href: "/settings", label: "Settings" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LogoMark() {
  return (
    <svg width={32} height={32} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect width="64" height="64" rx="12" fill="#1d1d1f" />
      <path
        d="M42 21.2c-1.5-2.6-4.6-4.2-8.6-4.2-6.7 0-11.1 3.5-11.1 8.4 0 4.3 3.1 6.7 9.5 8.1l3.3.7c4.1.9 5.8 2.1 5.8 4.3 0 2.6-2.5 4.3-6.4 4.3-3.6 0-6.2-1.5-7.5-4.1l-.4-.8-5.6 2.1.3.7c2.1 4.7 7.1 7.5 13.3 7.5 7.6 0 12.6-4 12.6-9.6 0-4.5-3.2-7.1-9.8-8.5l-3.2-.7c-3.8-.8-5.4-2-5.4-4 0-2.4 2.2-4 5.7-4 3 0 5.2 1.3 6.3 3.6l.3.7 5.6-2.1-.3-.8Z"
        fill="#ffffff"
      />
      <circle cx="46.5" cy="17.5" r="4" fill="#0071e3" />
    </svg>
  );
}

function initials(name?: string) {
  if (!name) return "SA";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [admin, setAdmin] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/login" && !localStorage.getItem("sg_admin_token")) {
      router.replace("/login");
    }
    try {
      const saved = localStorage.getItem("sg_admin_user");
      if (saved) setAdmin(JSON.parse(saved));
    } catch {
      setAdmin(null);
    }
  }, [pathname, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname === "/login") return <>{children}</>;

  const signOut = () => {
    localStorage.removeItem("sg_admin_token");
    localStorage.removeItem("sg_admin_user");
    router.replace("/login");
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  const nav = (compact: boolean) => (
    <>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg border border-black/[0.08] px-2 py-1.5 text-left hover:bg-apple-gray"
      >
        <LogoMark />
        {!compact && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-navy">Seanghai Admin</p>
              <p className="truncate text-[11px] text-apple-muted">Phone Shop</p>
            </div>
            <ChevronsUpDown size={14} className="shrink-0 text-apple-muted" />
          </>
        )}
      </button>

      <nav className="mt-5 flex-1 space-y-5 overflow-y-auto" aria-label="Admin">
        {GROUPS.map((group) => (
          <div key={group.label}>
            {!compact && (
              <p className="px-2 pb-1 text-[11px] font-medium text-apple-muted">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition",
                        compact && "justify-center px-0",
                        active ? "bg-[#f4f4f5] font-medium text-navy" : "text-navy/70 hover:bg-[#f4f4f5] hover:text-navy"
                      )}
                    >
                      <item.icon size={16} strokeWidth={1.75} />
                      {!compact && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="relative mt-3 border-t border-black/[0.08] pt-3">
        <button
          type="button"
          onClick={() => setUserOpen((v) => !v)}
          className={cn("flex w-full items-center gap-2 rounded-lg px-1 py-1 hover:bg-[#f4f4f5]", compact && "justify-center")}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-[11px] font-semibold text-white">
            {initials(admin?.name)}
          </span>
          {!compact && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-medium text-navy">{admin?.name || "Admin"}</p>
                <p className="truncate text-[11px] text-apple-muted">{admin?.email || "admin@seanghaiphone.com"}</p>
              </div>
              <ChevronsUpDown size={14} className="text-apple-muted" />
            </>
          )}
        </button>
        {userOpen && (
          <div className="absolute bottom-12 left-0 z-50 w-full min-w-[200px] rounded-xl border border-black/[0.08] bg-white p-1 shadow-lg">
            <Link href="/settings" className="block rounded-lg px-3 py-2 text-[13px] hover:bg-[#f4f4f5]">
              Settings
            </Link>
            <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] hover:bg-[#f4f4f5]">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={cn("min-h-screen bg-white", collapsed ? "lg:grid-cols-[68px_minmax(0,1fr)]" : "lg:grid-cols-[255px_minmax(0,1fr)]", "lg:grid")}>
      <aside className="hidden h-screen flex-col border-r border-black/[0.08] bg-white p-3 lg:sticky lg:top-0 lg:flex">
        {nav(collapsed)}
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-black/[0.08] bg-white px-3 md:px-4">
          <button type="button" className="rounded-md p-2 text-navy hover:bg-[#f4f4f5] lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            <Menu size={18} />
          </button>
          <button type="button" className="hidden rounded-md p-2 text-navy hover:bg-[#f4f4f5] lg:inline-flex" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
            <PanelLeft size={18} />
          </button>
          <nav className="ml-1 hidden items-center gap-1 md:flex">
            {TOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px]",
                  isActive(pathname, link.href) ? "font-medium text-navy" : "text-apple-muted hover:text-navy"
                )}
              >
                {"icon" in link && link.icon ? <link.icon size={15} /> : null}
                {link.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={onSearch} className="relative ml-auto w-full max-w-[240px]">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-apple-muted" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-8 w-full rounded-md border border-black/10 bg-white pl-8 pr-10 text-[13px] outline-none focus:border-gold"
            />
            <kbd className="pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded border border-black/10 bg-[#f4f4f5] px-1.5 py-0.5 text-[10px] text-apple-muted sm:inline">
              ⌘K
            </kbd>
          </form>
          <Link href="/" className="rounded-md p-2 text-navy hover:bg-[#f4f4f5]" aria-label="Notifications">
            <Bell size={16} />
          </Link>
          <Link href="/settings" className="rounded-md p-2 text-navy hover:bg-[#f4f4f5]" aria-label="Settings">
            <Settings size={16} />
          </Link>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
            {initials(admin?.name)}
          </span>
        </header>

        {mobileOpen && <div className="flex max-h-[75vh] flex-col overflow-y-auto border-b border-black/10 p-3 lg:hidden">{nav(false)}</div>}
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
