"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Search, Edit, Trash2, Inbox, X } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { IndustryResponse, IndustryCreate } from "@/lib/api/admin-types";

export default function AdminIndustriesPage() {
  const { adminFetch } = useAdminApi();
  const [industries, setIndustries] = useState<IndustryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const defaultForm: IndustryCreate = {
    name: "",
    slug: "",
    short_description: "",
    description: "",
    is_active: true,
    display_order: 1
  };
  const [formData, setFormData] = useState<IndustryCreate>(defaultForm);

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetch<IndustryResponse[]>("/admin/industries");
      setIndustries(data || []);
    } catch (err: unknown) {
      console.error("Failed to load industries", err);
      setError((err as Error).message || "Failed to load industries");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setModalError(null);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (industry: IndustryResponse) => {
    setEditingId(industry.id);
    setFormData({
      name: industry.name,
      slug: industry.slug,
      short_description: industry.short_description || "",
      description: industry.description || "",
      image_id: industry.image_id || "",
      cta_text: industry.cta_text || "",
      cta_url: industry.cta_url || "",
      is_active: industry.is_active,
      display_order: industry.display_order,
      meta_title: industry.meta_title || "",
      meta_description: industry.meta_description || "",
      og_image_id: industry.og_image_id || ""
    });
    setModalError(null);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteConfirmId(null);
    setModalError(null);
    setDeleteError(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, name, slug });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const payload = { ...formData };
    if (payload.image_id === "") payload.image_id = null;
    if (payload.og_image_id === "") payload.og_image_id = null;

    try {
      if (editingId) {
        await adminFetch(`/admin/industries/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await adminFetch("/admin/industries", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Save failed", err);
      if (err instanceof ApiError && err.status === 409) {
        setModalError("An industry with this slug already exists.");
      } else {
        setModalError((err as Error).message || "Failed to save industry");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await adminFetch(`/admin/industries/${deleteConfirmId}`, {
        method: "DELETE"
      });
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Delete failed", err);
      if (err instanceof ApiError && err.status === 409) {
        setDeleteError("Cannot delete industry. Check dependencies.");
      } else {
        setDeleteError((err as Error).message || "Failed to delete industry");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredIndustries = industries.filter(ind => {
    const matchesSearch = ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ind.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true :
                          statusFilter === "active" ? ind.is_active :
                          !ind.is_active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Industries" 
        description="Manage the industries your company serves."
        action={{ label: "Add Industry", icon: Plus, onClick: openAddModal }}
      />

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Error loading industries: {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search industries..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading industries...</div>
            ) : filteredIndustries.length === 0 ? (
              <AdminEmptyState 
                icon={Inbox}
                title="No Industries Found"
                description={searchQuery ? "Try adjusting your search or filters." : "There are currently no industries to display."}
                className="border-0 shadow-none rounded-none"
              />
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Slug</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 hidden md:table-cell">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIndustries.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{ind.name}</div>
                        {ind.short_description && (
                          <div className="text-slate-500 text-xs mt-1 max-w-[200px] truncate hidden sm:block">
                            {ind.short_description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs hidden sm:table-cell">{ind.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${ind.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {ind.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{ind.display_order}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(ind)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(ind.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-full h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Industry" : "Add Industry"}</h2>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50 overflow-x-auto">
              <button type="button" onClick={() => setActiveTab("basic")} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "basic" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Basic Info</button>
              <button type="button" onClick={() => setActiveTab("content")} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Content & CTA</button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
                {modalError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 mb-4">
                    {modalError}
                  </div>
                )}
                
                {/* Basic Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                        <input required type="text" value={formData.name} onChange={handleNameChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
                        <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                        <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                        <select value={formData.is_active ? "true" : "false"} onChange={(e) => setFormData({...formData, is_active: e.target.value === "true"})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                      <textarea value={formData.short_description || ""} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief summary for the industry card..." />
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Full Description (About)</label>
                      <textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6} placeholder="Detailed HTML or Markdown content for the industry page..." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Image ID (from Media Library)</label>
                        <input type="text" value={formData.image_id || ""} onChange={(e) => setFormData({...formData, image_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="e.g. 550e8400-e29b..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Call to Action Text</label>
                        <input type="text" value={formData.cta_text || ""} onChange={(e) => setFormData({...formData, cta_text: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Request Demo" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Call to Action URL</label>
                        <input type="text" value={formData.cta_url || ""} onChange={(e) => setFormData({...formData, cta_url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. /contact" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                <button type="button" onClick={closeModals} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <div className="flex gap-2">
                  {activeTab !== "content" && (
                    <button type="button" onClick={() => setActiveTab("content")} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Next Step</button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 shadow-sm">
                    {isSubmitting ? "Saving..." : "Save Industry"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Industry</h3>
              <p className="text-slate-600 text-sm mb-4">
                Are you sure you want to delete this industry? This action cannot be undone.
              </p>
              
              {deleteError && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                  {deleteError}
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Industry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

