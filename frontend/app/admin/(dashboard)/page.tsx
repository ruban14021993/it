"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { 
  Briefcase, Layers, FileText, Users, Plus, 
  MessageSquare, ImageIcon, ArrowRight
} from "lucide-react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { BaseRecord } from "@/lib/api/admin-types";

export default function AdminDashboardPage() {
  const { adminFetch } = useAdminApi();
  const [counts, setCounts] = useState({
    products: 0,
    services: 0,
    industries: 0,
    training: 0,
    enquiries: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [
        products, services, industries, training, enquiries
      ] = await Promise.all([
        adminFetch<BaseRecord[]>("/admin/products"),
        adminFetch<BaseRecord[]>("/admin/services"),
        adminFetch<BaseRecord[]>("/admin/industries"),
        adminFetch<BaseRecord[]>("/admin/training"),
        adminFetch<BaseRecord[]>("/admin/enquiries")
      ]);

      setCounts({
        products: products.length,
        services: services.length,
        industries: industries.length,
        training: training.length,
        enquiries: enquiries.length,
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to load dashboard data");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const stats = [
    { label: "Products", value: counts.products, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Services", value: counts.services, icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Industries", value: counts.industries, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Training Programs", value: counts.training, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const contentStatus = [
    { name: "Products", count: `${counts.products} items`, status: "Managed Content" },
    { name: "Services", count: `${counts.services} items`, status: "Managed Content" },
    { name: "Industries", count: `${counts.industries} items`, status: "Managed Content" },
    { name: "Training", count: `${counts.training} items`, status: "Managed Content" },
    { name: "Enquiries", count: `${counts.enquiries} total`, status: "User Submissions" },
  ];

  const quickActions = [
    { label: "Add Product", href: "/admin/products", icon: Plus },
    { label: "Add Service", href: "/admin/services", icon: Plus },
    { label: "Add Training Program", href: "/admin/training", icon: Plus },
    { label: "Edit Homepage", href: "/admin/homepage", icon: FileText },
    { label: "View Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Manage Media", href: "/admin/media", icon: ImageIcon },
  ];

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold">Error loading dashboard</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <AdminPageHeader 
        title="Dashboard" 
        description="Manage and monitor your InfinityMind Tech website content."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">
                {isLoading ? "..." : stat.value}
              </div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Content Overview</h2>
              <Link href="/admin/settings" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                Settings <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-slate-100">
                  {contentStatus.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {isLoading ? "Loading..." : item.count}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AdminStatusBadge status="Published" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {quickActions.map((action, idx) => (
                <Link 
                  key={idx} 
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-medium transition-colors border border-transparent hover:border-slate-100"
                >
                  <action.icon size={18} className="text-slate-400" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
