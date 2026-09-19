import type { Metadata } from "next";
import { Mail, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { MOCK_CAREERS_CONTENT } from "@/lib/content/careers";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers | InfinityMind Tech",
  description: "Explore career opportunities and professional development at InfinityMind Tech.",
};

export default function CareersPage() {
  const content = MOCK_CAREERS_CONTENT;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Careers Hero */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            {content.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            {content.heading}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>
      </section>

      {/* Career Information / Opportunities */}
      <section className="py-24 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Career Opportunities</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            Career opportunities are currently managed through the company’s official channels. 
            To explore current openings or submit your resume for future consideration, please reach out to our HR team.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail size={24} className="text-blue-600" aria-hidden="true" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">HR Department</div>
              <a href={`mailto:${content.email}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                {content.email}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Career Development Reference */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mx-auto mb-6">
            <GraduationCap size={32} className="text-emerald-600" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Career Development</h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Explore our training programs designed to foster career growth and technical excellence.
          </p>
          <Link
            href="/training"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Explore Training
            <ArrowRight size={16} className="ml-2" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTASection 
        content={{
          headline: "Get in Touch",
          description: "Reach out to InfinityMind Tech for inquiries or to explore our technology solutions.",
          primary_cta_text: "Contact Us",
          primary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
