import type { Metadata } from "next";
import { MOCK_TERMS_CONTENT } from "@/lib/content/terms";
import { FileText } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms & Conditions | InfinityMind Tech",
  description: "Terms and Conditions for InfinityMind Tech.",
};

export default function TermsPage() {
  const content = MOCK_TERMS_CONTENT;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Legal Header */}
      <section className="pt-32 pb-16 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-200 text-slate-800 text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm border border-slate-300">
            Legal Document
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h1>
        </div>
      </section>

      {/* Main Legal Content Area */}
      <main className="py-20 bg-white flex-1">
        <article className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <section className="bg-slate-50 border border-slate-100 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <FileText size={32} className="text-slate-400" aria-hidden="true" />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              {content.description}
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
