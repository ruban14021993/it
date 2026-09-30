import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle, ChevronRight, Image as ImageIcon, 
  ArrowRight, Sparkles, Zap, ShieldCheck, 
  Layers, Rocket 
} from "lucide-react";
import { getIndustry } from "@/lib/api/public";
import { mediaUrl } from "@/lib/utils";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const industry = await getIndustry(slug);
    return {
      title: industry ? `${industry.name} Industry Solutions` : "Industry Not Found",
    };
  } catch {
    return { title: "Industry Not Found" };
  }
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;

  let industry: any;
  try {
    industry = await getIndustry(slug);
  } catch {
    notFound();
  }
  
  if (!industry || !industry.id) {
    notFound();
  }

  // Generate some placeholder solutions if the backend doesn't return them yet
  const solutions = [
    { title: "Digital Transformation", description: `Modernize legacy systems and adopt scalable digital solutions tailored for the ${industry.name} sector.` },
    { title: "Operational Efficiency", description: "Automate workflows and reduce manual overhead with our specialized enterprise tools." },
    { title: "Data-Driven Insights", description: "Unlock the power of your data with advanced analytics and reporting dashboards." },
    { title: "Regulatory Compliance", description: `Ensure your business meets all the strict compliance and security standards required in ${industry.name}.` }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION (GLASSMORPHISM & GLOW) */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 opacity-70 animate-pulse mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 opacity-60 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/industries" className="hover:text-white transition-colors">Industries</Link>
            <ChevronRight size={14} />
            <span className="text-blue-400">{industry.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                  Industry Solution
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                {industry.name}
              </h1>
              
              {industry.short_description && (
                <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-xl font-light">
                  {industry.short_description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={industry.cta_url || "/contact"}
                  className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden flex items-center gap-3"
                >
                  <span className="relative z-10">{industry.cta_text || "Contact Our Experts"}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <a href="#solutions" className="px-8 py-4 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/5 transition-colors backdrop-blur-sm">
                  View Solutions
                </a>
              </div>
            </div>
            
            {/* Right Hero Image (Glassmorphic Container) */}
            <div className="lg:w-1/2 w-full perspective-1000">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/20 to-white/0 shadow-2xl backdrop-blur-sm transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-y-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-500/20 blur-2xl -z-10" />
                <div className="bg-slate-900/80 rounded-[22px] overflow-hidden backdrop-blur-xl border border-white/10">
                  {industry.image ? (
                    <Image
                      src={mediaUrl(industry.image.storage_path)}
                      alt={industry.name}
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
      {industry.description && (
        <section className="py-24 bg-white relative z-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Industry Overview</h2>
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">Transforming {industry.name}</h3>
              </div>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-slate-600 leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-slate-800 prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: industry.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. SOLUTIONS GRID (BENTO GRID STYLE) */}
      <section id="solutions" className={`py-32 ${industry.description ? 'bg-slate-50' : 'bg-white rounded-t-[3rem] z-20 relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-purple-600 font-bold tracking-wide uppercase text-sm mb-3">Tailored Technology</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Solutions for {industry.name}</h3>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Custom-built tools to address your most critical sector-specific challenges.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {solutions.map((sol, idx) => (
              <div 
                key={idx} 
                className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <CheckCircle size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{sol.title}</h4>
                <p className="text-slate-500 leading-relaxed relative z-10">{sol.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IMMERSIVE CTA */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-[#0a0f1c] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/30 to-purple-500/30 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                Ready to innovate your <br/>{industry.name} business?
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Connect with our industry experts to discover how our solutions can empower your organization.
              </p>
              <Link
                href={industry.cta_url || "/contact"}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-extrabold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]"
              >
                {industry.cta_text || "Consult With Us"}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
