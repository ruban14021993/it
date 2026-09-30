import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  CheckCircle, ChevronRight, Image as ImageIcon, 
  ArrowRight, Sparkles, Zap, ShieldCheck, 
  Layers, Rocket 
} from "lucide-react";
import { getService } from "@/lib/api/public";
import { mediaUrl } from "@/lib/utils";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return {
      title: service ? service.name : "Service Not Found",
      description: service?.short_description || undefined,
    };
  } catch {
    return { title: "Service Not Found" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  let service;
  try {
    service = await getService(slug);
  } catch {
    notFound();
  }
  
  if (!service || !service.id) {
    notFound();
  }

  const features = service.features && service.features.length > 0 ? service.features : [];

  return (
    <div className="min-h-screen bg-[#0a0f1c] selection:bg-emerald-500/30">
      
      {/* 1. HERO SECTION (GLASSMORPHISM & GLOW) */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 opacity-70 animate-pulse mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] translate-y-1/3 opacity-60 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={14} />
            <span className="text-emerald-400">{service.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-xl">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                  Premium Service
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                {service.name}
              </h1>
              
              {service.short_description && (
                <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-xl font-light">
                  {service.short_description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={service.cta_url || "/contact"}
                  className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden flex items-center gap-3"
                >
                  <span className="relative z-10">{service.cta_text || "Engage Our Experts"}</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                {features.length > 0 && (
                  <a href="#benefits" className="px-8 py-4 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/5 transition-colors backdrop-blur-sm">
                    View Benefits
                  </a>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center gap-6 text-sm text-slate-400 font-medium">
                <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Certified Experts</div>
                <div className="flex items-center gap-2"><Zap size={16} className="text-blue-500" /> Agile Delivery</div>
                <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-purple-500" /> 24/7 Support</div>
              </div>
            </div>
            
            {/* Right Hero Image (Glassmorphic Container) */}
            <div className="lg:w-1/2 w-full perspective-1000">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/20 to-white/0 shadow-2xl backdrop-blur-sm transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-y-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 blur-2xl -z-10" />
                <div className="bg-slate-900/80 rounded-[22px] overflow-hidden backdrop-blur-xl border border-white/10">
                  {service.image ? (
                    <Image
                      src={mediaUrl(service.image.storage_path)}
                      alt={service.name}
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
      {service.description && (
        <section className="py-24 bg-white relative z-20 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Service Overview</h2>
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">About {service.name}</h3>
              </div>
              <div
                className="prose prose-lg md:prose-xl max-w-none text-slate-600 leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-slate-800 prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. SERVICE BENEFITS (BENTO GRID STYLE) */}
      {features.length > 0 && (
        <section id="benefits" className={`py-32 ${service.description ? 'bg-slate-50' : 'bg-white rounded-t-[3rem] z-20 relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'}`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">The InfinityMind Approach</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Why Choose This Service</h3>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Our methodology is designed to bring you the highest quality results with transparent execution.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {features.map((feature: string | any, idx: number) => {
                const title = typeof feature === 'string' ? feature : feature.title;
                const desc = typeof feature === 'string' ? "An essential benefit ensuring top-tier execution and long-lasting success." : feature.description;
                
                return (
                  <div 
                    key={idx} 
                    className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <Layers size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{title}</h4>
                    <p className="text-slate-500 leading-relaxed relative z-10">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. IMMERSIVE CTA */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-[#0a0f1c] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/30 to-emerald-500/30 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
                Ready to transform your <br/>vision into reality?
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Partner with us and leverage {service.name} to achieve your most ambitious business goals.
              </p>
              <Link
                href={service.cta_url || "/contact"}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-400 to-blue-500 text-slate-900 font-extrabold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
              >
                {service.cta_text || "Get Started Today"}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
