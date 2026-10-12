'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    contactEmail: '',
    contactPhone: '',
    comment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAutoFillDemo = () => {
    setFormData({
      fname: 'Janak',
      lname: 'Bist',
      contactEmail: 'bistajanak303@gmail.com',
      contactPhone: '9848726051',
      comment: 'Inquiring about bulk recycling pickup schedules for our community apartment complex.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'Your inquiry was delivered to the municipal helpdesk.',
        });
        setFormData({ fname: '', lname: '', contactEmail: '', contactPhone: '', comment: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setStatus({ type: 'error', message: err.message || 'Network error occurred.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>24/7 Citizen Helpdesk</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Contact Municipal Waste Authorities
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Have questions about collection routes, bulk commercial waste, or general suggestions? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Emergency & Sanitation Hotlines
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Toll-Free Dispatch Helpline</span>
                    <span className="text-gray-600 font-mono">+977-1-6609952111</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Operates 24/7 for overflowing bins & hazards</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Municipal Official Email</span>
                    <span className="text-gray-600">bistajanak303@gmail.com</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Replies within 1-2 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Municipal Headquarters</span>
                    <span className="text-gray-600">Kathmandu Metropolitan Sanitation Division & New Delhi Ward Offices</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Collection Truck Timings</span>
                    <span className="text-gray-600">Morning Round: 06:00 AM – 10:00 AM</span>
                    <span className="text-gray-600 block">Evening Round: 04:30 PM – 08:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Autofill helper */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Testing the contact form?</span>
                <span className="text-[11px] text-emerald-700">Fill demo contact message in 1 click</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition text-[11px]"
              >
                Auto-Fill
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Send an Inquiry or Suggestion
              </h2>

              {status && (
                <div
                  className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fname}
                      onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                      placeholder="e.g. Janak"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lname}
                      onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                      placeholder="e.g. Bist"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="e.g. +977 9828912874"
                      className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    Your Message / Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Tell us how we can help, or report an ongoing municipal service inquiry..."
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message to Municipality</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
