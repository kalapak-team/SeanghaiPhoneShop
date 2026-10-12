"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { ProductCard as ProductCardType } from "@/lib/types";
import Link from "next/link";

export function ProductCard({ product }: { product: ProductCardType }) {
  const { add } = useCart();
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const lowStock = product.stock > 0 && product.stock <= 15;

  return (
    <article className="group flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden">
        {onSale && (
          <span className="absolute left-0 top-0 z-10 rounded-full bg-[#ff3b30] px-2.5 py-0.5 text-[11px] font-medium text-white">
            Sale
          </span>
        )}
        <div className="flex h-64 items-center justify-center sm:h-72">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition duration-700 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col text-left">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#86868b]">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-3 min-h-[4.5rem] text-[17px] font-semibold leading-snug text-[#1d1d1f] hover:opacity-70"
        >
          {product.name}
        </Link>

        <div className="mt-2 min-h-[1.25rem]">
          {lowStock && (
            <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#e85d04]">
              <span className="h-2 w-2 rounded-full bg-[#e85d04]" />
              Only {product.stock} left
            </p>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {onSale && (
            <span className="text-sm text-[#86868b] line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
          <span className="text-[18px] font-medium text-[#1d1d1f]">{formatPrice(product.price)}</span>
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={() => add(product)}
            className="flex w-full items-center justify-center rounded-xl border border-[#1d1d1f] py-3 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#1d1d1f] hover:text-white"
          >
            + CART
          </button>
        </div>
      </div>
    </article>
  );
}
