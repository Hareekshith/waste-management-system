'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  Lock,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== cpassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/history');
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || 'Failed to register account');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Network error occurred');
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
          Create Citizen Account
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Join community reporting and track sanitation tickets
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 space-y-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Account Created Successfully!</h3>
              <p className="text-xs text-gray-500">Redirecting to your complaint history dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Janak Bist"
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>

              <div className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
                Already registered?{' '}
                <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                  Sign in here
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
