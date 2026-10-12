"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function CatalogPagination({
  shown,
  totalElements,
  pagesLoaded
}: {
  shown: number;
  totalElements: number;
  pagesLoaded: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (totalElements === 0) return null;

  const percent = Math.min(100, Math.round((shown / totalElements) * 100));
  const hasMore = shown < totalElements;

  const loadMore = () => {
    const query = new URLSearchParams(params.toString());
    query.set("page", String(pagesLoaded + 1));
    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="mt-14 flex flex-col items-center">
      <p className="text-[13px] text-apple-muted">
        You&apos;ve viewed <span className="font-medium text-navy">{shown}</span> of {totalElements} products
      </p>
      <div
        className="mt-3 h-[3px] w-56 overflow-hidden rounded-full bg-black/10"
        role="progressbar"
        aria-valuenow={shown}
        aria-valuemin={0}
        aria-valuemax={totalElements}
        aria-label="Products viewed"
      >
        <div className="h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={pending}
          className="mt-6 inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-full border border-navy px-8 text-sm font-medium text-navy transition hover:bg-navy hover:text-white disabled:cursor-wait disabled:opacity-60"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? "Loading" : "Load more"}
        </button>
      )}
    </div>
  );
}
