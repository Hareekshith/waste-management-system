'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ShieldAlert,
  Lock,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  Trash2,
  Edit3,
  Download,
  RefreshCw,
  X,
  Check,
  UserCheck,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  LogIn,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint, SystemStats, ComplaintStatus } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals
  const [statusModalItem, setStatusModalItem] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Pending');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [deleteModalItem, setDeleteModalItem] = useState<Complaint | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Authenticate & load data ONLY if authorized
  useEffect(() => {
    async function checkAuthAndLoad() {
      setCheckingAuth(true);
      try {
        const userRes = await fetch('/api/auth/me').then((r) => r.json());
        if (userRes.success && userRes.user && userRes.user.role === 'admin') {
          setUser(userRes.user);
          // Authorized! Now load sensitive municipal operational data
          await loadMunicipalData();
        } else {
          setUser(userRes.user || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuthAndLoad();
  }, []);

  const loadMunicipalData = async () => {
    setLoading(true);
    try {
      const [compRes, statRes] = await Promise.all([
        fetch('/api/complaints').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ]);

      if (compRes.success) {
        setComplaints(compRes.complaints || []);
      }
      if (statRes.success) {
        setStats(statRes.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalItem) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/complaints/${statusModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminRemarks: adminRemarks.trim() || undefined,
        }),
      });

      const data = await res.json();
      setIsUpdating(false);

      if (data.success && data.complaint) {
        setComplaints(complaints.map((c) => (c.id === statusModalItem.id ? data.complaint : c)));
        setStatusModalItem(null);
        setFeedbackMessage({
          type: 'success',
          text: `Ticket #${statusModalItem.id} updated to "${newStatus}".`,
        });
        // refresh stats
        fetch('/api/stats')
          .then((r) => r.json())
          .then((d) => d.success && setStats(d.stats));
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (err: any) {
      setIsUpdating(false);
      setFeedbackMessage({ type: 'error', text: err.message || 'Error updating status' });
    }
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    try {
      const res = await fetch(`/api/complaints/${deleteModalItem.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setComplaints(complaints.filter((c) => c.id !== deleteModalItem.id));
        setDeleteModalItem(null);
        setFeedbackMessage({ type: 'success', text: `Ticket #${deleteModalItem.id} deleted successfully.` });
        fetch('/api/stats')
          .then((r) => r.json())
          .then((d) => d.success && setStats(d.stats));
      } else {
        setFeedbackMessage({ type: 'error', text: data.error || 'Failed to delete' });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Error deleting ticket' });
    }
  };

  // CSV Export for municipal reports
  const exportToCSV = () => {
    if (complaints.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Category', 'Location', 'Landmark', 'Status', 'AdminRemarks'];
    const rows = complaints.map((c) => [
      c.id,
      `"${c.date}"`,
      `"${c.name}"`,
      `"${c.mobile}"`,
      `"${c.email}"`,
      `"${c.wastetype}"`,
      `"${c.location}"`,
      `"${c.locationdescription.replace(/"/g, '""')}"`,
      c.status,
      `"${(c.adminRemarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wms_complaints_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = complaints.filter((c) => {
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.wastetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString() === searchQuery.trim();
    return matchesStatus && matchesSearch;
  });

  // 1. Loading State
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-600">Verifying municipal authorization...</p>
        </div>
      </div>
    );
  }

  // 2. Access Denied (Strictly blocked for regular citizens and guests)
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
            <ShieldAlert className="h-9 w-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              403 Forbidden — Access Denied
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-3">
              Municipal Staff Portal Only
            </h1>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              You do not have administrative privileges to access this area. This portal is strictly restricted to authorized municipal sanitation administrators and dispatchers.
            </p>
          </div>

          {user && (
            <div className="rounded-2xl bg-slate-50 border border-gray-200 p-3 text-xs text-gray-600 text-left">
              <span className="font-semibold text-gray-500 block text-[10px] uppercase">Current Session</span>
              <span className="font-bold text-gray-900">{user.name}</span> ({user.email})
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                Role: Citizen Account (Unauthorized for Admin Operations)
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Citizen Home
            </Link>
            <Link
              href="/login?admin=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-800 transition"
            >
              <LogIn className="h-3.5 w-3.5" /> Admin Staff Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 mb-2">
              <Shield className="h-3.5 w-3.5 text-purple-600" />
              <span>Municipal Sanitation Management — Staff Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Admin Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Dispatch sanitation crews, inspect waste evidence, and update public ticket resolution statuses.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
              title="Download spreadsheet report"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={loadMunicipalData}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`flex items-center justify-between rounded-xl p-4 text-xs font-semibold ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top KPI Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Complaints</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stats.totalComplaints}</div>
              <span className="text-[10px] text-gray-400">All recorded citizen files</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-amber-200 bg-amber-50/30 shadow-2xs">
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">Pending Review</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{stats.pendingCount}</div>
              <span className="text-[10px] text-amber-600">Awaiting route assignment</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/30 shadow-2xs">
              <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">In Progress</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{stats.inProgressCount}</div>
              <span className="text-[10px] text-blue-600">Truck & crew dispatched</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Completed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{stats.completedCount}</div>
              <span className="text-[10px] text-emerald-600">Cleaned & sanitized</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-purple-200 bg-purple-50/30 shadow-2xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Registered Users</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-1">{stats.totalUsers}</div>
              <span className="text-[10px] text-purple-600">Civic accounts</span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedStatus === s
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, location, or type..."
              className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Master Complaints Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Reporter Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location & Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Loading complaints records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No complaints match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        #{item.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => setActivePhoto(item.file)}
                          className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:opacity-80 transition shrink-0"
                        >
                          <img
                            src={item.file || '/assets/img/recycling.jpeg'}
                            alt="Evidence"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {item.date}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[11px] text-gray-500">{item.mobile}</div>
                        <div className="text-[10px] text-gray-400">{item.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
                          {item.wastetype}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-2" title={item.locationdescription}>
                          {item.locationdescription}
                        </div>
                        {item.adminRemarks && (
                          <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded mt-1">
                            Note: {item.adminRemarks}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => {
                            setStatusModalItem(item);
                            setNewStatus(item.status);
                            setAdminRemarks(item.adminRemarks || '');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Status
                        </button>

                        <button
                          onClick={() => setDeleteModalItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-800 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Update Modal */}
        {statusModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                    #{statusModalItem.id}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Update Resolution Status</h3>
                </div>
                <button
                  onClick={() => setStatusModalItem(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-xs text-gray-900 font-semibold"
                  >
                    <option value="Pending">Pending (Under Queue Review)</option>
                    <option value="In Progress">In Progress (Sanitation Crew Dispatched)</option>
                    <option value="Completed">Completed (Cleaned & Disinfected)</option>
                    <option value="Rejected">Rejected (Invalid Report / Duplicate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Municipal Feedback Note (Visible to public)
                  </label>
                  <textarea
                    rows={3}
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="e.g. Sanitation compactor dispatched. Site cleared by Ward 4 sanitation team."
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStatusModalItem(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-purple-600 px-5 py-2 font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Permanently Delete Ticket #{deleteModalItem.id}?
              </h3>
              <p className="text-xs text-gray-600">
                This will remove the complaint from both the citizen&apos;s history and the municipal dashboard.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalItem(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Lightbox */}
        {activePhoto && (
          <div
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
          >
            <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-white p-2">
              <img
                src={activePhoto}
                alt="Enlarged photo"
                className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
              />
              <div className="text-center py-2 text-xs text-gray-600 font-semibold">
                Click anywhere to close
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
