'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { Complaint } from '@/lib/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      // If user typed an ID or email or keyword, search via API
      const res = await fetch(`/api/complaints?search=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints || []);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const getStepProgress = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('complete')) return 4;
    if (s.includes('progress')) return 3;
    if (s.includes('reject') || s.includes('valid')) return 1;
    return 2; // Pending / Queued
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Search className="h-3.5 w-3.5 text-emerald-600" />
            <span>Public Status Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Track Complaint Live Status
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Enter your Complaint ID or email address to view real-time progress and municipal action notes.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Complaint ID (e.g. 102, 106) or Email (e.g. bistajanak303@gmail.com)..."
                className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 text-xs sm:text-sm text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 shrink-0"
            >
              {loading ? 'Searching...' : 'Check Status'}
            </button>
          </form>

          {/* Quick Filter Badges for Beginners */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 text-[11px] font-semibold">Try sample IDs:</span>
            {['102', '105', '106', '115', '77'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setQuery(id);
                  performSearch(id);
                }}
                className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 transition"
              >
                #{id}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setQuery('bistajanak303@gmail.com');
                performSearch('bistajanak303@gmail.com');
              }}
              className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-emerald-100 hover:text-emerald-800 transition"
            >
              bistajanak303@gmail.com
            </button>
          </div>
        </div>

        {/* Results Container */}
        {searched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Found {complaints.length} {complaints.length === 1 ? 'Record' : 'Records'}
              </h2>
              {complaints.length > 0 && (
                <span className="text-xs text-gray-500">Live municipal feed updated</span>
              )}
            </div>

            {complaints.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center space-y-4 shadow-2xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No Complaints Found for &ldquo;{query}&rdquo;</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Double check your Complaint ID number or email address, or file a new waste complaint right now.
                </p>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  File a New Report
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {complaints.map((item) => {
                  const currentStep = getStepProgress(item.status);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                      {/* Top Bar */}
                      <div className="bg-slate-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-extrabold text-gray-900">
                            Ticket #{item.id}
                          </span>
                          <StatusBadge status={item.status} size="md" />
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Timeline Stepper */}
                      <div className="px-6 py-5 bg-white border-b border-gray-100">
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                          {/* Step 1: Filed */}
                          <div className="space-y-1">
                            <div className="h-2 rounded-full bg-emerald-500" />
                            <span className="text-emerald-700 font-bold block">1. Filed</span>
                            <span className="text-[10px] text-gray-400 block hidden sm:block">Report logged</span>
                          </div>

                          {/* Step 2: Under Review */}
                          <div className="space-y-1">
                            <div className={`h-2 rounded-full ${currentStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            <span className={currentStep >= 2 ? 'text-emerald-700 font-bold block' : 'text-gray-400 block'}>
                              2. Under Review
                            </span>
                            <span className="text-[10px] text-gray-400 block hidden sm:block">Inspector triage</span>
                          </div>

                          {/* Step 3: Truck Dispatched */}
                          <div className="space-y-1">
                            <div className={`h-2 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                            <span className={currentStep >= 3 ? 'text-blue-700 font-bold block' : 'text-gray-400 block'}>
                              3. Dispatched
                            </span>
                            <span className="text-[10px] text-gray-400 block hidden sm:block">Crew en route</span>
                          </div>

                          {/* Step 4: Resolved */}
                          <div className="space-y-1">
                            <div className={`h-2 rounded-full ${currentStep >= 4 ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                            <span className={currentStep >= 4 ? 'text-emerald-800 font-bold block' : 'text-gray-400 block'}>
                              4. Completed
                            </span>
                            <span className="text-[10px] text-gray-400 block hidden sm:block">Site cleaned</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Details */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                              Location & Landmark
                            </div>
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                              <span>{item.location}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 pl-5">
                              {item.locationdescription}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                Waste Category
                              </div>
                              <span className="inline-block mt-1 text-xs font-semibold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                                {item.wastetype}
                              </span>
                            </div>

                            <div>
                              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                Reported By
                              </div>
                              <div className="text-xs font-semibold text-gray-800 mt-1">
                                {item.name} ({item.mobile})
                              </div>
                            </div>
                          </div>

                          {/* Municipal Remarks Box */}
                          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                              <ShieldCheck className="h-4 w-4 text-emerald-700" />
                              <span>Municipal Response Note</span>
                            </div>
                            <p className="text-xs text-emerald-800">
                              {item.adminRemarks || 'Complaint registered and queued for sanitary route inspection.'}
                            </p>
                          </div>
                        </div>

                        {/* Photo Evidence */}
                        <div className="md:col-span-4 flex flex-col items-center">
                          <div
                            onClick={() => setActivePhoto(item.file)}
                            className="w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group relative shadow-2xs"
                          >
                            <img
                              src={item.file || '/assets/img/recycling.jpeg'}
                              alt="Complaint evidence"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                              Click to Enlarge
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1.5">
                            Attached Photo Evidence
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Photo Lightbox Modal */}
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

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
