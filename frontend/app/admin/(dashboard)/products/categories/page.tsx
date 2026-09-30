"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Edit, Trash2, Folder, X, AlertCircle } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { CategoryResponse, CategoryCreate, ProductResponse } from "@/lib/api/admin-types";

export default function AdminCategoriesPage() {
  const { adminFetch } = useAdminApi();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CategoryCreate>({
    name: "",
    slug: "",
    description: "",
    display_order: 1,
    is_active: true
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [cats, prods] = await Promise.all([
        adminFetch<CategoryResponse[]>("/admin/products/categories"),
        adminFetch<ProductResponse[]>("/admin/products")
      ]);
      setCategories(cats.sort((a, b) => a.display_order - b.display_order));
      
      const counts: Record<string, number> = {};
      prods.forEach(p => {
        if (p.category_id) {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1;
        }
      });
      setProductCounts(counts);
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(err.message);
      else if (err instanceof Error) setError(err.message);
      else setError("Failed to load categories.");
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
    setFormData({ name: "", slug: "", description: "", display_order: categories.length + 1, is_active: true });
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryResponse) => {
    setEditingId(cat.id);
    setFormData({ 
      name: cat.name, 
      slug: cat.slug, 
      description: cat.description || "", 
      display_order: cat.display_order, 
      is_active: cat.is_active 
    });
    setModalError(null);
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
      if (editingId) {
        await adminFetch(`/admin/products/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(formData)
        });
      } else {
        await adminFetch("/admin/products/categories", {
          method: "POST",
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) setModalError("Category with this slug already exists.");
        else setModalError(err.message);
      } else if (err instanceof Error) setModalError(err.message);
      else setModalError("Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await adminFetch(`/admin/products/categories/${deleteConfirmId}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      loadData();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setDeleteError("Cannot delete category. There are products still assigned to it.");
        } else {
          setDeleteError(err.message);
        }
      } else if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError("Failed to delete category.");
      }
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

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <AdminPageHeader 
        title="Product Categories" 
        description="Manage the categories that group your products."
        action={{ label: "Add Category", icon: Plus, onClick: openCreateModal }}
      />

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            {categories.length === 0 && !isLoading ? (
              <AdminEmptyState 
                icon={Folder}
                title="No product categories found."
                description="Get started by creating your first product category."
                className="border-0 shadow-none rounded-none"
              />
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 hidden md:table-cell">Slug</th>
                    <th className="px-6 py-4">Products</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-slate-500">{cat.slug}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {productCounts[cat.id] || 0} items
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${cat.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(cat)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Category" : "Add Category"}</h2>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col overflow-y-auto">
              <div className="p-6 space-y-4 flex-1">
                {modalError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {modalError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Slug *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description || ""} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                    <input 
                      type="number" 
                      value={formData.display_order} 
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <select 
                      value={formData.is_active ? "true" : "false"}
                      onChange={(e) => setFormData({...formData, is_active: e.target.value === "true"})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : "Save Category"}
                </button>
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Category</h3>
              <p className="text-slate-600 text-sm mb-4">
                Are you sure you want to delete this category? This action cannot be undone. 
                Category deletion will be blocked if any products are still assigned to it.
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
                  {isDeleting ? "Deleting..." : "Yes, Delete Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


