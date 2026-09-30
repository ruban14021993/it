import type { Metadata } from "next";
import { getServices } from "@/lib/api/public";
import ServicesGrid from "@/components/public/services/ServicesGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Services | InfinityMind Tech",
  description: "Explore the professional services offered by InfinityMind Tech.",
};

export default async function ServicesPage() {
  const items = await getServices();
  const services = [...items].sort((a, b) => a.display_order - b.display_order);

  // Still providing a fallback final CTA object because homepage isn't fully dynamic yet
  const final_cta = {
    headline: "Ready to Transform Your Business?",
    description: "Get in touch with us to explore how our services can help you achieve your goals.",
    primary_cta_text: "Contact Us Today",
    primary_cta_url: "/contact"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-28 pb-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent opacity-60" aria-hidden="true" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Services
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the professional services offered by InfinityMind Tech.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {services.length > 0 ? (
            <ServicesGrid services={services} />
          ) : (
             <div className="text-center py-20 text-slate-500">Services are currently being updated.</div>
          )}
        </div>
      </section>

      <FinalCTASection content={final_cta} />
    </div>
  );
}


