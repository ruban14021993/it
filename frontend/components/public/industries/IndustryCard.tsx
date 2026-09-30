import Link from "next/link";
import { 
  HeartPulse, Landmark, ShoppingBag, Factory, Radio, GraduationCap, 
  Building2, Zap, Hotel, Building, Car, Truck, ArrowRight
} from "lucide-react";
import type { IndustryListItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  industry: IndustryListItem;
  index?: number;
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

const COLOR_THEMES = [
  {
    bgCard: "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100",
    bgIcon: "bg-indigo-100 border-indigo-200 group-hover:bg-[#4f46e5]",
    textIcon: "text-[#4f46e5] group-hover:text-white",
    textTitle: "group-hover:text-[#4f46e5]",
  },
  {
    bgCard: "bg-rose-50/50 hover:bg-rose-50 border-rose-100",
    bgIcon: "bg-rose-100 border-rose-200 group-hover:bg-[#e11d48]",
    textIcon: "text-[#e11d48] group-hover:text-white",
    textTitle: "group-hover:text-[#e11d48]",
  },
  {
    bgCard: "bg-teal-50/50 hover:bg-teal-50 border-teal-100",
    bgIcon: "bg-teal-100 border-teal-200 group-hover:bg-[#0d9488]",
    textIcon: "text-[#0d9488] group-hover:text-white",
    textTitle: "group-hover:text-[#0d9488]",
  },
  {
    bgCard: "bg-fuchsia-50/50 hover:bg-fuchsia-50 border-fuchsia-100",
    bgIcon: "bg-fuchsia-100 border-fuchsia-200 group-hover:bg-[#c026d3]",
    textIcon: "text-[#c026d3] group-hover:text-white",
    textTitle: "group-hover:text-[#c026d3]",
  }
];

export default function IndustryCard({ industry, index = 0 }: Props) {
  const Icon = ICON_MAP[industry.slug] || Building;
  const theme = COLOR_THEMES[index % COLOR_THEMES.length];

  return (
    <Link href={`/industries/${industry.slug}`} className="block h-full group focus:outline-none">
      <div className={cn("flex flex-col p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full", theme.bgCard)}>
        <div className={cn("w-12 h-12 rounded-lg border flex items-center justify-center mb-5 transition-colors duration-300 flex-shrink-0", theme.bgIcon)}>
          <Icon size={22} className={cn("transition-colors duration-300", theme.textIcon)} aria-hidden="true" />
        </div>
        
        <h3 className={cn("font-bold text-lg text-slate-900 mb-2 transition-colors", theme.textTitle)}>
          {industry.name}
        </h3>
        
        {industry.short_description && (
          <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">
            {industry.short_description}
          </p>
        )}

        <div className={cn("mt-auto pt-2 flex items-center text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300", theme.textTitle)}>
          Explore Solutions <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
}
