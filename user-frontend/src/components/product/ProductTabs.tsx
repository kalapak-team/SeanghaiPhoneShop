"use client";

import { ProductSpecs } from "@/components/product/ProductSpecs";
import { SpecSection } from "@/lib/productSpecs";
import { ProductDetail } from "@/lib/types";
import { useState } from "react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specifications" },
  { id: "shipping", label: "Shipping & Warranty" }
] as const;

export function ProductTabs({
  product,
  sections
}: {
  product: ProductDetail;
  sections: SpecSection[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");

  return (
    <section className="mt-14">
      <div className="flex gap-8 border-b border-black/10">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium tracking-wide ${
              tab === item.id ? "border-navy text-navy" : "border-transparent text-apple-muted hover:text-navy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {tab === "overview" && (
          <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-[#424245]">
            <p>{product.description || `${product.name} is available at Seanghai Phone Shop with genuine warranty and in-store support.`}</p>
            {product.storage && <p>Storage / memory: {product.storage}</p>}
            {product.color && <p>Color: {product.color}</p>}
            {product.warranty && <p>Warranty: {product.warranty}</p>}
          </div>
        )}
        {tab === "specs" && <ProductSpecs sections={sections} />}
        {tab === "shipping" && (
          <div className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-[#424245]">
            <p>Free delivery for orders over $140 across Phnom Penh.</p>
            <p>Pickup available at Toul Tom Poung, Street 271, and Phsar Depo.</p>
            <p>{product.warranty || "Official store warranty included."}</p>
            <p>Need help? Call or chat with our team before you buy.</p>
          </div>
        )}
      </div>
    </section>
  );
}
