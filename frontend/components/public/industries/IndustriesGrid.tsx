import type { IndustryListItem } from "@/lib/types";
import IndustryCard from "@/components/public/industries/IndustryCard";

interface IndustriesGridProps {
  industries: IndustryListItem[];
}

export default function IndustriesGrid({ industries }: IndustriesGridProps) {
  if (!industries || industries.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">No industries are currently available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {industries.map((industry) => (
        <IndustryCard key={industry.id} industry={industry} />
      ))}
    </div>
  );
}
