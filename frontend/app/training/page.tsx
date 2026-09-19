import type { Metadata } from "next";
import { MOCK_TRAINING_PROGRAMS } from "@/lib/content/training";
import TrainingGrid from "@/components/public/training/TrainingGrid";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Career Development | InfinityMind Tech",
  description: "Explore the Career Development and Training area of InfinityMind Tech.",
};

export default function TrainingPage() {
  const programs = [...MOCK_TRAINING_PROGRAMS].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Training Hero */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Career Development
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Training & Career Development
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore the Career Development and Training area of InfinityMind Tech.
          </p>
        </div>
      </section>

      {/* Training Grid Section */}
      <section className="py-24 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Training Programs</h2>
            <p className="text-lg text-slate-600">
              Our training programs are designed for Final Year Students, Recent Graduates, and anyone passionate about learning.
            </p>
          </div>
          <TrainingGrid programs={programs} />
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTASection 
        content={{
          headline: "Learn More About Career Development",
          description: "Contact our team to inquire about training opportunities and professional growth.",
          primary_cta_text: "Contact Us",
          primary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
