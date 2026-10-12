"use client";

import { cn } from "@/lib/format";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function pagesAround(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => set.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize?: (size: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const btn = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-black/10 text-navy disabled:opacity-40 hover:bg-[#f4f4f5]";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 px-4 py-3 text-[13px] text-apple-muted">
      <p>
        {from}–{to} of {total.toLocaleString()}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {onPageSize && (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSize(Number(e.target.value))}
              className="h-8 rounded-md border border-black/10 bg-white px-2 text-navy outline-none"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <p>
          Page {current} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button type="button" className={btn} disabled={current <= 1} onClick={() => onPage(1)} aria-label="First page">
            <ChevronsLeft size={15} />
          </button>
          <button type="button" className={btn} disabled={current <= 1} onClick={() => onPage(current - 1)} aria-label="Previous page">
            <ChevronLeft size={15} />
          </button>
          {pagesAround(current, totalPages).map((item, i) =>
            item === "…" ? (
              <span key={`e${i}`} className="px-1">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPage(item)}
                className={cn(btn, item === current && "bg-navy text-white border-navy hover:bg-navy")}
              >
                {item}
              </button>
            )
          )}
          <button type="button" className={btn} disabled={current >= totalPages} onClick={() => onPage(current + 1)} aria-label="Next page">
            <ChevronRight size={15} />
          </button>
          <button type="button" className={btn} disabled={current >= totalPages} onClick={() => onPage(totalPages)} aria-label="Last page">
            <ChevronsRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
