"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Layers, Briefcase, FileText, Users, MessageSquare, 
  ImageIcon, Navigation, Settings, Menu, X, Bell, Search, User, LogOut,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/admin/auth-context";

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard }
    ]
  },
  {
    label: "WEBSITE CONTENT",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: Layers },
      { label: "Products", href: "/admin/products", icon: Briefcase },
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Industries", href: "/admin/industries", icon: Briefcase },
      { label: "About", href: "/admin/about", icon: FileText },
      { label: "Careers", href: "/admin/careers", icon: Users },
      { label: "Training", href: "/admin/training", icon: Users },
      { label: "Contact", href: "/admin/contact", icon: MessageSquare }
    ]
  },
  {
    label: "ENGAGEMENT",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
      { label: "Help Center", href: "/admin/help", icon: MessageSquare }
    ]
  },
  {
    label: "ASSETS",
    items: [
      { label: "Media Library", href: "/admin/media", icon: ImageIcon }
    ]
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Navigation", href: "/admin/navigation", icon: Navigation },
      { label: "SEO / Site Settings", href: "/admin/settings", icon: Settings }
    ]
  }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Derive current page title from pathname or NAV_GROUPS
  let currentPageTitle = "Admin Portal";
  NAV_GROUPS.forEach(group => {
    group.items.forEach(item => {
      if (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin")) {
        currentPageTitle = item.label;
      }
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 text-white flex-shrink-0">
          <div className="flex flex-col bg-white px-2 py-1 rounded">
            <Image src="/images/logo.jpg" alt="InfinityMind Tech" width={144} height={32} className="h-8 w-auto object-contain" />
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {group.label}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">{currentPageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-64 transition-all"
              />
            </div>
            
            <button className="text-slate-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center gap-3 pl-2 sm:pl-4 py-1 border-l border-slate-200 focus:outline-none"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                  AU
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || "Admin User"}</span>
                  <span className="text-xs text-slate-500">{user?.role || "Administrator"}</span>
                </div>
                <ChevronDown size={16} className="text-slate-400 hidden md:block" />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1 md:hidden">
                    <div className="text-sm font-semibold text-slate-700">{user?.name || "Admin User"}</div>
                    <div className="text-xs text-slate-500">{user?.role || "Administrator"}</div>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                    <User size={16} /> Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1 border-t border-slate-50 pt-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}



