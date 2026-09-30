import Link from "next/link";
import { Brain, Smartphone, BarChart, Megaphone, ShoppingCart, Network, Link as LinkIcon, Briefcase, ArrowRight } from "lucide-react";
import type { ServiceListItem } from "@/lib/types";
import { truncate, cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Smartphone,
  BarChart,
  Megaphone,
  ShoppingCart,
  Network,
  Link: LinkIcon,
  Briefcase,
  Linkedin: LinkIcon,
};

const COLOR_THEMES = [
  {
    bgCard: "bg-blue-50/50 hover:bg-blue-50 border-blue-100",
    bgIcon: "bg-blue-100 border-blue-200 group-hover:bg-[#0a82bd]",
    textIcon: "text-[#0a82bd] group-hover:text-white",
    textTitle: "group-hover:text-[#0a82bd]",
  },
  {
    bgCard: "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100",
    bgIcon: "bg-emerald-100 border-emerald-200 group-hover:bg-[#00a56f]",
    textIcon: "text-[#00a56f] group-hover:text-white",
    textTitle: "group-hover:text-[#00a56f]",
  },
  {
    bgCard: "bg-amber-50/50 hover:bg-amber-50 border-amber-100",
    bgIcon: "bg-amber-100 border-amber-200 group-hover:bg-[#f5b041]",
    textIcon: "text-[#f5b041] group-hover:text-white",
    textTitle: "group-hover:text-[#f5b041]",
  },
  {
    bgCard: "bg-orange-50/50 hover:bg-orange-50 border-orange-100",
    bgIcon: "bg-orange-100 border-orange-200 group-hover:bg-[#e74c3c]",
    textIcon: "text-[#e74c3c] group-hover:text-white",
    textTitle: "group-hover:text-[#e74c3c]",
  }
];

interface Props {
  service: ServiceListItem;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: Props) {
  const Icon = (service.icon && ICON_MAP[service.icon]) ? ICON_MAP[service.icon] : Briefcase;
  const theme = COLOR_THEMES[index % COLOR_THEMES.length];

  return (
    <Link href={`/services/${service.slug}`} className="block h-full group focus:outline-none">
      <div className={cn("flex flex-col p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full", theme.bgCard)}>
        <div className={cn("w-14 h-14 rounded-xl border flex items-center justify-center mb-6 transition-colors duration-300 flex-shrink-0", theme.bgIcon)}>
          <Icon size={24} className={cn("transition-colors duration-300", theme.textIcon)} aria-hidden="true" />
        </div>
        
        <h3 className={cn("font-bold text-lg text-slate-900 mb-3 transition-colors", theme.textTitle)}>
          {service.name}
        </h3>
        
        {service.short_description && (
          <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-2">
            {truncate(service.short_description, 80)}
          </p>
        )}
        
        <div className={cn("mt-auto pt-2 flex items-center text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300", theme.textTitle)}>
          Read more <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
}

