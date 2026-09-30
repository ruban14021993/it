export interface HomepageResponse {
  id: string;
  eyebrow?: string | null;
  heading: string;
  description?: string | null;
  primary_cta_text?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  image_id?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutResponse {
  id: string;
  company_name: string;
  tagline?: string | null;
  overview?: string | null;
  founder_name?: string | null;
  founder_title?: string | null;
  founder_message?: string | null;
  founded_year?: number | null;
  mission?: string | null;
  vision?: string | null;
  future_vision?: string | null;
  values?: string | null;
  commitment_items: string[];
  why_choose_items: string[];
  hero_image_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at: string;
}

export interface ContactResponse {
  id: string;
  primary_email?: string | null;
  hr_email?: string | null;
  primary_phone?: string | null;
  secondary_phone?: string | null;
  contact_form_enabled: boolean;
  contact_form_recipient?: string | null;
  business_hours?: string | null;
  updated_at: string;
}

export interface BranchResponse {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnquiryResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BaseRecord {
  id: string;
}


export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ProductResponse {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  hero_image_id?: string | null;
  hero_video_url?: string | null;
  features: string[];
  benefits: string[];
  use_cases: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  category_id?: string | null;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  hero_image_id?: string | null;
  hero_video_url?: string | null;
  features: string[];
  benefits: string[];
  use_cases: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
}

export interface ServiceResponse {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  icon?: string | null;
  image_id?: string | null;
  features: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  icon?: string | null;
  image_id?: string | null;
  features: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
}

export interface IndustryResponse {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_id?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IndustryCreate {
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_id?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_id?: string | null;
}

export interface TrainingResponse {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_id?: string | null;
  duration?: string | null;
  features?: string[];
  who_can_apply?: string[];
  what_you_gain?: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingCreate {
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_id?: string | null;
  duration?: string | null;
  features?: string[];
  who_can_apply?: string[];
  what_you_gain?: string[];
  cta_text?: string | null;
  cta_url?: string | null;
  is_active: boolean;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
}


export interface HomepageResponse {
  id: string;
  eyebrow?: string | null;
  heading: string;
  description?: string | null;
  primary_cta_text?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  image_id?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageUpdate {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  primary_cta_text?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  image_id?: string | null;
  is_active?: boolean | null;
}

export interface AboutResponse {
  id: string;
  company_name: string;
  tagline?: string | null;
  overview?: string | null;
  founder_name?: string | null;
  founder_title?: string | null;
  founder_message?: string | null;
  founded_year?: number | null;
  mission?: string | null;
  vision?: string | null;
  future_vision?: string | null;
  values?: string | null;
  commitment_items: string[];
  why_choose_items: string[];
  hero_image_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  updated_at: string;
}

export interface AboutUpdate {
  company_name?: string | null;
  tagline?: string | null;
  overview?: string | null;
  founder_name?: string | null;
  founder_title?: string | null;
  founder_message?: string | null;
  founded_year?: number | null;
  mission?: string | null;
  vision?: string | null;
  future_vision?: string | null;
  values?: string | null;
  commitment_items?: string[] | null;
  why_choose_items?: string[] | null;
  hero_image_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface ContactResponse {
  id: string;
  primary_email?: string | null;
  hr_email?: string | null;
  primary_phone?: string | null;
  secondary_phone?: string | null;
  contact_form_enabled: boolean;
  contact_form_recipient?: string | null;
  business_hours?: string | null;
  updated_at: string;
}

export interface ContactUpdate {
  primary_email?: string | null;
  hr_email?: string | null;
  primary_phone?: string | null;
  secondary_phone?: string | null;
  contact_form_enabled?: boolean | null;
  contact_form_recipient?: string | null;
  business_hours?: string | null;
}

export interface BranchResponse {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchCreate {
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface BranchUpdate {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
}

export interface EnquiryResponse {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EnquiryUpdate {
  status?: string | null;
}
