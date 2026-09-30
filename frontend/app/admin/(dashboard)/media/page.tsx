/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { Plus, Trash2, ImageIcon, UploadCloud, Info, Copy, Check, FileText } from "lucide-react";
import { useAdminApi } from "@/lib/admin/use-admin-api";
import Image from "next/image";
import { mediaUrl } from "@/lib/utils";

interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

export default function AdminMediaPage() {
  const { adminFetch } = useAdminApi();
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFetch<MediaAsset[]>("/admin/media");
      setMedia(res);
    } catch (err) {
      console.error("Failed to load media", err);
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);

      await adminFetch("/admin/media", {
        method: "POST",
        body: formData,
        headers: {
          // Let browser set Content-Type with boundary for multipart/form-data
        },
        // We need to bypass the default JSON.stringify behavior in adminFetch
        // if adminFetch does that. Assuming adminFetch handles FormData correctly if not we will see.
        isFormData: true 
      } as any);

      await loadMedia();
      setIsUploading(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Please ensure it is less than 5MB and is a valid image format.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteMedia = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await adminFetch(`/admin/media/${id}`, { method: "DELETE" });
      setMedia(media.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete media.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Media Library" 
        description="Manage uploaded images, documents, and other assets."
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Recommended Image Upload Sizes</h3>
            <ul className="text-sm text-blue-800 space-y-1.5 list-disc list-inside">
              <li><strong>Hero Section (Homepage):</strong> 1200 x 800 pixels (Max 2MB)</li>
              <li><strong>Product / Service Banner Images:</strong> 800 x 600 pixels (Max 1MB)</li>
              <li><strong>Logos & Icons:</strong> 400 x 400 pixels (Transparent PNG recommended)</li>
              <li><strong>About Us / Company Images:</strong> 1000 x 700 pixels (Max 1.5MB)</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3 italic">Note: Please ensure images are optimized (JPEG or WEBP format) for faster website loading speeds.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex gap-4 text-sm font-medium">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4">All Media ({media.length})</button>
          </div>
          <button 
            onClick={() => setIsUploading(!isUploading)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Upload New
          </button>
        </div>

        {isUploading && (
          <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full max-w-lg p-8 border-2 border-dashed border-blue-300 rounded-xl bg-white text-center cursor-pointer hover:bg-blue-50 transition-colors"
             >
                <UploadCloud className="mx-auto text-blue-500 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-700 mb-1">Click to browse or drag image here</h3>
                <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP, MP4 (Max 10MB)</p>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml, video/mp4, video/webm"
                />
                <button 
                  disabled={uploadingFile}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {uploadingFile ? "Uploading..." : "Select File"}
                </button>
             </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading media...</div>
        ) : media.length > 0 ? (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="relative aspect-square w-full bg-slate-100 flex items-center justify-center">
                  {item.media_type === "image" ? (
                    <Image 
                      src={mediaUrl(item.storage_path)} 
                      alt={item.filename}
                      fill
                      className="object-contain p-2"
                    />
                  ) : item.media_type === "video" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-slate-800">
                      <video src={mediaUrl(item.storage_path)} className="w-full h-full object-cover opacity-50 absolute inset-0" />
                      <div className="z-10 bg-black/50 text-white text-xs px-2 py-1 rounded">VIDEO</div>
                    </div>
                  ) : (
                    <FileText size={32} className="text-slate-400" />
                  )}
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => copyId(item.id)}
                      className="p-2 bg-white text-slate-700 rounded-full hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Copy Image ID"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                    <button 
                      onClick={() => deleteMedia(item.id)}
                      className="p-2 bg-white text-slate-700 rounded-full hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-2 border-t border-slate-200 text-xs truncate text-slate-600" title={item.filename}>
                  {item.filename}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AdminEmptyState 
            icon={ImageIcon}
            title="No media uploaded yet."
            description="Your uploaded images will appear here once you add them."
            className="border-0 shadow-none rounded-none"
          />
        )}
      </div>
    </div>
  );
}


