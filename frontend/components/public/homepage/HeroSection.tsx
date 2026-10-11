"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Volume2, VolumeX, Sparkles } from "lucide-react";
import type { HeroSection as HeroSectionType } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";

interface HeroSectionProps {
  hero: HeroSectionType;
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-20 lg:pb-20 lg:min-h-[88vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start max-w-2xl">
            {hero.eyebrow && (
              <span className="inline-flex items-center gap-1.5 py-1 px-3 sm:px-3.5 rounded-full bg-blue-50 text-[#0a82bd] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 sm:mb-6 shadow-sm border border-blue-100/80">
                <Sparkles size={13} className="text-[#0a82bd]" />
                {hero.eyebrow}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-4 sm:mb-6 tracking-tight">
              {hero.heading}
            </h1>
            
            {hero.description && (
              <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                {hero.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto">
              {hero.primary_cta_text && (
                <Link
                  href={hero.primary_cta_url || "/products"}
                  className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#0a82bd] to-[#00a56f] rounded-xl hover:from-[#086a9a] hover:to-[#008257] transition-all focus:outline-none focus:ring-2 focus:ring-[#0a82bd] focus:ring-offset-2 shadow-lg shadow-blue-500/25 group active:scale-[0.99]"
                >
                  {hero.primary_cta_text}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {hero.secondary_cta_text && (
                <Link
                  href={hero.secondary_cta_url || "/services"}
                  className="inline-flex items-center justify-center px-7 sm:px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-[#0a82bd] hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 shadow-sm active:scale-[0.99]"
                >
                  {hero.secondary_cta_text}
                </Link>
              )}
            </div>
          </div>

          {/* Visual Showcase Column (Optimized for both Mobile & Desktop) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full mt-2 lg:mt-0">
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none group">
              
              {/* High-tech Ambient Glow */}
              <div 
                className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-tr from-[#0a82bd]/30 via-emerald-500/20 to-[#00a56f]/30 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-85 transition duration-700 pointer-events-none" 
                aria-hidden="true"
              />

              {/* Media Card Container */}
              <div className="relative w-full aspect-video sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-slate-200/90 bg-slate-950">
                {hero.image ? (
                  <>
                    {hero.image.media_type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={mediaUrl(hero.image.storage_path)}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          preload="auto"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Live Showcase Tag */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 shadow-lg">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="tracking-wide text-[11px] sm:text-xs">Featured Showcase</span>
                        </div>

                        {/* Interactive Sound Control */}
                        <button
                          type="button"
                          onClick={toggleSound}
                          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/15 shadow-lg transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0a82bd] cursor-pointer"
                          aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                        >
                          {isMuted ? (
                            <>
                              <VolumeX size={14} className="text-slate-300" />
                              <span className="text-[11px] font-medium hidden sm:inline">Unmute</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={14} className="text-emerald-400" />
                              <span className="text-[11px] font-medium hidden sm:inline">Sound On</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={mediaUrl(hero.image.storage_path)}
                          alt={hero.image.alt_text || hero.heading || "Hero Advertisement"}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 550px"
                        />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 shadow-lg">
                          <span className="h-2 w-2 rounded-full bg-[#0a82bd]" />
                          <span className="tracking-wide text-[11px] sm:text-xs">Infinity Mind Tech</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Fallback Graphic (Fully responsive on Mobile and Desktop) */
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0a82bd]/25 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-4 right-4 w-36 h-36 bg-[#00a56f]/25 rounded-full blur-2xl animate-pulse delay-500" />
                    
                    <div className="relative w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl text-white">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-[11px] text-slate-300 ml-2 font-mono">infinity_mind.ai</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3.5 bg-white/20 rounded w-4/5" />
                        <div className="h-3 bg-white/10 rounded w-3/5" />
                        <div className="pt-2 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#0a82bd] to-[#00a56f] flex items-center justify-center font-bold text-xs text-white shadow-md">
                            IM
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">Next-Gen Tech Platform</div>
                            <div className="text-[10px] text-slate-300">AI & Cloud Innovation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
          
        </div>
      </div>
      
      {/* Background Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#0a82bd 1px, transparent 1px)', backgroundSize: '28px 28px' }} 
        aria-hidden="true"
      />
    </section>
  );
}
