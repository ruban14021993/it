import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import type { FinalCTAContent } from "@/lib/types";

interface FinalCTASectionProps {
  content?: FinalCTAContent | null;
}

export default function FinalCTASection({ content }: FinalCTASectionProps) {
  if (!content) return null;

  return (
    <section className="relative py-24 lg:py-32 bg-slate-900 overflow-hidden" aria-labelledby="final-cta-heading">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent" />
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 id="final-cta-heading" className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {content.headline}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href={content.primary_cta_url}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg"
            >
              <Mail size={18} className="mr-2" aria-hidden="true" />
              {content.primary_cta_text}
            </Link>
            
            {content.secondary_cta_text && content.secondary_cta_url && (
              <Link
                href={content.secondary_cta_url}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent border-2 border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {content.secondary_cta_text}
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
