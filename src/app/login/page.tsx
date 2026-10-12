'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Recycle,
  Lock,
  Mail,
  Shield,
  User,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAdmin = searchParams.get('admin') === 'true';

  const [portalMode, setPortalMode] = useState<'citizen' | 'admin'>(initialAdmin ? 'admin' : 'citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('admin') === 'true') {
      setPortalMode('admin');
    }
  }, [searchParams]);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        if (portalMode === 'admin' && data.user.role !== 'admin') {
          setError('This account does not have municipal administrator credentials.');
          return;
        }

        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/history');
        }
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Network error occurred');
    }
  };

  const handleCitizenDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true, demoRole: 'citizen' }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        router.push('/history');
        router.refresh();
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error logging in');
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
          {portalMode === 'admin' ? 'Municipal Staff Authentication' : 'Citizen Account Sign In'}
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          {portalMode === 'admin'
            ? 'Restricted to authorized municipal sanitation administrators'
            : 'Access your complaint history and track municipal tickets'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100 space-y-6">
          {/* Portal Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setPortalMode('citizen');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                portalMode === 'citizen'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Citizen Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setPortalMode('admin');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                portalMode === 'admin'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Staff / Admin</span>
            </button>
          </div>

          {/* Citizen Demo Shortcut (Only shown in Citizen mode) */}
          {portalMode === 'citizen' && (
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Beginner 1-Click Citizen Test</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-tight">
                Evaluate citizen features instantly as Janak Bist:
              </p>
              <button
                type="button"
                onClick={handleCitizenDemoLogin}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In as Demo Citizen (Janak Bist)</span>
              </button>
            </div>
          )}

          {/* Admin Credentials Helper (Only shown in Admin mode) */}
          {portalMode === 'admin' && (
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 text-xs text-purple-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Authorized Staff Access</span>
              </div>
              <p className="text-[11px] text-purple-700">
                Default credentials for municipal inspectors: Username <strong>admin</strong> and Password <strong>admintest</strong> or <strong>admin</strong>.
              </p>
            </div>
          )}

          {portalMode === 'citizen' && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">
                Or Sign In With Email
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                {portalMode === 'admin' ? 'Staff Username / Email' : 'Email Address'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portalMode === 'admin' ? 'e.g. admin or admin@wms.gov' : 'e.g. bistajanak303@gmail.com'}
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-gray-800">
                  Password <span className="text-red-500">*</span>
                </label>
                {portalMode === 'citizen' && (
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 px-4 text-xs font-bold text-white shadow-md transition disabled:opacity-50 ${
                portalMode === 'admin' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading
                ? 'Authenticating...'
                : portalMode === 'admin'
                ? 'Verify & Enter Staff Dashboard'
                : 'Sign In to Citizen Account'}
            </button>
          </form>

          {portalMode === 'citizen' ? (
            <div className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
              Don&apos;t have an account yet?{' '}
              <Link href="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
                Register as Citizen
              </Link>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
              Not a municipal staff member?{' '}
              <button
                type="button"
                onClick={() => setPortalMode('citizen')}
                className="font-bold text-emerald-600 hover:text-emerald-700"
              >
                Go to Citizen Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
