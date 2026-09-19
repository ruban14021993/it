import type { Metadata } from "next";
import { MOCK_ALL_INDUSTRIES } from "@/lib/content/industries";
import IndustriesGrid from "@/components/public/industries/IndustriesGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Industries | InfinityMind Tech",
  description: "Explore the industries represented across InfinityMind Tech’s technology solutions and services.",
};

export default function IndustriesPage() {
  const industries = [...MOCK_ALL_INDUSTRIES].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Industries Hero */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        {/* Subtle decorative background matching design system */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Industries
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Industries We Serve
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the industries represented across InfinityMind Tech’s solutions and services.
          </p>
        </div>
      </section>

      {/* Industries Grid Section */}
      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <IndustriesGrid industries={industries} />
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTASection 
        content={{
          headline: "Explore Our Technology Services",
          description: "Discover how InfinityMind Tech can deliver value and innovation to your business operations.",
          primary_cta_text: "Explore Services",
          primary_cta_url: "/services",
          secondary_cta_text: "Contact Us",
          secondary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
