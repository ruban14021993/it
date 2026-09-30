import type { Metadata } from "next";
import { getTrainingPrograms } from "@/lib/api/public";
import TrainingGrid from "@/components/public/training/TrainingGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Training Programs | InfinityMind Tech",
  description: "Explore our comprehensive training and certification programs.",
};

export default async function TrainingPage() {
  const items = await getTrainingPrograms();
  const programs = [...items].sort((a, b) => a.display_order - b.display_order);

  const final_cta = {
    headline: "Ready to Upgrade Your Skills?",
    description: "Join our training programs and take the next step in your career.",
    primary_cta_text: "Contact Us Today",
    primary_cta_url: "/contact"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-28 pb-10 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent opacity-60" aria-hidden="true" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Training & Certification
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Training Programs
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive training and certification programs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          {programs.length > 0 ? (
            <TrainingGrid programs={programs} />
          ) : (
            <div className="text-center py-20 text-slate-500">Training programs are currently being updated.</div>
          )}
        </div>
      </section>

      <FinalCTASection content={final_cta} />
    </div>
  );
}
