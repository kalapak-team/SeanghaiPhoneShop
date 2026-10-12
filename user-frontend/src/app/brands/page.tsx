import { BrandLogo } from "@/components/home/BrandLogo";
import { Reveal } from "@/components/home/Reveal";
import Link from "next/link";

export default async function BrandsPage() {
  let brands: { id: number; name: string; slug: string }[] = [];
  try {
    brands = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/brands`, { cache: "no-store" }).then((r) => r.json());
  } catch {
    brands = [];
  }
  return (
    <main className="container-xl py-10">
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-apple-muted">Shop by brand</p>
        <h1 className="mt-1 mb-10 text-3xl font-semibold tracking-tight text-navy">
          All <em className="not-italic text-gold">Brands</em>
        </h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              title={brand.name}
              className="flex min-h-[140px] items-center justify-center rounded-2xl border border-black/[0.06] px-4 text-navy/60 transition hover:border-transparent hover:bg-apple-gray hover:text-navy"
            >
              <BrandLogo slug={brand.slug} name={brand.name} />
            </Link>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
