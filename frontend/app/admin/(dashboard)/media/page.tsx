"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminApi } from "@/lib/admin/use-admin-api";
import type { MediaRef } from "@/lib/types";
import { mediaUrl } from "@/lib/utils";
import Image from "next/image";
import { Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function MediaLibraryPage() {
  const { adminFetch } = useAdminApi();
  const [media, setMedia] = useState<MediaRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchMedia = useCallback(() => {
    return adminFetch<MediaRef[]>("/media")
      .then(setMedia)
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  }, [adminFetch]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { token } = await import("@/lib/admin/auth-context").then(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        return { token };
      });
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/admin/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) throw new Error(await res.text());
      await fetchMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media? It may be in use.")) return;
    try {
      await adminFetch(`/media/${id}`, { method: "DELETE" });
      setMedia(media.filter(mediaItem => mediaItem.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
        <div>
          <input
            type="file"
            id="media-upload"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label
            htmlFor="media-upload"
            className={`flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md cursor-pointer hover:bg-slate-800 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload File"}
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {media.map((m) => (
          <div key={m.id} className="border rounded-lg overflow-hidden group relative bg-slate-50">
            <div className="aspect-square relative flex items-center justify-center p-4">
              {m.media_type.startsWith("image/") ? (
                <Image
                  src={mediaUrl(m.storage_path)}
                  alt={m.alt_text || m.filename}
                  fill
                  className="object-contain"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <div className="p-3 bg-white border-t text-sm">
              <p className="truncate font-medium text-slate-700" title={m.filename}>{m.filename}</p>
              <p className="text-slate-500 text-xs">{(0).toFixed(1)} KB</p>
            </div>
            
            <button
              onClick={() => handleDelete(m.id)}
              className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="Delete media"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No media files uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
