"use client";

import { formatPrice } from "@/lib/format";

export function StickyBuyBar({
  name,
  price,
  disabled,
  onAdd
}: {
  name: string;
  price: number;
  disabled?: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="container-xl flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-navy">{name}</p>
          <p className="text-base font-semibold text-gold">{formatPrice(price)}</p>
        </div>
        <button className="btn-gold shrink-0" disabled={disabled} onClick={onAdd}>
          {disabled ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
