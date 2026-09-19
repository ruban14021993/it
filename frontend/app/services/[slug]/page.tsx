import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { ServiceDetail, ServiceListItem } from "@/lib/types";

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const services = await apiFetch<ServiceListItem[]>("/services");
    return services.map((s) => ({ slug: s.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const s = await apiFetch<ServiceDetail>(`/services/${slug}`);
    return { title: s.meta_title || s.name, description: s.meta_description || s.short_description || undefined };
  } catch { return { title: "Service Not Found" }; }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  let service: ServiceDetail;
  try {
    service = await apiFetch<ServiceDetail>(`/services/${slug}`, { tags: [`service-${slug}`] });
  } catch { notFound(); }

  return (
    <div className="min-h-screen">
      <section className="gradient-bg py-20 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">{service.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
          {service.short_description && (
            <p className="text-lg text-blue-100">{service.short_description}</p>
          )}
        </div>
      </section>

      {service.description && (
        <section className="py-14 container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: service.description }} />
        </section>
      )}

      {service.features && (service.features as unknown[]).length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {(service.features as Array<{ title: string; description?: string } | string>).map((f, i) => (
                <div key={i} className="flex gap-3 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">{typeof f === "string" ? f : f.title}</h4>
                    {typeof f !== "string" && f.description && (
                      <p className="text-sm text-gray-500 mt-1">{f.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 gradient-bg text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Need {service.name}?</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">Contact our team to discuss how we can help your business.</p>
        <Link href="/contact" className="inline-block px-10 py-3 rounded-full font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors">
          Get In Touch
        </Link>
      </section>
    </div>
  );
}
