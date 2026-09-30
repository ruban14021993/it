"use client";

import { useEffect, useState, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { MessageSquare, Eye, Trash2, X, Check, Clock, Archive } from "lucide-react";
import { useAdminApi, ApiError } from "@/lib/admin/use-admin-api";
import { EnquiryResponse } from "@/lib/api/admin-types";

export default function AdminEnquiries() {
  const { adminFetch } = useAdminApi();
  const [data, setData] = useState<EnquiryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail / Status Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryResponse | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminFetch<EnquiryResponse[]>("/admin/enquiries");
      setData(res || []);
    } catch (err: unknown) {
      console.error("Failed to load enquiries", err);
      setError((err as Error).message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  const closeModals = () => {
    setSelectedEnquiry(null);
    setDeleteConfirmId(null);
    setStatusError(null);
    setDeleteError(null);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const updated = await adminFetch<EnquiryResponse>(`/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setSelectedEnquiry(updated);
      loadData();
    } catch (err: unknown) {
      console.error("Status update failed", err);
      setStatusError((err as Error).message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await adminFetch(`/admin/enquiries/${deleteConfirmId}`, {
        method: "DELETE"
      });
      closeModals();
      loadData();
    } catch (err: unknown) {
      console.error("Delete failed", err);
      if (err instanceof ApiError && err.status === 404) {
        setDeleteError("Enquiry not found.");
      } else {
        setDeleteError((err as Error).message || "Failed to delete enquiry");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "new" || s === "unread") return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">New</span>;
    if (s === "read" || s === "reviewed") return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium">Read</span>;
    if (s === "archived") return <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium">Archived</span>;
    return <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium">{status}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <AdminPageHeader 
        title="Enquiries" 
        description="View and manage messages submitted via the contact form."
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          Error loading: {error}
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading enquiries...
        </div>
      ) : data.length === 0 ? (
        <AdminEmptyState 
          icon={MessageSquare}
          title="No enquiries have been received yet."
          description="When users submit the contact form, their messages will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4 hidden md:table-cell">Message Preview</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((enquiry) => (
                  <tr key={enquiry.id} className={`hover:bg-slate-50 transition-colors group ${enquiry.status.toLowerCase() === 'new' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{enquiry.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{enquiry.email}</div>
                      {enquiry.phone && <div className="text-slate-500 text-xs">{enquiry.phone}</div>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-600">
                      <div className="truncate max-w-xs xl:max-w-md">{enquiry.message}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enquiry.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs hidden sm:table-cell">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedEnquiry(enquiry)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-white border border-slate-200 hover:border-blue-200 shadow-sm transition-colors" title="View Detail">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(enquiry.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-white border border-slate-200 hover:border-red-200 shadow-sm transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL / STATUS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Enquiry Detail
                {getStatusBadge(selectedEnquiry.status)}
              </h2>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {statusError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                  {statusError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-slate-500 font-semibold mb-1">From</div>
                  <div className="font-medium text-slate-900">{selectedEnquiry.name}</div>
                  <div className="text-slate-600">{selectedEnquiry.email}</div>
                  {selectedEnquiry.phone && <div className="text-slate-600">{selectedEnquiry.phone}</div>}
                </div>
                <div>
                  <div className="text-slate-500 font-semibold mb-1">Submitted</div>
                  <div className="text-slate-900">{new Date(selectedEnquiry.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold mb-2 text-sm">Message</div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl whitespace-pre-wrap text-slate-800 text-sm">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Update Status:</span>
                <button 
                  onClick={() => handleUpdateStatus("New")}
                  disabled={isUpdatingStatus || selectedEnquiry.status.toLowerCase() === "new"}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 flex items-center gap-1"
                >
                  <Clock size={14} /> New
                </button>
                <button 
                  onClick={() => handleUpdateStatus("Read")}
                  disabled={isUpdatingStatus || selectedEnquiry.status.toLowerCase() === "read"}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 flex items-center gap-1"
                >
                  <Check size={14} /> Read
                </button>
                <button 
                  onClick={() => handleUpdateStatus("Archived")}
                  disabled={isUpdatingStatus || selectedEnquiry.status.toLowerCase() === "archived"}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 flex items-center gap-1"
                >
                  <Archive size={14} /> Archived
                </button>
              </div>
              <button 
                onClick={closeModals}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Enquiry</h3>
              <p className="text-slate-600 text-sm mb-4">
                Are you sure you want to delete this enquiry? This action cannot be undone.
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
                  {isDeleting ? "Deleting..." : "Yes, Delete Enquiry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
