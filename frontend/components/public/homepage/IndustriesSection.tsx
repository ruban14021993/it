import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IndustryListItem } from "@/lib/types";
import IndustryCard from "@/components/public/industries/IndustryCard";

interface IndustriesSectionProps {
  industries: IndustryListItem[];
}

export default function IndustriesSection({ industries }: IndustriesSectionProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold tracking-wide uppercase mb-4 shadow-sm border border-slate-200">
            Industries
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Solutions Across Industries
          </h2>
          <p className="text-lg text-slate-600">
            InfinityMind Tech partners with diverse sectors to deliver specialized software and technology solutions.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 shadow-sm"
          >
            Explore All Industries
            <ArrowRight size={18} className="ml-2" aria-hidden="true" />
          </Link>
        </div>
        
      </div>
    </section>
  );
}
