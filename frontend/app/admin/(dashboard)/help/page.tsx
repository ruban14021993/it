/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Save, Users, FileText, ImageIcon } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Help Center" 
        description="Manage frequently asked questions (FAQs)."
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">FAQs</h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
            <Plus size={14} /> Add FAQ
          </button>
        </div>
        <AdminEmptyState 
          icon={FileText}
          title="No FAQs have been added yet."
          description="Create your first frequently asked question to help users."
          className="border-0 shadow-none rounded-none"
        />
      </div>
        
    </div>
  );
}
