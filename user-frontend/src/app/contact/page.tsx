import { SupportExperience } from "@/components/support/SupportExperience";
import { api, safeHome } from "@/lib/api";
import { FALLBACK_SETTINGS, type Store } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Seanghai Phone Shop",
  description:
    "Get help from Seanghai Phone Shop by phone, Telegram, Facebook, email, or in store — orders, delivery, warranty, setup, and device advice in Khmer and English, 24/7."
};

export default async function ContactPage() {
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

  return <SupportExperience settings={settings} stores={stores} facts={{ stores: stores.length || 3, products }} />;
}
