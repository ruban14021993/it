// -----------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------
export interface MediaRef {
  id: string;
  filename: string;
  storage_path: string;
  alt_text: string | null;
  media_type: string;
  width: number | null;
  height: number | null;
}

// -----------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------
export interface HeroSection {
  id: string;
  eyebrow: string | null;
  heading: string;
  description: string | null;
  primary_cta_text: string | null;
  primary_cta_url: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  image: MediaRef | null;
  is_active: boolean;
  display_order: number;
  updated_at: string;
}

// -----------------------------------------------------------------------
// Popup
// -----------------------------------------------------------------------
export interface Popup {
  id: string;
  title: string;
  description: string | null;
  image: MediaRef | null;
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  updated_at: string;
}

// -----------------------------------------------------------------------
// Homepage Sections
// -----------------------------------------------------------------------
export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  description: string | null;
  image: MediaRef | null;
  cta_text: string | null;
  cta_url: string | null;
  is_active: boolean;
  display_order: number;
  updated_at: string;
}

// -----------------------------------------------------------------------
// Product Category
// -----------------------------------------------------------------------
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

// -----------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  hero_image: MediaRef | null;
  category: ProductCategory | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export interface ProductModule {
  id: string;
  name: string;
  description: string | null;
  image: MediaRef | null;
  display_order: number;
}

export interface ProductDetail extends ProductListItem {
  description: string | null;
  hero_video_url: string | null;
  features: Array<{ title: string; description?: string }>;
  benefits: Array<{ title: string }>;
  use_cases: string[];
  modules: ProductModule[];
  gallery: Array<{
    id: string;
    media: MediaRef;
    display_order: number;
  }>;
  cta_text: string | null;
  cta_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: MediaRef | null;
}

export interface ProductListResponse {
  data: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// -----------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------
export interface ServiceListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon: string | null;
  image: MediaRef | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export interface ServiceDetail extends ServiceListItem {
  description: string | null;
  features: Array<{ title: string; description?: string } | string>;
  cta_text: string | null;
  cta_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: MediaRef | null;
}

// -----------------------------------------------------------------------
// Industries
// -----------------------------------------------------------------------
export interface IndustryListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image: MediaRef | null;
  is_active: boolean;
  display_order: number;
}

export interface IndustryDetail extends IndustryListItem {
  description: string | null;
  cta_text: string | null;
  cta_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: MediaRef | null;
  related_products: ProductListItem[];
}

// -----------------------------------------------------------------------
// About
// -----------------------------------------------------------------------
export interface AboutContent {
  id: string;
  company_name: string;
  tagline: string | null;
  overview: string | null;
  founder_name: string | null;
  founder_title: string | null;
  founder_message: string | null;
  founded_year: number | null;
  mission: string | null;
  vision: string | null;
  future_vision: string | null;
  values: string | null;
  commitment_items: Array<{ title: string; description: string; image_id?: string }>;
  why_choose_items: Array<{ title: string; description: string }>;
  hero_image: MediaRef | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

// -----------------------------------------------------------------------
// Training
// -----------------------------------------------------------------------
export interface TrainingListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image: MediaRef | null;
  duration: string | null;
  is_active: boolean;
  display_order: number;
}

export interface TrainingDetail extends TrainingListItem {
  description: string | null;
  features: string[];
  who_can_apply: string[];
  what_you_gain: string[];
  cta_text: string | null;
  cta_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

// -----------------------------------------------------------------------
// Contact
// -----------------------------------------------------------------------
export interface ContactSettings {
  primary_email: string | null;
  hr_email: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  contact_form_enabled: boolean;
  contact_form_recipient: string | null;
  business_hours: string | null;
}

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  display_order: number;
  is_active: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ContactPublicResponse {
  settings: ContactSettings | null;
  branches: Branch[];
  social_links: SocialLink[];
}

// -----------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------
export interface NavItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  location: string;
  display_order: number;
  is_active: boolean;
  is_external: boolean;
  target: string;
  children: NavItem[];
}

export interface FooterResponse {
  nav_groups: Record<string, NavItem[]>;
  social_links: SocialLink[];
  description: string | null;
  copyright_text: string | null;
}

// -----------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

// -----------------------------------------------------------------------
// Homepage aggregated
// -----------------------------------------------------------------------
export interface AboutPreviewContent {
  eyebrow: string;
  heading: string;
  description?: string | null;
  established_year?: number;
  founder_name?: string;
  founder_title?: string;
  cta_text: string;
  cta_url: string;
}

export interface AboutContent {
  companyName: string;
  establishedYear: number;
  founderName: string;
  founderQualifications?: string;
  founderRole?: string;
  description?: string | null;
}

export interface FinalCTAContent {
  headline: string;
  description: string;
  primary_cta_text: string;
  primary_cta_url: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
}

export interface CareersContent {
  eyebrow: string;
  heading: string;
  description: string;
  email: string;
}

export interface HomePublicResponse {
  hero: HeroSection | null;
  popup: Popup | null;
  sections: HomepageSection[];
  featured_products: ProductListItem[];
  services: ServiceListItem[];
  industries: IndustryListItem[];
  about_preview?: AboutPreviewContent | null;
  final_cta?: FinalCTAContent | null;
}
