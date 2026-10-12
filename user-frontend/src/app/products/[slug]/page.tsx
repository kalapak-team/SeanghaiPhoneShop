"use client";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductRow } from "@/components/product/ProductRow";
import { ProductTabs } from "@/components/product/ProductTabs";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { useCart } from "@/context/CartContext";
import { api, safeSettings } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { buildProductSpecs, cashBack, digitsOnly, showPhonePerks } from "@/lib/productSpecs";
import { FALLBACK_SETTINGS, ProductCard, ProductDetail, Settings } from "@/lib/types";
import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const { add } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductCard[]>([]);
  const [settings, setSettings] = useState<Settings>(FALLBACK_SETTINGS);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setError("");
    setProduct(null);
    setQty(1);
    api.product(params.slug).then(setProduct).catch((e) => setError(e.message));
    safeSettings().then(setSettings);
  }, [params.slug]);

  useEffect(() => {
    if (!product) return;
    api
      .products({ category: product.category?.slug, size: 10 })
      .then((data) => setRelated(data.content.filter((item) => item.id !== product.id).slice(0, 10)))
      .catch(() => setRelated([]));
  }, [product]);

  const specs = useMemo(() => (product ? buildProductSpecs(product) : []), [product]);

  if (error) return <main className="container-xl py-16 text-center">{error}</main>;
  if (!product) return <main className="container-xl py-16 text-center text-apple-muted">Loading...</main>;

  const image = product.images?.[0];
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const saved = cashBack(product);
  const perks = showPhonePerks(product);
  const tel = digitsOnly(settings.khmerPhone);
  const wa = digitsOnly(settings.englishPhone) || tel;
  const title = saved > 0 ? `${product.name} (OFF: $${saved})` : product.name;
  const addToCart = () =>
    add({ id: product.id, name: product.name, slug: product.slug, price: Number(product.price), image }, qty);

  return (
    <main className="pb-24 lg:pb-16">
      <div className="container-xl py-6">
        <nav className="text-[13px] text-apple-muted">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span> / </span>
          <Link href="/products" className="hover:text-gold">Shop</Link>
          {product.category && (
            <>
              <span> / </span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-gold">
                {product.category.name}
              </Link>
            </>
          )}
          {product.brand && (
            <>
              <span> / </span>
              <Link href={`/brands/${product.brand.slug}`} className="hover:text-gold">
                {product.brand.name}
              </Link>
            </>
          )}
          <span> / </span>
          <span className="text-navy">{product.name}</span>
        </nav>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <ProductGallery images={product.images || []} name={product.name} />
          </div>

          <div className="min-w-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <p className="text-sm text-apple-muted">
              {product.brand?.name} · {product.category?.name}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy md:text-[34px]">{title}</h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-semibold text-navy">{formatPrice(product.price)}</span>
              {onSale && <span className="text-lg text-apple-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
              {saved > 0 && <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-sm font-medium text-gold">Save ${saved}</span>}
            </div>

            {product.storage && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-apple-muted">Storage</p>
                <span className="inline-flex rounded-full border border-navy px-4 py-1.5 text-sm">{product.storage}</span>
              </div>
            )}
            {product.color && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-apple-muted">Color</p>
                <span className="inline-flex rounded-full border border-navy px-4 py-1.5 text-sm">{product.color}</span>
              </div>
            )}

            <ul className="mt-6 space-y-1.5 text-sm text-[#424245]">
              {product.warranty && <li>• {product.warranty}</li>}
              {perks && <li>• Free Case, Screen Protector & Adaptor</li>}
              {product.condition === "SECONDHAND" && (
                <li>• Secondhand{product.conditionPercent ? ` · ${product.conditionPercent}% condition` : ""}</li>
              )}
              <li>• {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</li>
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-black/10">
                <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                  −
                </button>
                <span className="min-w-8 text-center text-sm font-medium">{qty}</span>
                <button type="button" className="px-3 py-2 text-lg" onClick={() => setQty((n) => Math.min(product.stock || 99, n + 1))}>
                  +
                </button>
              </div>
              <button className="btn-gold px-8" disabled={product.stock <= 0} onClick={addToCart}>
                {product.stock > 0 ? "Add to cart" : "Out of stock"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {settings.telegramUrl && (
                <a href={settings.telegramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-gold hover:underline">
                  <Send size={14} /> Telegram
                </a>
              )}
              {wa && (
                <a
                  href={`https://wa.me/${wa.startsWith("855") ? wa : `855${wa.replace(/^0/, "")}`}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold hover:underline"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
              {tel && (
                <a href={`tel:${tel}`} className="inline-flex items-center gap-1.5 text-gold hover:underline">
                  <Phone size={14} /> Call
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <ProductTabs product={product} sections={specs} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-xl mt-6 animate-fade-up" style={{ animationDelay: "280ms" }}>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-navy">Related products</h2>
          <ProductRow products={related} />
        </section>
      )}

      <StickyBuyBar name={product.name} price={Number(product.price)} disabled={product.stock <= 0} onAdd={addToCart} />
    </main>
  );
}
