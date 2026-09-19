"use client";

import { useAuth } from "@/lib/admin/auth-context";
import Link from "next/link";
import { 
  Layers, Briefcase, Users, FileText, 
  MessageSquare, Image as ImageIcon 
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const quickLinks = [
    { label: "Homepage Settings", href: "/admin/homepage", icon: Layers, color: "bg-blue-500" },
    { label: "Products", href: "/admin/products", icon: Briefcase, color: "bg-emerald-500" },
    { label: "Services", href: "/admin/services", icon: Briefcase, color: "bg-purple-500" },
    { label: "About Content", href: "/admin/about", icon: FileText, color: "bg-orange-500" },
    { label: "Training", href: "/admin/training", icon: Users, color: "bg-pink-500" },
    { label: "Contact & Branches", href: "/admin/contact", icon: MessageSquare, color: "bg-teal-500" },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon, color: "bg-indigo-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name || "Admin"}
      </h1>
      <p className="text-gray-600 mb-8">
        Manage the InfinityMind Tech website content from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className={`${link.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <div className="mt-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Manage content →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
