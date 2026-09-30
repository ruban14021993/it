import type { Metadata } from "next";
import { Building2, UserCircle2, GraduationCap } from "lucide-react";
import { getAbout } from "@/lib/api/public";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | InfinityMind Tech",
  description: "Learn about InfinityMind Tech Pvt. Ltd.",
};

export default async function AboutPage() {
  const content = await getAbout();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="pt-32 pb-24 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm border border-slate-300">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            About InfinityMind Tech
          </h1>
          {content && (
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {content.company_name} was established in {content.founded_year}.
            </p>
          )}
        </div>
      </section>

      <section className="py-24 bg-white flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {content ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
              
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 size={24} className="text-blue-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Company Overview</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Company Name</h3>
                    <p className="text-xl font-medium text-slate-900">{content.company_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Established</h3>
                    <p className="text-xl font-medium text-slate-900">{content.founded_year}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <UserCircle2 size={24} className="text-emerald-600" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Leadership</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</h3>
                    <p className="text-xl font-medium text-slate-900">{content.founder_name}</p>
                  </div>
                  
                  {content.founder_title && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</h3>
                      <p className="text-lg text-slate-700">{content.founder_title}</p>
                    </div>
                  )}

                  {content.founder_title && content.founder_title.includes(',') && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Qualifications</h3>
                      <div className="flex items-center gap-2 text-lg text-slate-700">
                        <GraduationCap size={18} className="text-slate-400" aria-hidden="true" />
                        {content.founder_title.split(',').slice(1).join(',').trim()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              About information is currently unavailable.
            </div>
          )}
        </div>
      </section>

      <FinalCTASection 
        content={{
          headline: "Let's Discuss Your Technology Requirements",
          description: "Get in touch with InfinityMind Tech to explore our full range of solutions.",
          primary_cta_text: "Contact Us",
          primary_cta_url: "/contact",
        }} 
      />
    </div>
  );
}
