import { CatalogPage } from "@/components/catalog/CatalogPage";

export default async function SecondhandPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return (
    <div className="bg-apple-gray">
      <CatalogPage
        title="SECONDHAND"
        accent="PRODUCTS"
        subtitle="Find products affordable price, for those who want quality with the best prices"
        query={{ condition: "SECONDHAND", page }}
      />
    </div>
  );
}
