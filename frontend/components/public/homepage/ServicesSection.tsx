import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceListItem } from "@/lib/types";
import ServiceCard from "@/components/public/services/ServiceCard";

interface ServicesSectionProps {
  services: ServiceListItem[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm border border-blue-200">
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Comprehensive Technology Services
          </h2>
          <p className="text-lg text-slate-600">
            End-to-end consulting, development, and support to help your organization navigate the digital landscape.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-lg"
          >
            View All Services
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Link>
        </div>
        
      </div>
    </section>
  );
}
