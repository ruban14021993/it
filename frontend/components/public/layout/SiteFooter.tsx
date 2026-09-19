import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import type { FooterResponse } from "@/lib/types";

interface SiteFooterProps {
  footer: FooterResponse;
}

const SECTION_LABELS: Record<string, string> = {
  footer_products: "Solutions",
  footer_services: "Services",
  footer_industries: "Industries",
  footer_more: "Company",
};

export default function SiteFooter({ footer }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                InfinityMind Tech
              </span>
            </Link>
            
            {footer.description && (
              <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
                {footer.description}
              </p>
            )}
            
            {/* Social links */}
            {footer.social_links && footer.social_links.length > 0 && (
              <div className="flex gap-4">
                {footer.social_links.filter(s => s.url !== "#").map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={social.platform}
                    title={social.platform}
                  >
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav Group Columns */}
          {["footer_products", "footer_services", "footer_industries", "footer_more"].map((loc) => {
            const items = footer.nav_groups[loc] || [];
            if (items.length === 0) return null;
            return (
              <div key={loc} className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">
                  {SECTION_LABELS[loc]}
                </h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.url}
                        className="text-sm text-slate-400 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {footer.copyright_text || `© ${year} InfinityMind Tech Pvt. Ltd. All rights reserved.`}
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors focus:outline-none focus:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors focus:outline-none focus:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
