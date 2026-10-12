export const NAV_LINKS = [
  { href: "/products", label: "Store" },
  { href: "/brands", label: "Brands" },
  { href: "/category/smartphone", label: "Smartphone" },
  { href: "/category/tablet", label: "Tablet" },
  { href: "/category/watch", label: "Watch" },
  { href: "/category/computer", label: "Computer" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/secondhand", label: "Pre-Owned" },
  { href: "/contact", label: "Support" },
  { href: "/about", label: "About Seanghai" }
] as const;

export const QUICK_LINKS = [
  { href: "/contact", label: "Find a Store" },
  { href: "/products?featured=true", label: "Featured products" },
  { href: "/category/smartphone", label: "Smartphone" },
  { href: "/secondhand", label: "Pre-Owned" },
  { href: "/brands/apple", label: "Apple" },
  { href: "/brands/samsung", label: "Samsung" },
  { href: "/about", label: "About Seanghai" }
] as const;

export function isNavActive(pathname: string, href: string) {
  if (href === "/products") return pathname === "/products";
  const path = href.split("?")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}
