import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
    variant?: "primary" | "secondary" | "outline";
  };
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  const ActionIcon = action?.icon;
  
  const actionClasses = cn(
    "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm",
    {
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600": action?.variant === "primary" || !action?.variant,
      "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-800": action?.variant === "secondary",
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400": action?.variant === "outline",
    }
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      
      {action && (
        <div>
          {action.href ? (
            <Link href={action.href} className={actionClasses}>
              {ActionIcon && <ActionIcon size={16} className="mr-2" />}
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className={actionClasses}>
              {ActionIcon && <ActionIcon size={16} className="mr-2" />}
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
