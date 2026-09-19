import type { ServiceListItem } from "@/lib/types";
import ServiceCard from "@/components/public/services/ServiceCard";

interface ServicesGridProps {
  services: ServiceListItem[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">No services are currently available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
