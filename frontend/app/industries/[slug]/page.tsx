import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { IndustryDetail, IndustryListItem } from "@/lib/types";
import ProductCard from "@/components/public/products/ProductCard";

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const industries = await apiFetch<IndustryListItem[]>("/industries");
    return industries.map((i) => ({ slug: i.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const i = await apiFetch<IndustryDetail>(`/industries/${slug}`);
    return { title: i.meta_title || i.name, description: i.meta_description || i.short_description || undefined };
  } catch { return { title: "Industry Not Found" }; }
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  let industry: IndustryDetail;
  try {
    industry = await apiFetch<IndustryDetail>(`/industries/${slug}`, { tags: [`industry-${slug}`] });
  } catch { notFound(); }

  return (
    <div className="min-h-screen">
      <section className="gradient-bg py-20 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/industries" className="hover:text-white">Industries</Link>
            <ChevronRight size={14} />
            <span className="text-white">{industry.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{industry.name}</h1>
          {industry.short_description && (
            <p className="text-lg text-blue-100">{industry.short_description}</p>
          )}
        </div>
      </section>

      {industry.description && (
        <section className="py-14 container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: industry.description }} />
        </section>
      )}

      {industry.related_products.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Solutions for {industry.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.related_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 gradient-bg text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Serving the {industry.name} Sector</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">Let us help you build smarter technology solutions for your industry.</p>
        <Link href="/contact" className="inline-block px-10 py-3 rounded-full font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors">
          Contact Us
        </Link>
      </section>
    </div>
  );
}
