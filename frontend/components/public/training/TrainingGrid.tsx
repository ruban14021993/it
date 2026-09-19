import type { TrainingDetail } from "@/lib/types";
import TrainingCard from "@/components/public/training/TrainingCard";

interface Props {
  programs: TrainingDetail[];
}

export default function TrainingGrid({ programs }: Props) {
  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">Training programs are currently being updated.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {programs.map((program) => (
        <TrainingCard key={program.id} program={program} />
      ))}
    </div>
  );
}
