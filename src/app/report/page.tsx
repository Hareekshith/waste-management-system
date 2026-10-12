'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Sparkles,
  Phone,
  Mail,
  User,
  Info,
  Layers,
  Check,
} from 'lucide-react';
import { WasteTypeSelector } from '@/components/WasteTypeSelector';

export default function ReportPage() {
  const router = useRouter();

  // Wizard Step (1: Category, 2: Location, 3: Photo & Details)
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Mixed']);
  const [location, setLocation] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [imagePreview, setImagePreview] = useState('/assets/img/recycling.jpeg');
  const [isLocating, setIsLocating] = useState(false);

  // Load user info from session or localStorage
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
        }
      })
      .catch(() => {});
  }, []);

  // Quick GPS Auto-Detect
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setLocation(`Municipal Sector (GPS: ${lat}, ${lng})`);
          if (!locationDescription) {
            setLocationDescription('Auto-detected device GPS coordinates.');
          }
        },
        () => {
          setIsLocating(false);
          // Fallback location for testing
          setLocation('Kathmandu, Ward 4 (Pulchowk)');
          setLocationDescription('Near central roadway crossing');
        }
      );
    } else {
      setIsLocating(false);
      setLocation('Kathmandu, Ward 4 (Pulchowk)');
    }
  };

  // Sample data auto-fill for beginners
  const handleAutoFillDemo = () => {
    setSelectedTypes(['Plastic', 'Household']);
    setLocation('Lalitpur, Kumaripati Chowk');
    setLocationDescription('Overflowing corner trash container next to bus stand');
    setName('Janak Bist');
    setMobile('9848726051');
    setEmail('bistajanak303@gmail.com');
    setImagePreview('/assets/img/recycling.jpeg');
    setStep(3);
  };

  // Handle Photo selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Photo presets
  const samplePhotos = [
    { label: 'Street Plastic', path: '/assets/img/recycling.jpeg' },
    { label: 'Household Piles', path: '/uploads/Capture.PNG' },
    { label: 'Mixed Dumpster', path: '/uploads/env.jpg' },
    { label: 'Medical Waste', path: '/assets/img/Medical-Waste.jpg' },
  ];

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !mobile.trim() || !email.trim() || !location.trim() || !locationDescription.trim()) {
      setErrorMessage('Please fill in all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        wastetype: selectedTypes.join(', '),
        location: location.trim(),
        locationdescription: locationDescription.trim(),
        file: imagePreview,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.complaint) {
        setSubmittedComplaint(data.complaint);
      } else {
        setErrorMessage(data.error || 'Failed to file complaint');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Network error occurred');
    }
  };

  if (submittedComplaint) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Complaint Registered Successfully!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              Tracking Ticket #{submittedComplaint.id}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Your waste complaint has been transmitted to municipal sanitation dispatch. You can track updates at any time.
            </p>
          </div>

          {/* Ticket Summary Box */}
          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Complainant:</span>
              <span className="font-bold text-gray-900">{submittedComplaint.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Location:</span>
              <span className="font-bold text-gray-900">{submittedComplaint.location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-500">Waste Type:</span>
              <span className="font-bold text-gray-900">{submittedComplaint.wastetype}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Initial Status:</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {submittedComplaint.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?q=${submittedComplaint.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Track This Complaint Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/history"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              View My History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Municipal Incident Reporting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Report Garbage / Waste Problem
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Follow our simple 3-step form to notify city sanitation trucks.
            </p>
          </div>

          {/* Quick Demo Autofill Button for Beginners */}
          <button
            onClick={handleAutoFillDemo}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/60 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs self-start"
            title="Click to fill sample data for quick evaluation"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Auto-Fill Sample Data</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8 bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-bold transition ${
                step === 1 ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 1
                    ? 'bg-emerald-600 text-white'
                    : step > 1
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                1
              </div>
              <span className="hidden sm:inline">1. Category</span>
            </button>

            <div className={`flex-1 mx-3 h-1 rounded-full ${step > 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 text-xs font-bold transition ${
                step === 2 ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 2
                    ? 'bg-emerald-600 text-white'
                    : step > 2
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                2
              </div>
              <span className="hidden sm:inline">2. Location</span>
            </button>

            <div className={`flex-1 mx-3 h-1 rounded-full ${step > 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />

            {/* Step 3 */}
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 text-xs font-bold transition ${
                step === 3 ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="hidden sm:inline">3. Photo & Contact</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          {/* STEP 1: WASTE CATEGORY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-emerald-600" />
                  Step 1: What kind of waste is this?
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Selecting the right category ensures the appropriate sanitation vehicle (compactor, organic composter, or hazardous truck) is sent.
                </p>
              </div>

              <WasteTypeSelector
                selectedTypes={selectedTypes}
                onChange={setSelectedTypes}
              />

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  Continue to Location <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Step 2: Where is the garbage located?
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Provide the street address or nearest landmark so drivers can reach the exact location.
                </p>
              </div>

              {/* GPS Auto-Detect Button */}
              <div className="flex items-center justify-between rounded-2xl bg-blue-50/70 border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-blue-900">Automatic Geolocation</h3>
                    <p className="text-[11px] text-blue-700">Detect your current street position in 1 click</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition shrink-0 disabled:opacity-50"
                >
                  {isLocating ? 'Detecting...' : 'Detect GPS'}
                </button>
              </div>

              {/* Area / City */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Area / City / Neighborhood <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kathmandu Pulchowk, Bhaktapur Durbar Square, New Delhi Moti Nagar..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Landmark description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Detailed Landmark & Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={locationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                  placeholder="e.g. Next to the main campus gate, overflowing around 30kg trash near the pedestrian bridge..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!location.trim() || !locationDescription.trim()) {
                      setErrorMessage('Please specify both the Area and Detailed Landmark.');
                      return;
                    }
                    setErrorMessage('');
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  Continue to Photo & Contact <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO EVIDENCE & CONTACT */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Step 3: Photo Evidence & Contact Information
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image of the waste and provide your contact information to receive status updates.
                </p>
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-800">
                  Waste Photo Evidence
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Evidence preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <Camera className="h-8 w-8 mx-auto mb-1" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-4 cursor-pointer hover:border-emerald-500 transition bg-slate-50">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-700">Upload Your Photo</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Preset Photos for Testing */}
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                        Or pick a sample photo for testing:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {samplePhotos.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImagePreview(p.path)}
                            className="text-[10px] text-left px-2 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 font-medium transition truncate"
                          >
                            📸 {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Janak Bist"
                      className="w-full rounded-xl border border-gray-300 pl-8 pr-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 9848726051"
                      className="w-full rounded-xl border border-gray-300 pl-8 pr-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. bistajanak303@gmail.com"
                      className="w-full rounded-xl border border-gray-300 pl-8 pr-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submission Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Submitting to Municipality...'
                  ) : (
                    <>
                      <span>Submit Official Complaint</span>
                      <Check className="h-4 w-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
