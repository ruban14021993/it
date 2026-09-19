import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Resolves a media asset storage_path to a full URL.
 * storage_path is stored as "/uploads/filename.jpg" — prefix with the backend base.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

/**
 * Slugify a string — used for generating URL-safe slugs.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a given character limit.
 */
export function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + "…";
}
