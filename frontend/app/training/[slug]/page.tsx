import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { TrainingDetail, TrainingListItem } from "@/lib/types";

export const revalidate = 3600;

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const programs = await apiFetch<TrainingListItem[]>("/training");
    return programs.map((p) => ({ slug: p.slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await apiFetch<TrainingDetail>(`/training/${slug}`);
    return { title: p.meta_title || p.name, description: p.meta_description || p.short_description || undefined };
  } catch { return { title: "Training Program Not Found" }; }
}

export default async function TrainingDetailPage({ params }: Props) {
  const { slug } = await params;
  let program: TrainingDetail;
  try {
    program = await apiFetch<TrainingDetail>(`/training/${slug}`, { tags: [`training-${slug}`] });
  } catch { notFound(); }

  return (
    <div className="min-h-screen">
      <section className="gradient-bg py-20 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/training" className="hover:text-white">Training</Link>
            <ChevronRight size={14} />
            <span className="text-white">{program.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.name}</h1>
          {program.duration && (
            <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Duration: {program.duration}
            </span>
          )}
          {program.short_description && (
            <p className="text-lg text-blue-100">{program.short_description}</p>
          )}
        </div>
      </section>

      {program.description && (
        <section className="py-14 container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: program.description }} />
        </section>
      )}

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Who Can Apply */}
          {program.who_can_apply.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Who Can Apply</h3>
              <ul className="space-y-2">
                {program.who_can_apply.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Features */}
          {program.features.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">What You Will Learn</h3>
              <ul className="space-y-2">
                {program.features.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* What You Gain */}
          {program.what_you_gain.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">What You&apos;ll Gain</h3>
              <ul className="space-y-2">
                {program.what_you_gain.map((item, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <section className="py-16 gradient-bg text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-blue-100 mb-8 max-w-lg mx-auto">
          Enrol in the {program.name} program and kickstart your tech career.
        </p>
        <Link href="/contact" className="inline-block px-10 py-3 rounded-full font-semibold bg-white text-blue-700 hover:bg-blue-50 transition-colors">
          Apply Now
        </Link>
      </section>
    </div>
  );
}
