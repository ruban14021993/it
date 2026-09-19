import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeroSection as HeroSectionType } from "@/lib/types";

interface HeroSectionProps {
  hero: HeroSectionType;
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-slate-50 overflow-hidden pt-16">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start max-w-2xl">
            {hero.eyebrow && (
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-blue-200">
                {hero.eyebrow}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              {hero.heading}
            </h1>
            
            {hero.description && (
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
                {hero.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {hero.primary_cta_text && (
                <Link
                  href={hero.primary_cta_url || "/products"}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 shadow-lg shadow-blue-600/20 group"
                >
                  {hero.primary_cta_text}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {hero.secondary_cta_text && (
                <Link
                  href={hero.secondary_cta_url || "/services"}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 shadow-sm"
                >
                  {hero.secondary_cta_text}
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Abstract Technology Visual */}
          <div className="relative hidden lg:block h-[500px] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Abstract decorative elements */}
              <div className="relative w-full h-full max-w-md mx-auto">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl animate-pulse delay-700" />
                
                {/* CSS Grid graphic */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="p-8 grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
                    <div className="bg-slate-100 rounded-lg h-full" />
                    <div className="flex flex-col gap-4">
                      <div className="bg-blue-50 rounded-lg h-1/2 flex items-center justify-center border border-blue-100">
                         <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 opacity-80" />
                      </div>
                      <div className="bg-emerald-50 rounded-lg h-1/2 border border-emerald-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0a82bd 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </section>
  );
}
