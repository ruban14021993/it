"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Package, X, AlertCircle } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { ProductResponse, ProductCreate, CategoryResponse } from "@/lib/api/admin-types";

export default function AdminProductsPage() {
  const { adminFetch } = useAdminApi();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductCreate>({
    category_id: null,
    name: "",
    slug: "",
    short_description: "",
    description: "",
    hero_image_id: null,
    hero_video_url: null,
    features: [],
    benefits: [],
    use_cases: [],
    cta_text: "",
    cta_url: "",
    is_active: true,
    is_featured: false,
    display_order: 1,
    meta_title: "",
    meta_description: "",
    og_image_id: null
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        adminFetch<ProductResponse[]>("/admin/products"),
        adminFetch<CategoryResponse[]>("/admin/products/categories")
      ]);
      setProducts(prods.sort((a, b) => a.display_order - b.display_order));
      setCategories(cats);
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(err.message);
      else if (err instanceof Error) setError(err.message);
      else setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ 
      category_id: categories.length > 0 ? categories[0].id : null,
      name: "", 
      slug: "", 
      short_description: "",
      description: "",
      hero_image_id: null,
      hero_video_url: null,
      features: [],
      benefits: [],
      use_cases: [],
      cta_text: "",
      cta_url: "",
      is_active: true,
      is_featured: false,
      display_order: products.length + 1,
      meta_title: "",
      meta_description: "",
      og_image_id: null
    });
    setModalError(null);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductResponse) => {
    setEditingId(prod.id);
    setFormData({ 
      category_id: prod.category_id,
      name: prod.name, 
      slug: prod.slug, 
      short_description: prod.short_description || "",
      description: prod.description || "",
      hero_image_id: prod.hero_image_id,
      hero_video_url: prod.hero_video_url,
      features: prod.features || [],
      benefits: prod.benefits || [],
      use_cases: prod.use_cases || [],
      cta_text: prod.cta_text || "",
      cta_url: prod.cta_url || "",
      is_active: prod.is_active,
      is_featured: prod.is_featured,
      display_order: prod.display_order,
      meta_title: prod.meta_title || "",
      meta_description: prod.meta_description || "",
      og_image_id: prod.og_image_id
    });
    setModalError(null);
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteConfirmId(null);
    setDeleteError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload = {
        ...formData,
        category_id: formData.category_id === "" ? null : formData.category_id
      };
      
      if (editingId) {
        await adminFetch(`/admin/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await adminFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) setModalError("Product with this slug already exists.");
        else setModalError(err.message);
      } else if (err instanceof Error) setModalError(err.message);
      else setModalError("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await adminFetch(`/admin/products/${deleteConfirmId}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      loadData();
    } catch (err: unknown) {
      if (err instanceof ApiError) setDeleteError(err.message);
      else if (err instanceof Error) setDeleteError(err.message);
      else setDeleteError("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!editingId) {
      setFormData({ 
        ...formData, 
        name, 
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") 
      });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return "Uncategorized";
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "Unknown Category";
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <AdminPageHeader 
        title="Products" 
        description="Manage website products and solutions."
        action={{ label: "Add Product", icon: Plus, onClick: openCreateModal }}
      />

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            {products.length === 0 && !isLoading ? (
              <AdminEmptyState 
                icon={Package}
                title="No products found."
                description="Get started by creating your first product."
                className="border-0 shadow-none rounded-none"
              />
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 hidden md:table-cell">Slug</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">{prod.name}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-500">{prod.slug}</td>
                      <td className="px-6 py-4 hidden sm:table-cell text-slate-600">{getCategoryName(prod.category_id)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${prod.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {prod.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(prod)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(prod.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-full h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Product" : "Add Product"}</h2>
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
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                        <select value={formData.category_id || ""} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="">Uncategorized</option>
                          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Order</label>
                          <input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                          <select value={formData.is_active ? "true" : "false"} onChange={(e) => setFormData({...formData, is_active: e.target.value === "true"})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Short Description</label>
                      <textarea value={formData.short_description || ""} onChange={(e) => setFormData({...formData, short_description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief summary for the product card..." />
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Full Description (About)</label>
                      <textarea value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6} placeholder="Detailed HTML or Markdown content for the product page..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Image ID (from Media Library)</label>
                        <input type="text" value={formData.hero_image_id || ""} onChange={(e) => setFormData({...formData, hero_image_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="e.g. 550e8400-e29b..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Video URL (Optional)</label>
                        <input type="text" value={formData.hero_video_url || ""} onChange={(e) => setFormData({...formData, hero_video_url: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. https://youtube.com/..." />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Features (One per line)</label>
                        <textarea value={formData.features ? formData.features.join("\n") : ""} onChange={(e) => setFormData({...formData, features: e.target.value.split("\n").filter(Boolean)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} placeholder="Feature 1&#10;Feature 2" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Benefits (One per line)</label>
                        <textarea value={formData.benefits ? formData.benefits.join("\n") : ""} onChange={(e) => setFormData({...formData, benefits: e.target.value.split("\n").filter(Boolean)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} placeholder="Benefit 1&#10;Benefit 2" />
                      </div>
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
                        <label htmlFor="is_featured" className="block text-sm font-semibold text-slate-700">Mark as Featured Product</label>
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
                    {isSubmitting ? "Saving..." : "Save Product"}
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product</h3>
              <p className="text-slate-600 text-sm mb-4">
                Are you sure you want to delete this product? This action cannot be undone.
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
                  {isDeleting ? "Deleting..." : "Yes, Delete Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


