import React from 'react';
import Link from 'next/link';
import { Recycle, Phone, Mail, MapPin, Heart, Shield, CheckCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
      {/* Top Banner */}
      <div className="bg-emerald-700 text-white py-3 px-4 text-center text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle className="h-4 w-4" /> 24/7 Municipal Sanitation Helpline
          </span>
          <span className="opacity-90">Call Toll-Free: <strong>+977-1-6609952111</strong> or WhatsApp: <strong>+91 9871946454</strong></span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">WasteCare WMS</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              A digital civic platform bridging residents and local municipalities for rapid street waste collection, transparent complaint tracking, and smart recycling segregation.
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> Official Municipal Partner Software
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">Home Overview</Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-emerald-400 transition font-semibold text-emerald-300">Report Waste / Complain</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition">Track Complaint Status</Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-400 transition">My Complaint History</Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-emerald-400 transition">Recycling & Segregation Guide</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">Contact & Helpdesk</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Waste Management Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Services & Categories</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• Rapid Street Dumpster Collection</li>
              <li>• Organic Wet Waste & Composting</li>
              <li>• Segregated Plastics & Paper Recycling</li>
              <li>• Safe Hazardous & E-Waste Pickup</li>
              <li>• Clinical & Medical Waste Guidelines</li>
              <li>• Neighborhood Cleanliness Drives</li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Municipal Helpdesk</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>Kathmandu, Lalitpur & New Delhi Municipal Sanitation Hubs</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>+91 9871946454 / +977 9828912874</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>support@wms.gov.local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Waste Management System (WMS). All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-gray-400">
            Originated with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> by{' '}
            <span className="text-emerald-400 font-semibold">Janak Bist</span> &{' '}
            <span className="text-emerald-400 font-semibold">Lakshay Tyagi</span>. Migrated to modern Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
};
