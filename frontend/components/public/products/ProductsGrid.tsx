import type { ProductListItem } from "@/lib/types";
import ProductCard from "@/components/public/products/ProductCard";

interface ProductsGridProps {
  products: ProductListItem[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">No products are currently available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
