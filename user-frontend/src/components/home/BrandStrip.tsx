import { BrandLogo } from "@/components/home/BrandLogo";
import { Brand } from "@/lib/types";
import Link from "next/link";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands?.length) return null;

  return (
    <section className="border-y border-black/[0.06] bg-white">
      <div className="container-xl py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-apple-muted">Shop by brand</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-navy">Choose your brand</h2>
          </div>
          <Link href="/brands" className="text-sm font-medium text-gold hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              title={brand.name}
              className="flex h-20 items-center justify-center rounded-2xl px-4 text-navy/50 transition duration-300 hover:bg-apple-gray hover:text-navy"
            >
              <BrandLogo slug={brand.slug} name={brand.name} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
