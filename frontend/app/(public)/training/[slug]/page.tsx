import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle, ChevronRight, Image as ImageIcon, 
  ArrowRight, Sparkles, Zap, ShieldCheck, 
  Layers, Rocket, Clock, GraduationCap, Award
} from "lucide-react";
import { getTrainingProgram } from "@/lib/api/public";
import { mediaUrl } from "@/lib/utils";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const program = await getTrainingProgram(slug);
    if (!program) return { title: "Training Not Found" };
    return {
      title: `${program.name} Training`,
    };
  } catch {
    return { title: "Training Not Found" };
  }
}

export default async function TrainingDetailPage({ params }: Props) {
  const { slug } = await params;

  let program: any;
  try {
    program = await getTrainingProgram(slug);
  } catch {
    notFound();
  }
  
  if (!program || !program.id) {
    notFound();
  }

  const features = program.features && program.features.length > 0 ? program.features : [];
  const whoCanApply = program.who_can_apply && program.who_can_apply.length > 0 ? program.who_can_apply : [];
  const whatYouGain = program.what_you_gain && program.what_you_gain.length > 0 ? program.what_you_gain : [];

  return (
    <div className="min-h-screen bg-[#0a0f1c] selection:bg-rose-500/30">
      
      {/* 1. HERO SECTION (GLASSMORPHISM & GLOW) */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[120px] -translate-y-1/2 opacity-70 animate-pulse mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[100px] translate-y-1/3 opacity-60 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/training" className="hover:text-white transition-colors">Training</Link>
            <ChevronRight size={14} />
            <span className="text-rose-400">{program.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl">
                <Sparkles size={16} className="text-rose-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                  Professional Training Program
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                {program.name}
              </h1>
              
              {program.short_description && (
                <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-xl font-light">
                  {program.short_description}
                </p>
              )}

              {program.duration && (
                <div className="flex items-center gap-3 mb-10 text-white/90 bg-white/10 px-5 py-3 rounded-xl border border-white/10 w-fit backdrop-blur-sm">
                  <Clock size={20} className="text-rose-400" />
                  <span className="font-semibold text-lg">Duration: <span className="font-bold">{program.duration}</span></span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={program.cta_url || "/contact"}
                  className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden flex items-center gap-3"
                >
                  <span className="relative z-10">{program.cta_text || "Enroll Now"}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                {features.length > 0 && (
                  <a href="#curriculum" className="px-8 py-4 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/5 transition-colors backdrop-blur-sm">
                    View Curriculum
                  </a>
                )}
              </div>
            </div>
            
            {/* Right Hero Image (Glassmorphic Container) */}
            <div className="lg:w-1/2 w-full perspective-1000">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/20 to-white/0 shadow-2xl backdrop-blur-sm transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-y-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 to-orange-500/20 blur-2xl -z-10" />
                <div className="bg-slate-900/80 rounded-[22px] overflow-hidden backdrop-blur-xl border border-white/10">
                  {program.image ? (
                    <Image
                      src={mediaUrl(program.image.storage_path)}
                      alt={program.name}
                      width={900}
                      height={600}
                      className="w-full h-auto object-cover aspect-[4/3] mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] flex flex-col items-center justify-center text-slate-500 p-12 text-center bg-slate-900/50">
                      <ImageIcon size={64} className="mb-6 opacity-30 drop-shadow-2xl" />
                      <p className="font-medium text-slate-400 text-lg">Visual Representation</p>
                      <p className="text-sm mt-2">Upload a hero image in the admin panel.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERVIEW / DESCRIPTION SECTION */}
      {program.description && (
        <section className="py-24 bg-white relative z-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-rose-600 font-bold tracking-wide uppercase text-sm mb-3">Program Overview</h2>
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">About the Course</h3>
              </div>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-slate-600 leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-slate-800 prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. WHO CAN APPLY & WHAT YOU GAIN (BENTO CARDS) */}
      {(whoCanApply.length > 0 || whatYouGain.length > 0) && (
        <section id="curriculum" className={`py-32 ${program.description ? 'bg-slate-50' : 'bg-white rounded-t-[3rem] z-20 relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'}`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-rose-600 font-bold tracking-wide uppercase text-sm mb-3">Eligibility & Outcomes</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Is this for you?</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Who Can Apply */}
              {whoCanApply.length > 0 && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <GraduationCap size={120} />
                  </div>
                  <h4 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap size={24} />
                    </div>
                    Who Can Apply
                  </h4>
                  <ul className="space-y-6 relative z-10">
                    {whoCanApply.map((item: string, i: number) => (
                      <li key={i} className="flex gap-4 text-slate-700 text-lg">
                        <CheckCircle size={24} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What You Gain */}
              {whatYouGain.length > 0 && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Award size={120} />
                  </div>
                  <h4 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Award size={24} />
                    </div>
                    What You Gain
                  </h4>
                  <ul className="space-y-6 relative z-10">
                    {whatYouGain.map((item: string, i: number) => (
                      <li key={i} className="flex gap-4 text-slate-700 text-lg">
                        <CheckCircle size={24} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 4. KEY FEATURES (DARK GRID) */}
      {features.length > 0 && (
        <section className="py-32 bg-[#050b14] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-900/20 to-transparent blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-rose-400 font-bold tracking-wide uppercase text-sm mb-3">Curriculum Highlights</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Program Features</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-white/0 hover:from-rose-500/50 hover:to-orange-600/50 transition-all duration-500 group">
                  <div className="bg-[#0a0f1c] h-full p-8 rounded-[23px] flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-rose-500/30 transition-colors">
                      <Rocket className="text-rose-400 group-hover:animate-bounce" size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-white leading-relaxed">{feature}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. IMMERSIVE CTA */}
      <section className="py-32 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-[#0a0f1c] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-rose-600/30 to-orange-500/30 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                Ready to advance your <br/>career forward?
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Secure your spot in the {program.name} program and take the next step in your professional journey.
              </p>
              <Link
                href={program.cta_url || "/contact"}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-400 to-orange-500 text-slate-900 font-extrabold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)]"
              >
                {program.cta_text || "Enroll Now"}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
