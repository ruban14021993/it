"use client";

import { useAuth } from "@/lib/admin/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu,
  X,
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage", href: "/admin/homepage", icon: Layers },
  { label: "Products", href: "/admin/products", icon: Briefcase },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Industries", href: "/admin/industries", icon: Briefcase },
  { label: "About", href: "/admin/about", icon: FileText },
  { label: "Training", href: "/admin/training", icon: Users },
  { label: "Contact", href: "/admin/contact", icon: MessageSquare },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Navigation", href: "/admin/navigation", icon: Navigation },
  { label: "FAQs", href: "/admin/faqs", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:w-64 md:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
          <span className="text-lg font-bold truncate">Admin Dashboard</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-700" : "text-gray-400 group-hover:text-blue-600"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-4 flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
          <span className="text-lg font-bold text-gray-900">Admin</span>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
