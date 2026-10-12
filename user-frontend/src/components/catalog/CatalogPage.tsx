import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { Reveal } from "@/components/home/Reveal";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { api } from "@/lib/api";
import { ProductCard } from "@/lib/types";
import { Suspense } from "react";

const PAGE_SIZE = 40;

export async function CatalogPage({
  title,
  accent,
  subtitle,
  query
}: {
  title: string;
  accent: string;
  subtitle?: string;
  query: Record<string, string | number | undefined>;
}) {
  const pagesLoaded = Math.min(50, Math.max(1, Math.floor(Number(query.page)) || 1));
  let products: ProductCard[] = [];
  let totalElements = 0;
  try {
    const data = await api.products({ ...query, page: 0, size: PAGE_SIZE * pagesLoaded });
    products = data.content;
    totalElements = data.totalElements;
  } catch {
    products = [];
  }
  return (
    <main className="container-xl py-10">
      <Reveal>
        <SectionHeader title={title} accent={accent} subtitle={subtitle} />
        <ProductGrid products={products} />
        <Suspense>
          <CatalogPagination shown={products.length} totalElements={totalElements} pagesLoaded={pagesLoaded} />
        </Suspense>
      </Reveal>
    </main>
  );
}
