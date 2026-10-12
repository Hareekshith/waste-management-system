'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  PlusCircle,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Award,
  Users,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { BeginnerTourModal } from '@/components/BeginnerTourModal';

export default function HomePage() {
  const router = useRouter();
  const [tourOpen, setTourOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState('');
  const [stats, setStats] = useState({
    totalComplaints: 11,
    completedCount: 3,
    inProgressCount: 2,
    pendingCount: 6,
    totalUsers: 5,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      router.push(`/track?q=${encodeURIComponent(trackQuery.trim())}`);
    }
  };

  const faqs = [
    {
      q: 'What is the Waste Management System (WMS)?',
      a: 'WMS is a municipal civic web application that allows citizens to photograph and report street garbage, illegal dump sites, and overflowing bins directly to their city sanitation division, monitoring resolution status in real-time.',
    },
    {
      q: 'How do I report garbage near my locality?',
      a: 'Click "Report Waste", choose the waste category (Household, Plastic, Organic, Medical, etc.), specify your location or use the 1-click GPS detection, attach a photo, and click Submit. You will instantly receive a tracking number.',
    },
    {
      q: 'Do I need to create an account or verify email to report waste?',
      a: 'No! First-time visitors can submit reports instantly as a guest citizen, or log in with our 1-click Demo Accounts (Janak Bist or Municipal Admin) to explore all advanced features.',
    },
    {
      q: 'How do I practice waste segregation at home?',
      a: 'Keep separate bins for wet (kitchen scraps/organic) and dry (plastic, paper, glass) waste. Ensure recyclables are rinsed and dry. Medical or hazardous items (syringes, batteries) must be packed separately in marked paper bags.',
    },
    {
      q: 'What happens after I submit a complaint?',
      a: 'Your report enters the municipal queue as "Pending". A sanitation inspector reviews the photo and location, dispatches a collection squad ("In Progress"), and marks the ticket "Completed" once the waste has been safely removed.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Beginner Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
              New to WMS?
            </span>
            <span>Welcome! Take the 60-second interactive guided tour to learn how to report waste in 3 simple steps.</span>
          </div>
          <button
            onClick={() => setTourOpen(true)}
            className="inline-flex items-center gap-1 font-bold bg-white text-emerald-800 px-3 py-1 rounded-full hover:bg-emerald-50 transition shadow-xs text-xs"
          >
            <Sparkles className="h-3 w-3 text-emerald-600" /> Start Beginner Tour
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                <Recycle className="h-4 w-4 text-emerald-600" />
                <span>Modern Digital Municipal Sanitation Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Better Solutions For The <span className="text-emerald-600 underline decoration-emerald-300">Waste</span> Around You!
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Spot dirty roads, overflowing dumpsters, or hazard piles? Snap a photo, pin the location, and alert municipal crews with a single tap.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Report Garbage Problem</span>
                </Link>

                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-400 transition"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                  <span>Track by ID / Email</span>
                </Link>

                <button
                  onClick={() => setTourOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>How it Works</span>
                </button>
              </div>

              {/* Instant Complaint Tracker Quick-Bar */}
              <div className="mt-8 pt-4">
                <form
                  onSubmit={handleTrackSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-md max-w-xl"
                >
                  <div className="flex items-center gap-2 w-full px-3 py-1">
                    <Search className="h-4 w-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="Quick Track: Enter Complaint ID (e.g. 102) or Email..."
                      className="w-full text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto shrink-0 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Track Status
                  </button>
                </form>
                <p className="text-[11px] text-gray-500 mt-2 px-1">
                  Try sample Complaint IDs: <strong>102</strong>, <strong>105</strong>, <strong>106</strong>, or email <strong>bistajanak303@gmail.com</strong>
                </p>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src="/assets/img/recycling.jpeg"
                  alt="Recycling and Waste Clean Up"
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold w-fit mb-2">
                    Clean & Green Communities
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    Over 500+ Metric Tons of Waste Segregated
                  </h3>
                  <p className="text-xs text-gray-200 mt-1">
                    Connecting civic neighborhood reporters directly with municipal dispatchers.
                  </p>
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900">94.8%</div>
                  <div className="text-xs text-gray-500">Average Clean-up Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counters */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900">{stats.totalComplaints}</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Total Reported Incidents</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700">{stats.completedCount}</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-800 mt-1">Successfully Resolved</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-700">{stats.inProgressCount}</div>
              <div className="text-xs sm:text-sm font-semibold text-blue-800 mt-1">Trucks In Transit</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-700">{stats.pendingCount}</div>
              <div className="text-xs sm:text-sm font-semibold text-amber-800 mt-1">Pending Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Beginner Guide Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Beginner Walkthrough
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 sm:text-4xl">
              How Reporting Works In 3 Easy Steps
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Designed for everyone. You don't need technical skills or complex registration to help keep your streets clean.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition">
              <div className="absolute -top-3.5 left-6 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                STEP 1
              </div>
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 mt-2">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Select Waste Category</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Choose from visual cards: Household Trash, Organic/Kitchen waste, Plastic bottles, Medical, or E-Waste. This helps dispatch the right truck.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-emerald-700 font-semibold">
                ✓ Visual icons make selection effortless
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition">
              <div className="absolute -top-3.5 left-6 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                STEP 2
              </div>
              <div>
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 mt-2">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pin Location & Snap Photo</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Use the 1-click &ldquo;Detect My GPS&rdquo; button or type your nearest landmark. Attach a quick picture of the garbage pile so drivers know where to park.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-blue-700 font-semibold">
                ✓ 1-click browser geolocation built-in
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition">
              <div className="absolute -top-3.5 left-6 bg-purple-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                STEP 3
              </div>
              <div>
                <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 mt-2">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Municipality Cleans Up</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  City inspectors receive the notice instantly. The status automatically updates to &ldquo;In Progress&rdquo; and &ldquo;Completed&rdquo; once the site is clean.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-purple-700 font-semibold">
                ✓ Live tracking with no login required
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              Start Your First Report Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Waste Segregation Breakdown & Educational Insights */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Eco Awareness
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Composition of Municipal Solid Waste
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Segregating waste at source significantly reduces landfill dumping and cuts greenhouse gas emissions. Here is the typical breakdown:
              </p>

              {/* Progress Bars */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Plastics & Packaging (Recyclable)</span>
                    <span className="text-emerald-700">35%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Paper, Glass & Scrap Metals</span>
                    <span className="text-blue-700">25%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Organic & Wet Kitchen Food Scraps</span>
                    <span className="text-amber-700">25%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Garden Waste & Bio-Remnants</span>
                    <span className="text-teal-700">15%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
                >
                  Explore Complete Interactive Recycling & Bin Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-slate-50 p-3">
                <img
                  src="/assets/img/recycling5.png"
                  alt="Waste segregation"
                  className="rounded-2xl w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Everything you need to know about municipal reporting and waste handling.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-gray-900 hover:bg-gray-50/50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            See Waste In Your Neighborhood? Report It Today!
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto">
            Clean communities begin with observant citizens. Let&apos;s keep our streets, rivers, and playgrounds hygienic for everyone.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/report"
              className="rounded-xl bg-white text-emerald-900 px-6 py-3.5 text-sm font-extrabold shadow-lg hover:bg-emerald-50 transition"
            >
              Report a Complaint Now
            </Link>
            <Link
              href="/guide"
              className="rounded-xl border border-emerald-400 bg-transparent text-white px-6 py-3.5 text-sm font-semibold hover:bg-emerald-800/50 transition"
            >
              View Recycling Ideas
            </Link>
          </div>
        </div>
      </section>

      {/* Beginner Tour Modal */}
      <BeginnerTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}
