/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Save, Users, FileText, ImageIcon } from "lucide-react";

export default function AdminNavigationPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Navigation" 
        description="Manage website header and footer menus."
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-8">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Header Navigation</h2>
        </div>
        <div className="p-4 bg-slate-50 text-sm text-slate-500 text-center">
          UI functionality disabled in prototype. Drag and drop reordering would appear here.
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Footer Navigation</h2>
        </div>
        <div className="p-4 bg-slate-50 text-sm text-slate-500 text-center">
          UI functionality disabled in prototype. Drag and drop reordering would appear here.
        </div>
      </div>
        
    </div>
  );
}
