import { 
  HeartPulse, Landmark, ShoppingBag, Factory, Radio, GraduationCap, 
  Building2, Zap, Hotel, Building, Car, Truck
} from "lucide-react";
import type { IndustryListItem } from "@/lib/types";

interface Props {
  industry: IndustryListItem;
}

const ICON_MAP: Record<string, React.ElementType> = {
  "healthcare": HeartPulse,
  "banking-finance": Landmark,
  "e-commerce": ShoppingBag,
  "manufacturing": Factory,
  "telecommunication": Radio,
  "education": GraduationCap,
  "public-services": Building2,
  "energy": Zap,
  "hospitality": Hotel,
  "real-estate": Building,
  "autonomous-vehicle": Car,
  "logistics": Truck,
};

export default function IndustryCard({ industry }: Props) {
  const Icon = ICON_MAP[industry.slug] || Building;

  return (
    <div className="group flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
      <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors duration-300 flex-shrink-0">
        <Icon size={22} className="text-emerald-600 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
      </div>
      
      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {industry.name}
      </h3>
      
      {industry.short_description && (
        <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">
          {industry.short_description}
        </p>
      )}
    </div>
  );
}
