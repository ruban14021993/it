import { cn } from "@/lib/utils";

interface AdminStatusBadgeProps {
  status: "Published" | "Draft" | "New" | "Read" | "Replied" | "Closed" | string;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  const variants: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-700 border-emerald-200",
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    new: "bg-blue-100 text-blue-700 border-blue-200",
    read: "bg-slate-100 text-slate-700 border-slate-200",
    replied: "bg-purple-100 text-purple-700 border-purple-200",
    closed: "bg-gray-100 text-gray-700 border-gray-200",
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactive: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const currentVariant = variants[normalized] || variants.draft;

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", currentVariant)}>
      {status}
    </span>
  );
}
