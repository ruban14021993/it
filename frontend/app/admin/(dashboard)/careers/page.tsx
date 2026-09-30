/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Save, Users, FileText, ImageIcon } from "lucide-react";

export default function AdminCareersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Careers" 
        description="Manage job openings and HR contact information."
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-8">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Job Openings</h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
            <Plus size={14} /> Add Job
          </button>
        </div>
        <AdminEmptyState 
          icon={Users}
          title="No current job openings"
          description="There are no active job postings at the moment."
          className="border-0 shadow-none rounded-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">HR Contact Information</h2>
        </div>
        <div className="p-6">
          <div className="max-w-md space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">HR Email Address</label>
            <input 
              type="email" 
              defaultValue="hr@infinitymindtech.com" 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
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
