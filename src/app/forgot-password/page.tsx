'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== cpassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! You can now log in with your new password.',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Network error occurred' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <Recycle className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">WasteCare WMS</span>
        </Link>
        <h2 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Enter your registered email and choose a new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 space-y-6">
          {message && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Registered Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. bistajanak303@gmail.com"
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
