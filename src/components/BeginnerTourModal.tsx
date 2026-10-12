'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Camera, CheckCircle, ArrowRight, ArrowLeft, X, BookOpen, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface BeginnerTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: 1,
    title: 'Welcome to Waste Management System!',
    badge: 'Step 1 of 4: Introduction',
    description: 'This platform empowers citizens to report street garbage, overflowing dumpsters, and illegal waste dumping directly to your local municipal authorities.',
    icon: Sparkles,
    color: 'bg-emerald-500 text-white',
    tips: [
      'Zero paperwork: reports go directly to municipal sanitation crews',
      'Track real-time progress from submission to resolution',
      'Educate yourself and neighbors on proper recycling segregation',
    ],
  },
  {
    step: 2,
    title: 'How to File a Quick Waste Report',
    badge: 'Step 2 of 4: Reporting',
    description: 'Reporting waste takes less than 60 seconds. You provide 3 essential details so sanitation trucks can locate and remove the waste quickly:',
    icon: Camera,
    color: 'bg-blue-500 text-white',
    tips: [
      '1. Select Waste Type: Choose between Household, Organic, Plastic, Medical, or E-Waste',
      '2. Pin Location: Use the 1-click GPS detection button or specify landmarks',
      '3. Attach a Photo: Upload a photo so authorities assess crew & equipment needed',
    ],
  },
  {
    step: 3,
    title: 'Understanding Status & Tracking',
    badge: 'Step 3 of 4: Tracking',
    description: 'Every complaint receives a tracking ID (e.g., #105). You can check its live status anytime without logging in!',
    icon: Truck,
    color: 'bg-amber-500 text-white',
    tips: [
      'Pending ⏳: Report received and queued for route assignment',
      'In Progress 🚜: Sanitation squad & compactor truck dispatched to site',
      'Completed ✅: Waste collected, area sanitized, and photo verified',
    ],
  },
  {
    step: 4,
    title: 'Instant Citizen Demo & Quick Start',
    badge: 'Step 4 of 4: Ready to Start',
    description: 'Want to try the platform right away? Use our 1-click Demo Citizen account or file a report directly as a guest!',
    icon: ShieldCheck,
    color: 'bg-emerald-600 text-white',
    tips: [
      '1-Click Demo Citizen: Test filing complaints and managing your personal history as Janak Bist',
      'Instant Tracking: Track any complaint with just its ticket ID without logging in',
      'Or create your own citizen account in 30 seconds!',
    ],
  },
];

export const BeginnerTourModal: React.FC<BeginnerTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
              {current.step}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {current.badge}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
            aria-label="Close tour"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md ${current.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {current.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Tips List */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2.5 my-5">
            {current.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="leading-tight">{tip}</span>
              </div>
            ))}
          </div>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-gray-700 border-gray-300 hover:bg-white'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStep === STEPS.length - 1 ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/report"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  File First Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Next <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
