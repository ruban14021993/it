import { apiFetch } from "@/lib/api";
import { getProducts, getServices, getIndustries } from "@/lib/api/public";
import type { NavItem, FooterResponse } from "@/lib/types";
import { MOCK_NAV_ITEMS, MOCK_FOOTER } from "@/lib/content/navigation";
import SiteHeader from "@/components/public/layout/SiteHeader";
import SiteFooter from "@/components/public/layout/SiteFooter";

async function getNavData() {
  try {
    const [navItemsRes, footer, products, services, industries] = await Promise.all([
      apiFetch<NavItem[]>("/navigation", { revalidate: 3600, tags: ["navigation"] }).catch(() => []),
      apiFetch<FooterResponse>("/footer", { revalidate: 3600, tags: ["footer"] }).catch(() => ({} as FooterResponse)),
      getProducts().catch(() => []),
      getServices().catch(() => []),
      getIndustries().catch(() => []),
    ]);
    
    let navItems = navItemsRes && navItemsRes.length > 0 ? navItemsRes : JSON.parse(JSON.stringify(MOCK_NAV_ITEMS));
    
    // Inject products into the Solutions/Products nav item
    const productsNav = navItems.find((n: NavItem) => n.id === "nav-products" || n.url === "/products");
    if (productsNav && products && products.length > 0) {
      const topProducts = products.slice(0, 15);
      productsNav.children = topProducts.map((p, idx) => ({
        id: `nav-prod-${p.id}`,
        label: p.name,
        url: `/products/${p.slug}`,
        parent_id: productsNav.id,
        location: "header",
        display_order: idx + 1,
        is_active: true,
        is_external: false,
        target: "_self",
        children: []
      }));
      if (products.length > 15) {
        productsNav.children.push({
          id: "nav-prod-view-all",
          label: "View All Solutions →",
          url: "/products",
          parent_id: productsNav.id,
          location: "header",
          display_order: 16,
          is_active: true,
          is_external: false,
          target: "_self",
          children: []
        });
      }
    }

    // Inject services
    const servicesNav = navItems.find((n: NavItem) => n.id === "nav-services" || n.url === "/services");
    if (servicesNav && services && services.length > 0) {
      servicesNav.children = services.map((s, idx) => ({
        id: `nav-srv-${s.id}`,
        label: s.name,
        url: `/services/${s.slug}`,
        parent_id: servicesNav.id,
        location: "header",
        display_order: idx + 1,
        is_active: true,
        is_external: false,
        target: "_self",
        children: []
      }));
    }

    // Inject industries
    const industriesNav = navItems.find((n: NavItem) => n.id === "nav-industries" || n.url === "/industries");
    if (industriesNav && industries && industries.length > 0) {
      industriesNav.children = industries.map((i, idx) => ({
        id: `nav-ind-${i.id}`,
        label: i.name,
        url: `/industries/${i.slug}`,
        parent_id: industriesNav.id,
        location: "header",
        display_order: idx + 1,
        is_active: true,
        is_external: false,
        target: "_self",
        children: []
      }));
    }

    return { 
      navItems, 
      footer: footer && footer.nav_groups && Object.keys(footer.nav_groups).length > 0 ? footer : MOCK_FOOTER 
    };
  } catch (e) {
    return {
      navItems: MOCK_NAV_ITEMS,
      footer: MOCK_FOOTER,
    };
  }
}

import InteractiveFireworks from "@/components/public/InteractiveFireworks";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navItems, footer } = await getNavData();

  return (
    <>
      <InteractiveFireworks />
      <SiteHeader navItems={navItems} />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter footer={footer} />
    </>
  );
}
