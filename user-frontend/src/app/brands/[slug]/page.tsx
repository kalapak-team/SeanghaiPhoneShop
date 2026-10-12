import { CatalogPage } from "@/components/catalog/CatalogPage";

export default async function BrandPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  return (
    <CatalogPage
      title={slug.replace("-", " ").toUpperCase()}
      accent="PRODUCTS"
      subtitle="Most popular products recommended to you"
      query={{ brand: slug, page }}
    />
  );
}
