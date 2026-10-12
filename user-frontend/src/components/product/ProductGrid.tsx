import { ProductCard } from "@/components/product/ProductCard";
import { ProductCard as ProductCardType } from "@/lib/types";

export function ProductGrid({ products }: { products: ProductCardType[] }) {
  if (!products?.length) {
    return <p className="py-16 text-center text-slate-500">No products found.</p>;
  }
  return (
    <div className="grid grid-cols-2 items-stretch gap-5 md:grid-cols-5">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index % 40, 24) * 45}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
