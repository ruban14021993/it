import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { ProductDetail, ProductListResponse } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const data = await apiFetch<ProductListResponse>("/products?limit=100");
    return data.data.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await apiFetch<ProductDetail>(`/products/${slug}`);
    return {
      title: product.meta_title || product.name,
      description: product.meta_description || product.short_description || undefined,
      openGraph: product.og_image
        ? { images: [mediaUrl(product.og_image.storage_path)] }
        : undefined,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: ProductDetail;
  try {
    product = await apiFetch<ProductDetail>(`/products/${slug}`, {
      tags: [`product-${slug}`],
    });
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 gradient-bg text-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-white">Products</Link>
            <ChevronRight size={14} />
            <span className="text-white">{product.name}</span>
          </nav>
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2">
              {product.category && (
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
              {product.short_description && (
                <p className="text-lg text-blue-100 leading-relaxed">{product.short_description}</p>
              )}
              <div className="flex gap-4 mt-6">
                {product.cta_text && (
                  <Link
                    href={product.cta_url || "/contact"}
                    className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                  >
                    {product.cta_text}
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="px-6 py-2.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            {product.hero_image && (
              <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={mediaUrl(product.hero_image.storage_path)}
                  alt={product.hero_image.alt_text || product.name}
                  width={600}
                  height={380}
                  className="w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      {product.description && (
        <section className="py-14 container mx-auto px-4 lg:px-8 max-w-3xl">
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(product.features as Array<{ title: string; description?: string }>).map((feature, i) => (
                <div key={i} className="flex gap-3 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title || String(feature)}</h4>
                    {feature.description && (
                      <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modules */}
      {product.modules && product.modules.length > 0 && (
        <section className="py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Product Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.modules.map((mod) => (
                <div key={mod.id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">{mod.name}</h4>
                  {mod.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">{mod.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {(product.benefits as Array<{ title: string }>).map((b, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{b.title || String(b)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 gradient-bg text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Interested in {product.name}?</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          Reach out to our team to learn more or schedule a demo.
        </p>
        <Link
          href="/contact"
          className="inline-block px-10 py-3 rounded-full font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
