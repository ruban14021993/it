import { apiFetch } from "../api";
import { 
  ProductListItem, 
  ProductDetail,
  ProductCategory, 
  ServiceListItem, 
  IndustryListItem, 
  TrainingListItem,
  TrainingDetail,
  ContactSettings,
  Branch
} from "../types";

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiCategory {
  name: string;
  slug: string;
  display_order: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  hero_image: any | null;
  hero_video_url: string | null;
  category: ApiCategory | null;
  features: string[];
  benefits: string[];
  use_cases: string[];
  modules: any[];
  gallery: any[];
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: any | null;
}

export interface ApiService {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  image: any | null;
  features: any[];
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: any | null;
}

export interface ApiIndustry {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: any | null;
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: any | null;
  related_products: any[];
}

export interface ApiTraining {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: any | null;
  duration: string | null;
  features: string[];
  who_can_apply: string[];
  what_you_gain: string[];
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface ApiAbout {
  company_name: string;
  founder_name: string | null;
  founder_title: string | null;
  founded_year: number | null;
}

export interface ApiContact {
  primary_email: string | null;
  hr_email: string | null;
  primary_phone: string | null;
  branches: { name: string }[];
}

export interface ApiResponse<T> {
  items: T[];
}

export interface ApiItemResponse<T> {
  item: T;
}

function mapProduct(p: ApiProduct): ProductListItem {
  return {
    id: p.slug,
    name: p.name,
    slug: p.slug,
    short_description: p.short_description || "",
    hero_image: p.hero_image || null,
    category: p.category ? mapCategory(p.category) : null,
    is_active: p.is_active,
    is_featured: p.is_featured,
    display_order: p.display_order
  };
}

function mapProductDetail(p: ApiProduct): ProductDetail {
  const base = mapProduct(p);
  return {
    ...base,
    description: p.description,
    hero_video_url: p.hero_video_url,
    features: p.features || [],
    benefits: p.benefits || [],
    use_cases: p.use_cases || [],
    modules: p.modules || [],
    gallery: p.gallery || [],
    cta_text: p.cta_text,
    cta_url: p.cta_url,
    meta_title: p.meta_title,
    meta_description: p.meta_description,
    og_image: p.og_image
  };
}

function mapCategory(c: ApiCategory): ProductCategory {
  return {
    id: c.slug,
    name: c.name,
    slug: c.slug,
    description: null,
    is_active: true,
    display_order: c.display_order
  };
}

function mapService(s: ApiService): any {
  return {
    id: s.slug,
    name: s.name,
    slug: s.slug,
    short_description: s.short_description,
    description: s.description,
    icon: s.icon,
    image: s.image,
    features: s.features || [],
    cta_text: s.cta_text,
    cta_url: s.cta_url,
    is_active: s.is_active,
    is_featured: s.is_featured,
    display_order: s.display_order,
    meta_title: s.meta_title,
    meta_description: s.meta_description,
    og_image: s.og_image
  };
}

function mapIndustry(i: ApiIndustry): any {
  return {
    id: i.slug,
    name: i.name,
    slug: i.slug,
    short_description: i.short_description,
    description: i.description,
    image: i.image,
    cta_text: i.cta_text,
    cta_url: i.cta_url,
    is_active: i.is_active,
    display_order: i.display_order,
    meta_title: i.meta_title,
    meta_description: i.meta_description,
    og_image: i.og_image,
    related_products: i.related_products || []
  };
}

function mapTrainingListItem(t: ApiTraining): TrainingListItem {
  return {
    id: t.slug,
    name: t.name,
    slug: t.slug,
    short_description: t.short_description,
    duration: t.duration,
    image: t.image,
    is_active: t.is_active,
    display_order: t.display_order
  };
}

function mapTrainingDetail(t: ApiTraining): TrainingDetail {
  return {
    ...mapTrainingListItem(t),
    description: t.description,
    features: t.features || [],
    who_can_apply: t.who_can_apply || [],
    what_you_gain: t.what_you_gain || [],
    cta_text: t.cta_text,
    cta_url: t.cta_url,
    meta_title: t.meta_title,
    meta_description: t.meta_description
  };
}

const NO_CACHE = { revalidate: 0 }; 

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiCategory>>("/products/categories", { next: NO_CACHE });
    return res.items.map(mapCategory);
  } catch (e) {
    console.error("Failed to fetch product categories", e);
    return [];
  }
}

export async function getProducts(): Promise<ProductListItem[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiProduct>>("/products", { next: NO_CACHE });
    return res.items.map(mapProduct);
  } catch (e) {
    console.error("Failed to fetch products", e);
    return [];
  }
}

export async function getProductsByCategory(slug: string): Promise<ProductListItem[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiProduct>>(`/products/category/${slug}`, { next: NO_CACHE });
    return res.items.map(mapProduct);
  } catch (e) {
    console.error("Failed to fetch products by category", e);
    return [];
  }
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiProduct>>(`/products/${slug}`, { next: NO_CACHE });
    return mapProductDetail(res.item);
  } catch (e) {
    return null;
  }
}

export async function getServices(): Promise<any[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiService>>("/services", { next: NO_CACHE });
    return res.items.map(mapService);
  } catch (e) {
    console.error("Failed to fetch services", e);
    return [];
  }
}

export async function getService(slug: string): Promise<any | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiService>>(`/services/${slug}`, { next: NO_CACHE });
    return mapService(res.item);
  } catch {
    return null;
  }
}

export async function getIndustries(): Promise<any[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiIndustry>>("/industries", { next: NO_CACHE });
    return res.items.map(mapIndustry);
  } catch (e) {
    console.error("Failed to fetch industries", e);
    return [];
  }
}

export async function getIndustry(slug: string): Promise<any | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiIndustry>>(`/industries/${slug}`, { next: NO_CACHE });
    return mapIndustry(res.item);
  } catch {
    return null;
  }
}

export async function getTrainingPrograms(): Promise<TrainingDetail[]> {
  try {
    const res = await apiFetch<ApiResponse<ApiTraining>>("/training", { next: NO_CACHE });
    return res.items.map(mapTrainingDetail);
  } catch (e) {
    console.error("Failed to fetch training programs", e);
    return [];
  }
}

export async function getTrainingProgram(slug: string): Promise<TrainingDetail | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiTraining>>(`/training/${slug}`, { next: NO_CACHE });
    return mapTrainingDetail(res.item);
  } catch {
    return null;
  }
}

export async function getAbout(): Promise<ApiAbout | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiAbout>>("/about", { next: NO_CACHE });
    return res.item;
  } catch (e) {
    console.error("Failed to fetch about", e);
    return null;
  }
}

export async function getContact(): Promise<{ settings: ContactSettings; branches: Branch[] } | null> {
  try {
    const res = await apiFetch<ApiItemResponse<ApiContact>>("/contact", { next: NO_CACHE });
    
    const settings: ContactSettings = {
      primary_email: res.item.primary_email,
      hr_email: res.item.hr_email,
      primary_phone: res.item.primary_phone,
      secondary_phone: null,
      contact_form_enabled: true,
      contact_form_recipient: null,
      business_hours: null
    };

    const branches: Branch[] = res.item.branches.map((b, index) => ({
      id: `branch-${index}`,
      name: b.name,
      address: null,
      phone: null,
      email: null,
      is_primary: false,
      display_order: index + 1,
      is_active: true,
      settings: null,
      branches: [],
      social_links: []
    }));

    return { settings, branches };
  } catch (e) {
    console.error("Failed to fetch contact", e);
    return null;
  }
}

export async function submitEnquiry(data: EnquiryInput): Promise<{ message: string }> {
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/api/v1/public";
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message
    })
  });
  
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
}
