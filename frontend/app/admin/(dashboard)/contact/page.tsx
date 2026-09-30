"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Save, Plus, Edit, Trash2, MapPin, X } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { ContactResponse, ContactUpdate, BranchResponse, BranchCreate } from "@/lib/api/admin-types";

export default function AdminContact() {
  const { adminFetch } = useAdminApi();
  
  const [data, setData] = useState<ContactResponse | null>(null);
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settings Form State
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<ContactUpdate>({});

  // Branch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const defaultBranch: BranchCreate = {
    name: "",
    address: "",
    phone: "",
    email: "",
    display_order: 1,
    is_active: true
  };
  const [branchData, setBranchData] = useState<BranchCreate>(defaultBranch);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contactRes, branchesRes] = await Promise.all([
        adminFetch<ContactResponse>("/admin/contact"),
        adminFetch<BranchResponse[]>("/admin/contact/branches")
      ]);
      
      setData(contactRes);
      setFormData({
        primary_email: contactRes.primary_email || "",
        hr_email: contactRes.hr_email || "",
        primary_phone: contactRes.primary_phone || "",
        secondary_phone: contactRes.secondary_phone || "",
        contact_form_enabled: contactRes.contact_form_enabled,
        contact_form_recipient: contactRes.contact_form_recipient || "",
        business_hours: contactRes.business_hours || ""
      });
      
      setBranches(branchesRes || []);
    } catch (err: unknown) {
      console.error("Failed to load contact data", err);
      setError((err as Error).message || "Failed to load contact data");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  // Handle Contact Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await adminFetch("/admin/contact", {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadData();
    } catch (err: unknown) {
      console.error("Save failed", err);
      setError((err as Error).message || "Failed to save contact settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Branch Handlers
  const openAddModal = () => {
    setEditingId(null);
    setBranchData(defaultBranch);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BranchResponse) => {
    setEditingId(b.id);
    setBranchData({
      name: b.name,
      address: b.address || "",
      phone: b.phone || "",
      email: b.email || "",
      display_order: b.display_order,
      is_active: b.is_active
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteConfirmId(null);
    setModalError(null);
    setDeleteError(null);
  };

  const handleBranchSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBranch(true);
    setModalError(null);

    const payload = { ...branchData };
    if (!payload.address) payload.address = null;
    if (!payload.phone) payload.phone = null;
    if (!payload.email) payload.email = null;

    try {
      if (editingId) {
        await adminFetch(`/admin/contact/branches/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await adminFetch("/admin/contact/branches", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Branch save failed", err);
      if (err instanceof ApiError && err.status === 409) {
        setModalError("A conflict occurred (e.g., duplicate).");
      } else {
        setModalError((err as Error).message || "Failed to save branch");
      }
    } finally {
      setIsSubmittingBranch(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await adminFetch(`/admin/contact/branches/${deleteConfirmId}`, {
        method: "DELETE"
      });
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Delete failed", err);
      if (err instanceof ApiError && err.status === 409) {
        setDeleteError("Cannot delete branch. Check dependencies.");
      } else if (err instanceof ApiError && err.status === 404) {
        setDeleteError("Branch not found.");
      } else {
        setDeleteError((err as Error).message || "Failed to delete branch");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <AdminPageHeader 
        title="Contact & Branches" 
        description="Manage contact information, forms, and physical branch locations."
      />

      {error && !data && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Error loading: {error}
        </div>
      )}

      {loading && !data ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading content...
        </div>
      ) : data ? (
        <>
          {/* Settings Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Global Contact Settings</h2>
            </div>
            <form onSubmit={handleSaveSettings} className="flex flex-col">
              <div className="p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
                    Settings saved successfully!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Email</label>
                    <input 
                      type="email" 
                      value={formData.primary_email || ""} 
                      onChange={(e) => setFormData({...formData, primary_email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">HR Email</label>
                    <input 
                      type="email" 
                      value={formData.hr_email || ""} 
                      onChange={(e) => setFormData({...formData, hr_email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Phone</label>
                    <input 
                      type="text" 
                      value={formData.primary_phone || ""} 
                      onChange={(e) => setFormData({...formData, primary_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Secondary Phone</label>
                    <input 
                      type="text" 
                      value={formData.secondary_phone || ""} 
                      onChange={(e) => setFormData({...formData, secondary_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Business Hours</label>
                    <input 
                      type="text" 
                      value={formData.business_hours || ""} 
                      onChange={(e) => setFormData({...formData, business_hours: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-md font-bold text-slate-900 mb-4">Contact Form Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Form Recipient Email</label>
                      <input 
                        type="email" 
                        value={formData.contact_form_recipient || ""} 
                        onChange={(e) => setFormData({...formData, contact_form_recipient: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.contact_form_enabled || false} 
                          onChange={(e) => setFormData({...formData, contact_form_enabled: e.target.checked})}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        Enable Contact Form
                      </label>
                    </div>
                  </div>
                </div>

              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                >
                  <Save size={16} />
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </section>

          {/* Branches Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Branches</h2>
              <button onClick={openAddModal} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} /> Add Branch
              </button>
            </div>
            
            <div className="overflow-x-auto min-h-[200px]">
              {branches.length === 0 ? (
                <AdminEmptyState 
                  icon={MapPin}
                  title="No Branches Found"
                  description="There are currently no physical branches listed."
                  className="border-0 shadow-none rounded-none"
                />
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 hidden md:table-cell">Order</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{b.name}</div>
                          {b.address && <div className="text-slate-500 text-xs mt-1 max-w-[200px] truncate">{b.address}</div>}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {b.phone && <div>{b.phone}</div>}
                          {b.email && <div>{b.email}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${b.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {b.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{b.display_order}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(b)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="Edit">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirmId(b.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
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
          </section>

          {/* BRANCH CREATE/EDIT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Branch" : "Add Branch"}</h2>
                  <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleBranchSave} className="flex flex-col overflow-y-auto">
                  <div className="p-6 space-y-4 flex-1">
                    {modalError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                        {modalError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                        <input 
                          required 
                          type="text" 
                          value={branchData.name} 
                          onChange={(e) => setBranchData({...branchData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                        <textarea 
                          value={branchData.address || ""} 
                          onChange={(e) => setBranchData({...branchData, address: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                        <input 
                          type="text" 
                          value={branchData.phone || ""} 
                          onChange={(e) => setBranchData({...branchData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={branchData.email || ""} 
                          onChange={(e) => setBranchData({...branchData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                        <input 
                          type="number" 
                          value={branchData.display_order} 
                          onChange={(e) => setBranchData({...branchData, display_order: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                        <select 
                          value={branchData.is_active ? "true" : "false"}
                          onChange={(e) => setBranchData({...branchData, is_active: e.target.value === "true"})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2 shrink-0">
                    <button 
                      type="button" 
                      onClick={closeModals}
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmittingBranch}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSubmittingBranch ? "Saving..." : "Save Branch"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DELETE BRANCH CONFIRM MODAL */}
          {deleteConfirmId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Branch</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Are you sure you want to delete this branch? This action cannot be undone.
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
                      onClick={handleDeleteBranch}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-70 flex items-center gap-2"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete Branch"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
