"use client";

import { useState, useEffect } from "react";
import { useAdminApi } from "@/lib/admin/use-admin-api";
import type { AboutContent } from "@/lib/types";
import { Loader2, Save } from "lucide-react";
import RevalidateButton from "@/components/admin/RevalidateButton";

export default function AboutAdminPage() {
  const { adminFetch } = useAdminApi();
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<AboutContent>("/about")
      .then(setData)
      .finally(() => setLoading(false));
  }, [adminFetch]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const updated = await adminFetch<AboutContent>("/about", {
        method: "PATCH",
        body: JSON.stringify({
          company_name: data.company_name,
          tagline: data.tagline,
          overview: data.overview,
          founder_name: data.founder_name,
          founder_title: data.founder_title,
          founder_message: data.founder_message,
          mission: data.mission,
          vision: data.vision,
        }),
      });
      setData(updated);
      alert("Saved successfully!");
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>;
  if (!data) return <div>Failed to load.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">About Content</h1>
        <div className="flex gap-3">
          <RevalidateButton tag="about" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded" 
              value={data.company_name} 
              onChange={e => setData({...data, company_name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded" 
              value={data.tagline || ""} 
              onChange={e => setData({...data, tagline: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded h-32" 
            value={data.overview || ""} 
            onChange={e => setData({...data, overview: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded" 
              value={data.founder_name || ""} 
              onChange={e => setData({...data, founder_name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founder Title</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded" 
              value={data.founder_title || ""} 
              onChange={e => setData({...data, founder_title: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Founder Message</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded h-40" 
            value={data.founder_message || ""} 
            onChange={e => setData({...data, founder_message: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded h-32" 
              value={data.mission || ""} 
              onChange={e => setData({...data, mission: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
            <textarea 
              className="w-full p-2 border border-gray-300 rounded h-32" 
              value={data.vision || ""} 
              onChange={e => setData({...data, vision: e.target.value})} 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
