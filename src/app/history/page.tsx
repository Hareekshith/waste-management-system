'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Trash2,
  Edit,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
  X,
  Check,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEmail, setFilterEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [editItem, setEditItem] = useState<Complaint | null>(null);
  const [deleteItem, setDeleteItem] = useState<Complaint | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load session or default demo citizen
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setFilterEmail(data.user.email);
          fetchHistory(data.user.email);
        } else {
          // Default to Janak Bist demo email
          const defaultEmail = 'bistajanak303@gmail.com';
          setFilterEmail(defaultEmail);
          fetchHistory(defaultEmail);
        }
      })
      .catch(() => {
        fetchHistory('bistajanak303@gmail.com');
      });
  }, []);

  const fetchHistory = async (emailToFetch: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints?email=${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSwitch = (newEmail: string) => {
    setFilterEmail(newEmail);
    fetchHistory(newEmail);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/complaints/${deleteItem.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setComplaints(complaints.filter((c) => c.id !== deleteItem.id));
        setDeleteItem(null);
        setMessage({ type: 'success', text: `Complaint #${deleteItem.id} was deleted successfully.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete complaint' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error deleting complaint' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/complaints/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem),
      });
      const data = await res.json();
      setIsUpdating(false);

      if (data.success && data.complaint) {
        setComplaints(complaints.map((c) => (c.id === editItem.id ? data.complaint : c)));
        setEditItem(null);
        setMessage({ type: 'success', text: `Complaint #${editItem.id} was updated.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update complaint' });
      }
    } catch (err: any) {
      setIsUpdating(false);
      setMessage({ type: 'error', text: err.message || 'Error updating complaint' });
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.wastetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString() === searchQuery;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <History className="h-3.5 w-3.5 text-emerald-600" />
              <span>Citizen Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              My Complaint History
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Review and manage all waste complaints submitted under your email address.
            </p>
          </div>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition self-start"
          >
            <PlusCircle className="h-4 w-4" />
            <span>File New Complain</span>
          </Link>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`flex items-center justify-between rounded-xl p-4 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Filter & Account Switcher Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold">Viewing complaints for:</span>
            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-gray-800">
              <User className="h-3.5 w-3.5 text-emerald-600" />
              <span>{filterEmail}</span>
            </div>

            {/* Quick Email Switcher for Demo testing */}
            <div className="flex items-center gap-1 ml-2">
              <span className="text-[11px] text-gray-400 hidden sm:inline">Switch account:</span>
              <button
                onClick={() => handleEmailSwitch('bistajanak303@gmail.com')}
                className={`text-[11px] px-2 py-1 rounded border transition ${
                  filterEmail === 'bistajanak303@gmail.com'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Janak (bistajanak303)
              </button>
              <button
                onClick={() => handleEmailSwitch('janak.bista@sagarmatha.edu.np')}
                className={`text-[11px] px-2 py-1 rounded border transition ${
                  filterEmail === 'janak.bista@sagarmatha.edu.np'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Sagarmatha
              </button>
              <button
                onClick={() => handleEmailSwitch('imagekunwar@gmail.com')}
                className={`text-[11px] px-2 py-1 rounded border transition ${
                  filterEmail === 'imagekunwar@gmail.com'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Image Kunwar
              </button>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full rounded-xl border border-gray-200 pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Complaints List / Table */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-200">
            Loading your history records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <div className="flex h-12 w-12 rounded-2xl bg-gray-100 text-gray-500 items-center justify-center mx-auto">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No complaints found for this filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven&apos;t filed any complaints with this email yet, or none matched your search.
            </p>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Report an Issue Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-4">Evidence</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location & Note</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                        #{item.id}
                      </td>

                      <td className="py-4 px-4">
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                          <img
                            src={item.file || '/assets/img/recycling.jpeg'}
                            alt="Evidence"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                        {item.date}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
                          {item.wastetype}
                        </span>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-bold text-gray-900">{item.location}</div>
                        <div className="text-[11px] text-gray-500 truncate" title={item.locationdescription}>
                          {item.locationdescription}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setEditItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </button>

                        <button
                          onClick={() => setDeleteItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900">
                  Edit Complaint #{editItem.id}
                </h3>
                <button
                  onClick={() => setEditItem(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location / Area</label>
                  <input
                    type="text"
                    required
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editItem.locationdescription}
                    onChange={(e) => setEditItem({ ...editItem, locationdescription: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Waste Type</label>
                  <input
                    type="text"
                    required
                    value={editItem.wastetype}
                    onChange={(e) => setEditItem({ ...editItem, wastetype: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Delete Complaint #{deleteItem.id}?</h3>
              <p className="text-xs text-gray-600">
                Are you sure you want to withdraw and permanently delete this complaint from the municipal database?
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteItem(null)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
