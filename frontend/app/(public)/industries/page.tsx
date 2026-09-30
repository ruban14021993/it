import type { Metadata } from "next";
import { getIndustries } from "@/lib/api/public";
import { MOCK_HOME_DATA } from "@/lib/content/homepage";
import IndustriesGrid from "@/components/public/industries/IndustriesGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Industries | InfinityMind Tech",
  description: "Discover the industries empowered by InfinityMind Tech.",
};

export default async function IndustriesPage() {
  const items = await getIndustries();
  const industries = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-28 pb-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent opacity-60" aria-hidden="true" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Industries We Serve
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Industries
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the industries empowered by InfinityMind Tech.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {industries.length > 0 ? (
            <IndustriesGrid industries={industries} />
          ) : (
            <div className="text-center py-20 text-slate-500">Industries are currently being updated.</div>
          )}
        </div>
      </section>

      {MOCK_HOME_DATA.final_cta && (
        <FinalCTASection content={MOCK_HOME_DATA.final_cta} />
      )}
    </div>
  );
}
