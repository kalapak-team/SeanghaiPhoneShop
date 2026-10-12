"use client";

import { SpecSection } from "@/lib/productSpecs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ProductSpecs({ sections }: { sections: SpecSection[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-hidden rounded-3xl bg-apple-gray">
      {sections.map((section) => {
        const expanded = open[section.title] === true;
        return (
          <div key={section.title} className="border-b border-black/[0.06] last:border-0">
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [section.title]: !expanded }))}
              className="flex w-full items-center justify-between px-6 py-4 text-left md:px-8"
            >
              <span className="text-sm font-semibold tracking-[0.12em] text-gold">{section.title}</span>
              <ChevronDown size={18} className={`text-navy transition ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && (
              <dl className="px-6 pb-4 md:px-8">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-1 border-t border-black/[0.05] py-3 sm:grid-cols-[180px_1fr] sm:gap-8"
                  >
                    <dt className="text-sm font-semibold text-navy">{row.label}</dt>
                    <dd className="text-sm leading-relaxed text-[#424245]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        );
      })}
      <p className="px-6 py-4 text-xs text-apple-muted md:px-8">
        *We cannot guarantee that the information on this page is 100% correct.
      </p>
    </div>
  );
}
