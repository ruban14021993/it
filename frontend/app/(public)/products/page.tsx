import type { Metadata } from "next";
import { getProducts } from "@/lib/api/public";
import { MOCK_HOME_DATA } from "@/lib/content/homepage";
import ProductsGrid from "@/components/public/products/ProductsGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0; // Disable static rendering if the backend might be down. Wait, we want to fail gracefully if backend is down during build.

export const metadata: Metadata = {
  title: "Products & Solutions | InfinityMind Tech",
  description: "Explore the products and solutions offered by InfinityMind Tech.",
};

export default async function ProductsPage() {
  const products = await getProducts(); // Returns empty array if fails, safe for build.

  return (
    <div className="min-h-screen flex flex-col">
      {/* Products Hero */}
      <section className="pt-28 pb-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        {/* Subtle decorative background matching design system */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Our Products
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Products & Solutions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the products and solutions offered by InfinityMind Tech.
          </p>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <div className="text-center py-20 text-slate-500">Products are currently being updated.</div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      {MOCK_HOME_DATA.final_cta && (
        <FinalCTASection content={MOCK_HOME_DATA.final_cta} />
      )}
    </div>
  );
}
