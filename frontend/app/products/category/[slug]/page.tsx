import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { MOCK_ALL_PRODUCTS } from "@/lib/content/products";
import ProductsGrid from "@/components/public/products/ProductsGrid";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productWithCategory = MOCK_ALL_PRODUCTS.find((p) => p.category?.slug === slug);
  const categoryName = productWithCategory?.category?.name || "Category";

  if (!productWithCategory) {
    return { title: "Category Not Found | InfinityMind Tech" };
  }

  return {
    title: `${categoryName} Products | InfinityMind Tech`,
    description: `Explore our innovative software solutions and products in the ${categoryName} category.`,
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Filter products by category slug
  const categoryProducts = MOCK_ALL_PRODUCTS.filter((p) => p.category?.slug === slug);

  // If no products match the category slug, we assume the category does not exist
  if (categoryProducts.length === 0) {
    notFound();
  }

  const categoryName = categoryProducts[0].category?.name || "Category";
  const productCount = categoryProducts.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Category Header */}
      <section className="pt-32 pb-16 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <ChevronRight size={14} className="mx-1" aria-hidden="true" />
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-600 transition-colors">Solutions</Link>
              </li>
              <li>
                <ChevronRight size={14} className="mx-1" aria-hidden="true" />
              </li>
              <li aria-current="page" className="text-slate-900 font-medium truncate">
                {categoryName}
              </li>
            </ol>
          </nav>

          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm border border-slate-300">
            Product Category
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-slate-600">
            Showing {productCount} {productCount === 1 ? "product" : "products"}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <ProductsGrid products={categoryProducts} />
          
          <div className="mt-16 text-center">
            <Link 
              href="/products" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
              Back to all solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
