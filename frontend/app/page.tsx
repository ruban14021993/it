import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { HomePublicResponse } from "@/lib/types";
import { MOCK_HOME_DATA } from "@/lib/content/homepage";
import HeroSection from "@/components/public/homepage/HeroSection";
import ProductsSection from "@/components/public/homepage/ProductsSection";
import ServicesSection from "@/components/public/homepage/ServicesSection";
import IndustriesSection from "@/components/public/homepage/IndustriesSection";
import AboutPreviewSection from "@/components/public/homepage/AboutPreviewSection";
import FinalCTASection from "@/components/public/homepage/FinalCTASection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "InfinityMind Tech - AI, Cloud & Smart Technology Solutions",
  description:
    "Empowering AI, Cloud, and Blockchain Innovation. InfinityMind Tech delivers innovative software solutions for healthcare, finance, and more.",
};

async function getHomeData(): Promise<HomePublicResponse> {
  try {
    const data = await apiFetch<HomePublicResponse>("/home", {
      tags: ["homepage"],
      revalidate: 3600,
    });
    
    // Defensive check: if the API succeeds but returns empty/null payload, fallback to mock data
    if (!data || !data.hero) {
      return MOCK_HOME_DATA;
    }
    return data;
  } catch {
    // If backend is down or tables are missing, fallback to mock data for frontend-first development
    return MOCK_HOME_DATA;
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      {data.hero && <HeroSection hero={data.hero} />}

      {/* 2. Products / Solutions Preview */}
      {data.featured_products && data.featured_products.length > 0 && (
        <ProductsSection products={data.featured_products} />
      )}

      {/* 3. Services Preview */}
      {data.services && data.services.length > 0 && (
        <ServicesSection services={data.services} />
      )}

      {/* 4. Industries Preview */}
      {data.industries && data.industries.length > 0 && (
        <IndustriesSection industries={data.industries} />
      )}

      {/* 5. About / Company Preview */}
      {data.about_preview && (
        <AboutPreviewSection content={data.about_preview} />
      )}

      {/* 6. Final CTA / Conversion Section */}
      {data.final_cta && (
        <FinalCTASection content={data.final_cta} />
      )}
    </div>
  );
}
