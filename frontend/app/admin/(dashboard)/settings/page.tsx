/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Save, Users, FileText, ImageIcon } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Site Settings" 
        description="Manage global configuration, SEO, and social links."
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-6 text-sm font-medium">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">General</button>
            <button className="text-slate-500 hover:text-slate-700 pb-4 -mb-4">SEO</button>
            <button className="text-slate-500 hover:text-slate-700 pb-4 -mb-4">Social</button>
            <button className="text-slate-500 hover:text-slate-700 pb-4 -mb-4">Legal</button>
          </div>
        </div>
        
        <div className="p-6 max-w-2xl space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Site Name</label>
            <input 
              type="text" 
              defaultValue="InfinityMind Tech" 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Legal Configuration</h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 text-center">
              Content not configured yet.
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
        
    </div>
  );
}
