"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function RevalidateButton({ tag, label }: { tag: string, label?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRevalidate = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`/api/revalidate?secret=revalidate-secret-change-in-production`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRevalidate}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
    >
      <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
      {success ? "Published!" : label || `Publish changes`}
    </button>
  );
}
