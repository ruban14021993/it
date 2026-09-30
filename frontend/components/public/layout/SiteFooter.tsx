import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
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
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 relative before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-gradient-to-r before:from-[#0a82bd] before:via-[#00a56f] before:via-yellow-400 before:to-orange-500">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="inline-block mb-6 focus:outline-none focus:ring-2 focus:ring-[#0a82bd] rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image src="/images/logo.jpg" alt="InfinityMind Tech" width={200} height={70} className="h-14 w-auto object-contain" />
            </Link>
            
            {footer.description ? (
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                {footer.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                InfinityMind Tech Pvt Ltd offers innovative solutions in AI, Cloud Services, and Smart Tech for modern businesses. We empower enterprises to scale, secure, and transform.
              </p>
            )}
            
            <div className="text-sm text-slate-400 mb-8 space-y-2">
              <p>📍 123 Tech Park, Innovation City</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ contact@infinitymindtech.com</p>
            </div>
            
            {/* Social links */}
            {footer.social_links && footer.social_links.length > 0 && (
              <div className="flex gap-4">
                {footer.social_links.filter(s => s.url !== "#").map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.platform}
                    className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:bg-gradient-to-r hover:from-[#0a82bd] hover:to-[#00a56f] hover:text-white flex items-center justify-center transition-all text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0a82bd] shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav Group Columns */}
          {["footer_products", "footer_services", "footer_industries", "footer_more"].map((loc) => {
            const backendItems = footer.nav_groups[loc] || [];
            // Provide fallback hardcoded content if backend is empty to fill the space!
            const items = backendItems.length > 0 ? backendItems : (
              loc === "footer_products" ? [
                {id: 'fp1', label: 'Retail Billing', url: '/products/retail-billing'},
                {id: 'fp2', label: 'POS System', url: '/products/pos'},
                {id: 'fp3', label: 'Restaurant Management', url: '/products/restaurant-management'},
                {id: 'fp4', label: 'Zenpayroll', url: '/products/zenpayroll'},
                {id: 'fp5', label: 'StockGenius', url: '/products/stockgenius'},
                {id: 'fp6', label: 'View All Solutions', url: '/products'}
              ] :
              loc === "footer_services" ? [
                {id: 'fs1', label: 'Web Designing', url: '/services/web-designing'},
                {id: 'fs2', label: 'Cloud Services', url: '/services/cloud-services'},
                {id: 'fs3', label: 'AI Solutions', url: '/services/ai-solutions'},
                {id: 'fs4', label: 'Mobile App Dev', url: '/services/mobile-apps'},
                {id: 'fs5', label: 'Digital Marketing', url: '/services/digital-marketing'},
                {id: 'fs6', label: 'View All Services', url: '/services'}
              ] :
              loc === "footer_industries" ? [
                {id: 'fi1', label: 'Healthcare', url: '/industries'}, 
                {id: 'fi2', label: 'Retail', url: '/industries'},
                {id: 'fi3', label: 'Manufacturing', url: '/industries'},
                {id: 'fi4', label: 'Education', url: '/industries'},
                {id: 'fi5', label: 'Finance', url: '/industries'}
              ] :
              loc === "footer_more" ? [
                {id: 'fm1', label: 'About Us', url: '/about'}, 
                {id: 'fm2', label: 'Careers', url: '/careers'}, 
                {id: 'fm3', label: 'Contact', url: '/contact'}, 
                {id: 'fm4', label: 'Training', url: '/training'},
                {id: 'fm5', label: 'Our Team', url: '/team'}
              ] : []
            );

            if (items.length === 0) return null;
            return (
              <div key={loc} className="lg:col-span-1">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">
                  {SECTION_LABELS[loc]}
                </h3>
                <ul className="space-y-3">
                  {items.map((item: any) => (
                    <li key={item.id}>
                      <Link
                        href={item.url}
                        className="text-sm font-medium text-slate-400 hover:text-[#00a56f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a82bd] rounded-sm"
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
          <p className="text-sm font-medium text-slate-500">
            Developed by <span className="text-[#0a82bd] font-bold">Ruban</span>
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy-policy" className="hover:text-[#00a56f] transition-colors focus:outline-none focus:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#00a56f] transition-colors focus:outline-none focus:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

