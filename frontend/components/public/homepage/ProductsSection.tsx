import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductListItem } from "@/lib/types";
import ProductCard from "@/components/public/products/ProductCard";

interface ProductsSectionProps {
  products: ProductListItem[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm border border-emerald-200">
            Products & Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Innovative Software for Modern Business
          </h2>
          <p className="text-lg text-slate-600">
            Discover our comprehensive suite of intelligent solutions designed to streamline operations and drive growth.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-lg"
          >
            View All Solutions
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
        
      </div>
    </section>
  );
}
