import { Brain, Smartphone, BarChart, Megaphone, ShoppingCart, Network, Link as LinkIcon, Briefcase } from "lucide-react";
import type { ServiceListItem } from "@/lib/types";
import { truncate } from "@/lib/utils";

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

interface Props {
  service: ServiceListItem;
}

export default function ServiceCard({ service }: Props) {
  const Icon = (service.icon && ICON_MAP[service.icon]) ? ICON_MAP[service.icon] : Briefcase;

  return (
    <div className="group flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
      <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
        <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
      </div>
      
      <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {service.name}
      </h3>
      
      {service.short_description && (
        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
          {truncate(service.short_description, 80)}
        </p>
      )}
    </div>
  );
}
