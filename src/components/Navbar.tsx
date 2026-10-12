'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Recycle,
  PlusCircle,
  Search,
  History,
  Shield,
  BookOpen,
  Phone,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { BeginnerTourModal } from './BeginnerTourModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  // Load current user from cookie or session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCitizenDemoLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDemo: true, demoRole: 'citizen' }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setDemoDropdownOpen(false);
        router.push('/history');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  // Base navigation links for all citizens and guests
  const baseNavLinks = [
    { href: '/', label: 'Home', icon: Recycle },
    { href: '/report', label: 'Report Waste', icon: PlusCircle, highlight: true },
    { href: '/track', label: 'Track Status', icon: Search },
    { href: '/history', label: 'My Complaints', icon: History },
    { href: '/guide', label: 'Recycling Guide', icon: BookOpen },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  // ONLY insert Admin Portal if the logged in user is verified admin!
  const navLinks = isAdmin
    ? [
        ...baseNavLinks.slice(0, 4),
        { href: '/admin', label: 'Admin Portal', icon: Shield, adminBadge: true },
        ...baseNavLinks.slice(4),
      ]
    : baseNavLinks;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-gray-900 tracking-tight text-lg flex items-center gap-1.5">
                WasteCare <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">WMS</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium hidden sm:block">
                Municipal Waste Reporting & Recycling
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition mx-1"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              if (link.adminBadge) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition mx-1 ${
                      isActive
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5 text-purple-600" />
                    <span>{link.label}</span>
                    <span className="text-[9px] bg-purple-700 text-white px-1.5 py-0.2 rounded-full uppercase font-black">
                      Staff
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Beginner Guide Tour Button */}
            <button
              onClick={() => setTourOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
              title="First time here? Take the 60-second guided tour"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Beginner Guide</span>
            </button>

            {/* Quick Demo Mode for Citizens */}
            {!currentUser && (
              <button
                onClick={handleCitizenDemoLogin}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-2xs transition"
                title="Instant citizen test login as Janak Bist"
              >
                <User className="h-3.5 w-3.5 text-emerald-600" />
                <span>Demo Citizen</span>
              </button>
            )}

            {/* User Session / Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold capitalize ${
                      isAdmin ? 'text-purple-600 font-bold' : 'text-emerald-600'
                    }`}
                  >
                    {isAdmin ? '🛡️ Municipal Staff' : 'Citizen'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Log In</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
            {navLinks.map((link: any) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : link.adminBadge
                      ? 'bg-purple-50 text-purple-800 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${link.adminBadge ? 'text-purple-600' : 'text-emerald-600'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.adminBadge && (
                    <span className="text-[10px] bg-purple-700 text-white px-2 py-0.5 rounded-full font-bold">
                      Staff Only
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-gray-600">
                    Logged in as <strong>{currentUser.name}</strong> ({currentUser.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handleCitizenDemoLogin}
                    className="flex-1 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold"
                  >
                    Demo Citizen
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Beginner Tour Popover */}
      <BeginnerTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
};
