import Link from "next/link";
import { ArrowRight, Building, User } from "lucide-react";
import type { AboutPreviewContent } from "@/lib/types";

interface AboutPreviewSectionProps {
  content?: AboutPreviewContent | null;
}

export default function AboutPreviewSection({ content }: AboutPreviewSectionProps) {
  if (!content) return null;

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 skew-x-12 translate-x-1/4 -z-10" aria-hidden="true" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Text & Content */}
          <div className="flex-1 max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
              {content.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              {content.heading}
            </h2>
            {content.description && (
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {content.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              {content.established_year && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Building size={18} className="text-slate-700" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Established</div>
                    <div className="text-sm text-slate-600">{content.established_year}</div>
                  </div>
                </div>
              )}
              
              {content.founder_name && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User size={18} className="text-slate-700" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{content.founder_name}</div>
                    <div className="text-sm text-slate-600">{content.founder_title}</div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={content.cta_url}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-lg"
            >
              {content.cta_text}
              <ArrowRight size={18} className="ml-2" aria-hidden="true" />
            </Link>
          </div>

          {/* Right Column: Visual Treatment */}
          <div className="flex-1 w-full lg:w-auto relative" aria-hidden="true">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square max-w-lg mx-auto lg:ml-auto w-full">
              {/* CSS Abstract Composition */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl transform rotate-3 scale-105 opacity-50 transition-transform duration-700 hover:rotate-6" />
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden transition-transform duration-700 hover:-translate-y-2">
                
                {/* Abstract inner design */}
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start opacity-20">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-400" />
                    <div className="w-24 h-4 rounded-full bg-slate-400" />
                  </div>
                  
                  <div className="space-y-4 opacity-30">
                    <div className="w-3/4 h-6 rounded-full bg-slate-600" />
                    <div className="w-1/2 h-6 rounded-full bg-slate-400" />
                    <div className="w-5/6 h-6 rounded-full bg-slate-300" />
                  </div>
                  
                  <div className="flex justify-end opacity-20">
                    <div className="w-32 h-32 rounded-tl-full bg-slate-500 -mr-8 -mb-8" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
