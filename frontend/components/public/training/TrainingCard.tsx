import { CheckCircle2, GraduationCap } from "lucide-react";
import type { TrainingDetail } from "@/lib/types";

interface Props {
  program: TrainingDetail;
}

export default function TrainingCard({ program }: Props) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={24} className="text-emerald-600" aria-hidden="true" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3">{program.name}</h3>
      
      {program.short_description && (
        <p className="text-slate-600 mb-6 flex-1">
          {program.short_description}
        </p>
      )}

      {/* Verified Gains section */}
      {program.what_you_gain && program.what_you_gain.length > 0 && (
        <div className="mt-auto border-t border-slate-100 pt-6">
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">What You Gain</h4>
          <ul className="space-y-3">
            {program.what_you_gain.slice(0, 3).map((gain, i) => (
              <li key={i} className="flex items-start text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{gain}</span>
              </li>
            ))}
            {program.what_you_gain.length > 3 && (
              <li className="text-sm text-slate-500 italic ml-6">
                + {program.what_you_gain.length - 3} more benefits
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
