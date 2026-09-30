"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Save } from "lucide-react";
import { useAdminApi } from "@/lib/admin/use-admin-api";
import { AboutResponse, AboutUpdate } from "@/lib/api/admin-types";

export default function AdminAbout() {
  const { adminFetch } = useAdminApi();
  const [data, setData] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState<AboutUpdate>({});
  const [commitmentStr, setCommitmentStr] = useState("");
  const [whyChooseStr, setWhyChooseStr] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetch<AboutResponse>("/admin/about");
      setData(res);
      setFormData({
        company_name: res.company_name,
        tagline: res.tagline || "",
        overview: res.overview || "",
        founder_name: res.founder_name || "",
        founder_title: res.founder_title || "",
        founder_message: res.founder_message || "",
        founded_year: res.founded_year ?? null,
        mission: res.mission || "",
        vision: res.vision || "",
        future_vision: res.future_vision || "",
        values: res.values || "",
      });
      setCommitmentStr((res.commitment_items || []).join("\n"));
      setWhyChooseStr((res.why_choose_items || []).join("\n"));
    } catch (err: unknown) {
      console.error("Failed to load about", err);
      setError((err as Error).message || "Failed to load about content");
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

    const payload = {
      ...formData,
      commitment_items: commitmentStr.split("\n").map(s => s.trim()).filter(Boolean),
      why_choose_items: whyChooseStr.split("\n").map(s => s.trim()).filter(Boolean),
    };

    try {
      await adminFetch("/admin/about", {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadData();
    } catch (err: unknown) {
      console.error("Save failed", err);
      setError((err as Error).message || "Failed to save about content");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <AdminPageHeader 
        title="About Us Content" 
        description="Manage the company information and about page."
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
          <div className="p-6 space-y-8">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
                About content saved successfully!
              </div>
            )}

            {/* Core Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Core Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.company_name || ""} 
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Founded Year</label>
                  <input 
                    type="number" 
                    value={formData.founded_year || ""} 
                    onChange={(e) => setFormData({...formData, founded_year: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline || ""} 
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Overview</label>
                  <textarea 
                    value={formData.overview || ""} 
                    onChange={(e) => setFormData({...formData, overview: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Founder Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Founder Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Founder Name</label>
                  <input 
                    type="text" 
                    value={formData.founder_name || ""} 
                    onChange={(e) => setFormData({...formData, founder_name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Founder Title</label>
                  <input 
                    type="text" 
                    value={formData.founder_title || ""} 
                    onChange={(e) => setFormData({...formData, founder_title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Founder Message</label>
                  <textarea 
                    value={formData.founder_message || ""} 
                    onChange={(e) => setFormData({...formData, founder_message: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Vision, Mission & Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mission</label>
                  <textarea 
                    value={formData.mission || ""} 
                    onChange={(e) => setFormData({...formData, mission: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vision</label>
                  <textarea 
                    value={formData.vision || ""} 
                    onChange={(e) => setFormData({...formData, vision: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Future Vision</label>
                  <textarea 
                    value={formData.future_vision || ""} 
                    onChange={(e) => setFormData({...formData, future_vision: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Values</label>
                  <textarea 
                    value={formData.values || ""} 
                    onChange={(e) => setFormData({...formData, values: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Lists */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Lists (One per line)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Commitment Items</label>
                  <textarea 
                    value={commitmentStr} 
                    onChange={(e) => setCommitmentStr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Why Choose Us Items</label>
                  <textarea 
                    value={whyChooseStr} 
                    onChange={(e) => setWhyChooseStr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={5}
                  />
                </div>
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

