import type { Metadata } from "next";
import { MOCK_HELP_CENTER_CONTENT } from "@/lib/content/help";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";
import { LifeBuoy } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Help Center | InfinityMind Tech",
  description: "Find information and assistance from InfinityMind Tech.",
};

export default function HelpCenterPage() {
  const content = MOCK_HELP_CENTER_CONTENT;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Help Center Hero */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            How Can We Help?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find information and assistance from InfinityMind Tech.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 bg-white flex-1 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <LifeBuoy size={40} className="text-slate-400" aria-hidden="true" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            {content.title}
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100 inline-block">
            {content.description}
          </p>

        </div>
      </section>

      {/* Final CTA */}
      <FinalCTASection 
        content={{
          headline: "Need Assistance?",
          description: "Get in touch with InfinityMind Tech to discuss your requirements.",
          primary_cta_text: "Contact Us",
          primary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
