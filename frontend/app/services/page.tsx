import type { Metadata } from "next";
import { MOCK_ALL_SERVICES } from "@/lib/content/services";
import ServicesGrid from "@/components/public/services/ServicesGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Technology Services | InfinityMind Tech",
  description: "Explore the technology services offered by InfinityMind Tech, including mobile app development, consulting, data analytics, digital marketing, e-commerce, AI, network services, and blockchain.",
};

export default function ServicesPage() {
  const services = [...MOCK_ALL_SERVICES].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Services Hero */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        {/* Subtle decorative background matching design system */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Technology Services
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the technology services offered by InfinityMind Tech.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <ServicesGrid services={services} />
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTASection 
        content={{
          headline: "Let’s Discuss Your Technology Requirements",
          description: "Get in touch with InfinityMind Tech to discuss how our services can support your business.",
          primary_cta_text: "Contact Us",
          primary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
