"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Search, Edit, Trash2, Inbox, X, Star } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { ServiceResponse, ServiceCreate } from "@/lib/api/admin-types";


export default function AdminServicesPage() {
  const { adminFetch } = useAdminApi();
  const [services, setServices] = useState<ServiceResponse[]>([]);
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
  const defaultForm: ServiceCreate = {
    name: "",
    slug: "",
    short_description: "",
    description: "",
    features: [],
    is_active: true,
    is_featured: false,
    display_order: 1
  };
  const [formData, setFormData] = useState<ServiceCreate>(defaultForm);
  const [featuresText, setFeaturesText] = useState("");

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetch<ServiceResponse[]>("/admin/services");
      setServices(data || []);
    } catch (err: unknown) {
      console.error("Failed to load services", err);
      setError(((err as Error).message) || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setFeaturesText("");
    setModalError(null);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceResponse) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      slug: service.slug,
      short_description: service.short_description || "",
      description: service.description || "",
      icon: service.icon || "",
      image_id: service.image_id || "",
      features: service.features || [],
      cta_text: service.cta_text || "",
      cta_url: service.cta_url || "",
      is_active: service.is_active,
      is_featured: service.is_featured,
      display_order: service.display_order,
      meta_title: service.meta_title || "",
      meta_description: service.meta_description || "",
      og_image_id: service.og_image_id || ""
    });
    setFeaturesText((service.features || []).join("\n"));
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

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeaturesText(e.target.value);
    const features = e.target.value.split("\n").map(f => f.trim()).filter(f => f.length > 0);
    setFormData({ ...formData, features });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    // Clean up empty strings to null for UUID fields
    const payload = { ...formData };
    if (payload.image_id === "") payload.image_id = null;
    if (payload.og_image_id === "") payload.og_image_id = null;

    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    try {
      if (editingId) {
        await adminFetch(`/admin/services/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await adminFetch("/admin/services", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Save failed", err);
      if ((err instanceof ApiError) && err.status === 409) {
        setModalError("A service with this slug already exists.");
      } else {
        setModalError(((err as Error).message) || "Failed to save service");
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
      await adminFetch(`/admin/services/${deleteConfirmId}`, {
        method: "DELETE"
      });
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Delete failed", err);
      if ((err instanceof ApiError) && err.status === 409) {
        setDeleteError("Cannot delete service. Check dependencies.");
      } else {
        setDeleteError(((err as Error).message) || "Failed to delete service");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true :
                          statusFilter === "active" ? service.is_active :
                          !service.is_active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Services" 
        description="Manage the services your company offers."
        action={{ label: "Add Service", icon: Plus, onClick: openAddModal }}
      />

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Error loading services: {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table / Empty State */}
          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading services...</div>
            ) : filteredServices.length === 0 ? (
              <AdminEmptyState 
                icon={Inbox}
                title="No Services Found"
                description={searchQuery ? "Try adjusting your search or filters." : "There are currently no services to display."}
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
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          {service.name}
                          {service.is_featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                        </div>
                        {service.short_description && (
                          <div className="text-slate-500 text-xs mt-1 max-w-[200px] truncate hidden sm:block">
                            {service.short_description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs hidden sm:table-cell">{service.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${service.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{service.display_order}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(service)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(service.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
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
      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-full h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Service" : "Add Service"}</h2>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50 overflow-x-auto">
              <button type="button" onClick={() => setActiveTab("basic")} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "basic" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Basic Info</button>
              <button type="button" onClick={() => setActiveTab("content")} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Content & Images</button>
              <button type="button" onClick={() => setActiveTab("features")} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === "features" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Features & CTA</button>
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
                      <textarea value={formData.short_description || ""} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief summary for the service card..." />
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Full Description (About)</label>
                      <textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6} placeholder="Detailed HTML or Markdown content for the service page..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Image ID (from Media Library)</label>
                        <input type="text" value={formData.image_id || ""} onChange={(e) => setFormData({...formData, image_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="e.g. 550e8400-e29b..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Icon Name (Optional Lucide Icon)</label>
                        <input type="text" value={formData.icon || ""} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Monitor, Database" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Features (One per line)</label>
                      <textarea value={featuresText} onChange={handleFeaturesChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} placeholder="Feature 1&#10;Feature 2" />
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
                    <div className="flex items-center gap-2 mt-4">
                        <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="is_featured" className="block text-sm font-semibold text-slate-700">Mark as Featured Service</label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
                <button type="button" onClick={closeModals} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <div className="flex gap-2">
                  {activeTab !== "features" && (
                    <button type="button" onClick={() => setActiveTab(activeTab === "basic" ? "content" : "features")} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Next Step</button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 shadow-sm">
                    {isSubmitting ? "Saving..." : "Save Service"}
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Service</h3>
              <p className="text-slate-600 text-sm mb-4">
                Are you sure you want to delete this service? This action cannot be undone.
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
                  {isDeleting ? "Deleting..." : "Yes, Delete Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




