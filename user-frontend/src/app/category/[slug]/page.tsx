import { CatalogPage } from "@/components/catalog/CatalogPage";

export default async function CategoryPage({
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
      query={{ category: slug, page }}
    />
  );
}
