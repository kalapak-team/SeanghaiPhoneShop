import { CatalogPage } from "@/components/catalog/CatalogPage";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ featured?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  return (
    <CatalogPage
      title="ALL"
      accent="PRODUCTS"
      subtitle="Browse the latest phones, tablets, watches and accessories"
      query={{ featured: params.featured, q: params.q, page: params.page }}
    />
  );
}
