import { AboutExperience } from "@/components/about/AboutExperience";
import { api, safeHome } from "@/lib/api";
import { FALLBACK_SETTINGS, type Store } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Seanghai | Seanghai Phone Shop",
  description:
    "Seanghai Phone Shop: more than ten years selling genuine smartphones, tablets, watches, computers, and accessories in Phnom Penh, with written warranty, free delivery over $140, and support in Khmer and English."
};

export default async function AboutPage() {
  const home = await safeHome();
  const settings = home?.settings || FALLBACK_SETTINGS;

  let stores: Store[] = home?.stores || [];
  if (!stores.length) {
    stores = await api.stores().catch(() => []);
  }

  const products = await api
    .products({ size: 1 })
    .then((page) => page.totalElements)
    .catch(() => 1000);

  const facts = {
    products,
    brands: home?.brands.length || 15,
    stores: stores.length || 3
  };

  return <AboutExperience settings={settings} stores={stores} facts={facts} />;
}
