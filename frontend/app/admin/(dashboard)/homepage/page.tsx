"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Save } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { HomepageResponse, HomepageUpdate } from "@/lib/api/admin-types";

export default function AdminHomepage() {
  const { adminFetch } = useAdminApi();
  const [data, setData] = useState<HomepageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState<HomepageUpdate>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetch<HomepageResponse>("/admin/homepage");
      setData(res);
      setFormData({
        eyebrow: res.eyebrow || "",
        heading: res.heading,
        description: res.description || "",
        primary_cta_text: res.primary_cta_text || "",
        primary_cta_url: res.primary_cta_url || "",
        secondary_cta_text: res.secondary_cta_text || "",
        secondary_cta_url: res.secondary_cta_url || "",
        image_id: res.image_id || "",
        is_active: res.is_active,
      });
    } catch (err: unknown) {
      console.error("Failed to load homepage", err);
      setError((err as Error).message || "Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await adminFetch("/admin/homepage", {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadData();
    } catch (err: unknown) {
      console.error("Save failed", err);
      setError((err as Error).message || "Failed to save homepage content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <AdminPageHeader 
        title="Homepage Content" 
        description="Manage the main hero section of the website."
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
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
                Homepage content saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Eyebrow Text</label>
                <input 
                  type="text" 
                  value={formData.eyebrow || ""} 
                  onChange={(e) => setFormData({...formData, eyebrow: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Welcome to InfinityMind Tech"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Heading *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.heading || ""} 
                  onChange={(e) => setFormData({...formData, heading: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Primary CTA Text</label>
                  <input 
                    type="text" 
                    value={formData.primary_cta_text || ""} 
                    onChange={(e) => setFormData({...formData, primary_cta_text: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Primary CTA URL</label>
                  <input 
                    type="text" 
                    value={formData.primary_cta_url || ""} 
                    onChange={(e) => setFormData({...formData, primary_cta_url: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Secondary CTA Text</label>
                  <input 
                    type="text" 
                    value={formData.secondary_cta_text || ""} 
                    onChange={(e) => setFormData({...formData, secondary_cta_text: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Secondary CTA URL</label>
                  <input 
                    type="text" 
                    value={formData.secondary_cta_url || ""} 
                    onChange={(e) => setFormData({...formData, secondary_cta_url: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Image ID</label>
                <input 
                  type="text" 
                  value={formData.image_id || ""} 
                  onChange={(e) => setFormData({...formData, image_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                  placeholder="Paste Image ID from Media Library"
                />
                <p className="text-xs text-slate-500 mt-1">Upload an image in the Media Library, click 'Copy ID', and paste it here.</p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_active || false} 
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Section is Active
                </label>
              </div>

            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
