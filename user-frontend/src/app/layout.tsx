import { PageEnter } from "@/components/home/PageEnter";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { api, safeSettings } from "@/lib/api";
import type { Store } from "@/lib/types";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seanghai Phone Shop | Top Leading Phone Shop in Cambodia",
  description: "Buy smartphones, tablets, watches, computers and accessories at Seanghai Phone Shop.",
  icons: {
    icon: "/brand/logo-mark.jpg",
    apple: "/brand/logo-mark.jpg"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await safeSettings();
  let stores: Store[] = [];
  try {
    stores = await api.stores();
  } catch {
    stores = [];
  }
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <PageEnter>{children}</PageEnter>
          <Footer settings={settings} stores={stores} />
        </Providers>
      </body>
    </html>
  );
}
