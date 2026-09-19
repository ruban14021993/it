import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { apiFetch } from "@/lib/api";
import type { NavItem, FooterResponse } from "@/lib/types";
import { MOCK_NAV_ITEMS, MOCK_FOOTER } from "@/lib/content/navigation";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "InfinityMind Tech — AI, Cloud & Smart Technology Solutions",
    template: "%s | InfinityMind Tech",
  },
  description:
    "InfinityMind Tech Pvt Ltd offers innovative solutions in AI, Cloud Services, and Smart Tech for businesses in healthcare and beyond.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.infinitymindtech.com",
    siteName: "InfinityMind Tech",
  },
};

async function getNavData() {
  try {
    const [navItems, footer] = await Promise.all([
      apiFetch<NavItem[]>("/navigation", { revalidate: 3600, tags: ["navigation"] }),
      apiFetch<FooterResponse>("/footer", { revalidate: 3600, tags: ["footer"] }),
    ]);
    return { navItems: navItems.length > 0 ? navItems : MOCK_NAV_ITEMS, footer: Object.keys(footer.nav_groups).length > 0 ? footer : MOCK_FOOTER };
  } catch {
    return {
      navItems: MOCK_NAV_ITEMS,
      footer: MOCK_FOOTER,
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navItems, footer } = await getNavData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SiteHeader navItems={navItems} />
        <main>{children}</main>
        <SiteFooter footer={footer} />
      </body>
    </html>
  );
}
