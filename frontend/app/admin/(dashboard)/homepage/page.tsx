"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { 
  Save, 
  Smartphone, 
  Monitor, 
  Film, 
  ImageIcon, 
  Check, 
  X, 
  Sparkles, 
  ArrowRight,
  Eye,
  Trash2
} from "lucide-react";
import { useAdminApi } from "@/lib/admin/use-admin-api";
import { HomepageResponse, HomepageUpdate } from "@/lib/api/admin-types";
import { mediaUrl } from "@/lib/utils";
import Image from "next/image";

interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  media_type: string;
  mime_type?: string;
  file_size?: number;
}

export default function AdminHomepage() {
  const { adminFetch } = useAdminApi();
  const [data, setData] = useState<HomepageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<"all" | "video" | "image">("all");

  // Preview state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

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

      // Load media assets
      try {
        const mediaRes = await adminFetch<MediaAsset[]>("/admin/media");
        setMediaList(mediaRes);
      } catch (mErr) {
        console.warn("Could not load media list for homepage selector", mErr);
      }
    } catch (err: unknown) {
      console.error("Failed to load homepage", err);
      setError((err as Error).message || "Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadData();
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

  const selectedMedia = mediaList.find((m) => m.id === formData.image_id);
  const filteredMediaList = mediaList.filter((m) => {
    if (mediaFilter === "video") return m.media_type === "video";
    if (mediaFilter === "image") return m.media_type === "image";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-16">
      <AdminPageHeader 
        title="Homepage Content & Hero Showcase" 
        description="Manage the main hero section, typography, CTA links, and right-side advertisement visual (video/image) across Desktop and Mobile views."
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
        <div className="space-y-8">
          {/* Main Edit Form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 flex items-center gap-2">
                  <Check size={16} /> Homepage content saved successfully!
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Eyebrow Tagline</label>
                  <input 
                    type="text" 
                    value={formData.eyebrow || ""} 
                    onChange={(e) => setFormData({...formData, eyebrow: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Innovative Technology Solutions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Heading *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.heading || ""} 
                    onChange={(e) => setFormData({...formData, heading: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" 
                    placeholder="e.g. Infinity Mind Tech"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description || ""} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows={3}
                    placeholder="Empowering AI, Cloud, and Blockchain Innovation..."
                  />
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Primary CTA Text</label>
                    <input 
                      type="text" 
                      value={formData.primary_cta_text || ""} 
                      onChange={(e) => setFormData({...formData, primary_cta_text: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="e.g. Explore Products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Primary CTA URL</label>
                    <input 
                      type="text" 
                      value={formData.primary_cta_url || ""} 
                      onChange={(e) => setFormData({...formData, primary_cta_url: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="/products"
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
                      placeholder="e.g. Contact Us"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Secondary CTA URL</label>
                    <input 
                      type="text" 
                      value={formData.secondary_cta_url || ""} 
                      onChange={(e) => setFormData({...formData, secondary_cta_url: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="/contact"
                    />
                  </div>
                </div>

                {/* Hero Advertisement Visual Setting */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800">
                        Right-Side Advertisement Media (Video / Image)
                      </label>
                      <p className="text-xs text-slate-500">
                        This video or image is featured prominently on desktop (right side) and mobile view (responsive 16:9 showcase).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMediaModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors w-fit"
                    >
                      <Film size={14} />
                      Choose from Media Library
                    </button>
                  </div>

                  {/* Selected Media Display Card */}
                  {selectedMedia ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-full sm:w-48 aspect-video bg-black rounded-lg overflow-hidden border border-slate-300 flex-shrink-0">
                        {selectedMedia.media_type === "video" ? (
                          <video 
                            src={mediaUrl(selectedMedia.storage_path)} 
                            className="w-full h-full object-cover" 
                            muted 
                            loop 
                            autoPlay 
                            playsInline 
                          />
                        ) : (
                          <Image 
                            src={mediaUrl(selectedMedia.storage_path)} 
                            alt={selectedMedia.filename} 
                            fill 
                            className="object-cover" 
                          />
                        )}
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-black/75 text-white">
                          {selectedMedia.media_type}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 w-full space-y-1">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {selectedMedia.filename}
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate">
                          ID: {selectedMedia.id}
                        </div>
                        <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <Check size={12} /> Active on Desktop & Mobile View
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setMediaModalOpen(true)}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image_id: ""})}
                          className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                        <Film size={20} />
                      </div>
                      <div className="text-sm font-medium text-slate-700">No Hero Media Selected</div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Select a video or promotional image from your Media Library to showcase your technology in the hero section.
                      </p>
                      <button
                        type="button"
                        onClick={() => setMediaModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Film size={14} />
                        Select Media
                      </button>
                    </div>
                  )}

                  {/* Manual ID Input (Fallback / Power User) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Hero Media Asset ID (UUID)
                    </label>
                    <input 
                      type="text" 
                      value={formData.image_id || ""} 
                      onChange={(e) => setFormData({...formData, image_id: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-600 bg-slate-50" 
                      placeholder="e.g. 141e06b9-3f9d-4fac-b64c-14659ae7bbcc"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_active || false} 
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    Hero Section is Active
                  </label>
                </div>

              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0a82bd] to-[#00a56f] rounded-lg hover:from-[#086a9a] hover:to-[#008257] disabled:opacity-70 flex items-center gap-2 shadow-sm transition-all"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Interactive Live Preview (Desktop & Mobile Modes) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Eye size={18} className="text-[#0a82bd]" />
                  Live Hero Section Preview
                </h3>
                <p className="text-xs text-slate-500">
                  Switch between Desktop and Mobile preview to see how the advertisement video and content adapt.
                </p>
              </div>

              {/* Device Toggle Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewDevice === "desktop"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Monitor size={14} />
                  Desktop View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewDevice === "mobile"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone size={14} />
                  Mobile View
                </button>
              </div>
            </div>

            {/* Desktop Preview Frame */}
            {previewDevice === "desktop" ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-6 sm:p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {formData.eyebrow && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a82bd] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        <Sparkles size={11} /> {formData.eyebrow}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                      {formData.heading || "Your Heading"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {formData.description || "Your description text..."}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <span className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#0a82bd] to-[#00a56f] rounded-lg">
                        {formData.primary_cta_text || "Primary Button"}
                      </span>
                      {formData.secondary_cta_text && (
                        <span className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg">
                          {formData.secondary_cta_text}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Side Visual Showcase */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950">
                    {selectedMedia ? (
                      selectedMedia.media_type === "video" ? (
                        <video 
                          src={mediaUrl(selectedMedia.storage_path)} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Image 
                          src={mediaUrl(selectedMedia.storage_path)} 
                          alt="Hero Image" 
                          fill 
                          className="object-cover" 
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Default Graphic Fallback
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
                      ● Featured Showcase
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Preview Frame */
              <div className="flex justify-center py-4 bg-slate-100 rounded-xl p-4">
                <div className="w-[340px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800">
                  {/* Dynamic Notch */}
                  <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
                  
                  {/* Mobile Screen Content */}
                  <div className="bg-slate-50 rounded-[28px] p-5 space-y-4 overflow-hidden border border-slate-200/50">
                    {formData.eyebrow && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#0a82bd] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        <Sparkles size={10} /> {formData.eyebrow}
                      </span>
                    )}

                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {formData.heading || "Your Heading"}
                    </h3>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {formData.description || "Your description text..."}
                    </p>

                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-2 text-[11px] font-semibold text-white bg-gradient-to-r from-[#0a82bd] to-[#00a56f] rounded-lg text-center shadow-sm">
                        {formData.primary_cta_text || "Explore Products"}
                      </span>
                      {formData.secondary_cta_text && (
                        <span className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg text-center">
                          {formData.secondary_cta_text}
                        </span>
                      )}
                    </div>

                    {/* Mobile Advertisement Visual Card */}
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-slate-950 mt-2">
                      {selectedMedia ? (
                        selectedMedia.media_type === "video" ? (
                          <video 
                            src={mediaUrl(selectedMedia.storage_path)} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Image 
                            src={mediaUrl(selectedMedia.storage_path)} 
                            alt="Hero Image" 
                            fill 
                            className="object-cover" 
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                          Interactive Fallback Graphic
                        </div>
                      )}

                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-medium border border-white/10">
                        ● Featured Showcase
                      </div>
                    </div>

                    <div className="text-[9px] text-center text-slate-400 pt-1">
                      📱 Mobile View Preview
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Media Selector Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Film size={18} className="text-[#0a82bd]" />
                  Select Media for Hero Advertisement
                </h3>
                <p className="text-xs text-slate-500">
                  Click on any video or image to set it as the hero showcase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 pt-3 flex gap-2 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setMediaFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  mediaFilter === "all" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Media ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter("video")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  mediaFilter === "video" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Film size={12} /> Videos ({mediaList.filter(m => m.media_type === "video").length})
              </button>
              <button
                type="button"
                onClick={() => setMediaFilter("image")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  mediaFilter === "image" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ImageIcon size={12} /> Images ({mediaList.filter(m => m.media_type === "image").length})
              </button>
            </div>

            {/* Media Grid */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredMediaList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                  No media items found for this filter.
                </div>
              ) : (
                filteredMediaList.map((asset) => {
                  const isSelected = formData.image_id === asset.id;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, image_id: asset.id});
                        setMediaModalOpen(false);
                      }}
                      className={`group relative text-left rounded-xl overflow-hidden border-2 transition-all p-1 flex flex-col ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20" 
                          : "border-slate-200 hover:border-blue-400 hover:shadow-sm bg-white"
                      }`}
                    >
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900 mb-2">
                        {asset.media_type === "video" ? (
                          <video 
                            src={mediaUrl(asset.storage_path)} 
                            className="w-full h-full object-cover" 
                            muted 
                            playsInline 
                          />
                        ) : (
                          <Image 
                            src={mediaUrl(asset.storage_path)} 
                            alt={asset.filename} 
                            fill 
                            className="object-cover" 
                          />
                        )}

                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white">
                          {asset.media_type}
                        </span>

                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 p-1 rounded-full bg-blue-600 text-white shadow-md">
                            <Check size={12} />
                          </span>
                        )}
                      </div>

                      <div className="px-1 pb-1">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {asset.filename}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {asset.id}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
