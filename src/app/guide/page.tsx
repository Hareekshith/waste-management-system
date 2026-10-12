'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  CheckCircle,
  AlertTriangle,
  Apple,
  Package,
  Zap,
  Syringe,
  Recycle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

interface WasteItem {
  name: string;
  category: 'Organic / Wet' | 'Recyclable Plastic/Dry' | 'Hazardous / E-Waste' | 'Medical Waste' | 'General Household';
  binColor: 'Green' | 'Blue' | 'Yellow' | 'Red' | 'Black';
  action: string;
  recyclable: boolean;
  tip: string;
}

const KNOWLEDGE_BASE: WasteItem[] = [
  {
    name: 'Plastic Water Bottle (PET)',
    category: 'Recyclable Plastic/Dry',
    binColor: 'Blue',
    action: 'Rinse, crush flat, replace cap and place in Blue Dry Recyclables bin.',
    recyclable: true,
    tip: 'Crushing bottles saves 70% bin volume for municipal transport.',
  },
  {
    name: 'Apple Core / Banana Peels',
    category: 'Organic / Wet',
    binColor: 'Green',
    action: 'Deposit directly into Green Wet bin or backyard compost pot.',
    recyclable: true,
    tip: 'Turns into nutrient-rich organic soil compost in 30-45 days.',
  },
  {
    name: 'AA / AAA Batteries',
    category: 'Hazardous / E-Waste',
    binColor: 'Yellow',
    action: 'Store in dry sealed plastic container. Never throw in normal dustbins.',
    recyclable: false,
    tip: 'Heavy metals (lead, cadmium) can leak and contaminate underground aquifers.',
  },
  {
    name: 'Cardboard Box / Delivery Carton',
    category: 'Recyclable Plastic/Dry',
    binColor: 'Blue',
    action: 'Remove plastic tape, flatten cardboards and keep clean from grease.',
    recyclable: true,
    tip: 'Cardboard can be pulped and remade into new packaging up to 7 times.',
  },
  {
    name: 'Used Needles & Syringes',
    category: 'Medical Waste',
    binColor: 'Red',
    action: 'Place inside puncture-proof plastic bottle or sharps bin. Hand over directly to clinic/hospital squad.',
    recyclable: false,
    tip: 'High biohazard risk for sanitation workers. Never mix with household trash.',
  },
  {
    name: 'Smartphone / Laptop Cables',
    category: 'Hazardous / E-Waste',
    binColor: 'Yellow',
    action: 'Hand over to authorized municipal E-waste drop-off center.',
    recyclable: true,
    tip: 'Contains recoverable copper, gold, and silver wires.',
  },
  {
    name: 'Greasy Pizza Box',
    category: 'General Household',
    binColor: 'Black',
    action: 'Tear off clean top for recycling; oily/cheesy bottom goes to household compost or general bin.',
    recyclable: false,
    tip: 'Food oil contaminates paper recycling slurries.',
  },
  {
    name: 'Glass Soda Bottle',
    category: 'Recyclable Plastic/Dry',
    binColor: 'Blue',
    action: 'Rinse out remaining liquid and place in dry bin.',
    recyclable: true,
    tip: 'Glass is 100% endlessly recyclable without loss of quality.',
  },
  {
    name: 'Expired Medicine Strips',
    category: 'Medical Waste',
    binColor: 'Red',
    action: 'Keep in blister pack, place in marked paper bag for municipal bio collection.',
    recyclable: false,
    tip: 'Flushing pills contaminates drinking reservoirs.',
  },
  {
    name: 'Plastic Grocery Polybag',
    category: 'Recyclable Plastic/Dry',
    binColor: 'Blue',
    action: 'Ensure free of food stains. Tie together into a larger bag for soft-plastic recycling.',
    recyclable: true,
    tip: 'Prefer reusable cloth tote bags to eliminate plastic usage.',
  },
];

export default function GuidePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = KNOWLEDGE_BASE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span>Interactive Recycling Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Waste Segregation & Recycling Guide
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Learn what to throw where. Quick search any item to discover its color-coded bin and safe disposal instructions.
          </p>
        </div>

        {/* 4-Bin Visual Palette Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Green Bin */}
          <div className="bg-white rounded-3xl p-5 border-t-4 border-emerald-500 border-x border-b border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Apple className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-gray-900">Green Bin: Wet Waste</span>
            </div>
            <p className="text-xs text-gray-600">
              Kitchen scraps, vegetable peels, fruit slices, leftovers, cooked food, tea leaves.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              ✓ 100% Composted locally
            </div>
          </div>

          {/* Blue Bin */}
          <div className="bg-white rounded-3xl p-5 border-t-4 border-blue-500 border-x border-b border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-gray-900">Blue Bin: Dry Recyclables</span>
            </div>
            <p className="text-xs text-gray-600">
              Clean paper, carton boxes, plastic bottles, soda cans, rinsed glass jars, milk bags.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              ✓ Processed at recycling plants
            </div>
          </div>

          {/* Yellow Bin */}
          <div className="bg-white rounded-3xl p-5 border-t-4 border-amber-500 border-x border-b border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-gray-900">Yellow: E-Waste & Cables</span>
            </div>
            <p className="text-xs text-gray-600">
              Batteries, old charger cords, broken remotes, CFL bulbs, circuit cards, toys.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
              ✓ Specialized chemical extraction
            </div>
          </div>

          {/* Red Bin */}
          <div className="bg-white rounded-3xl p-5 border-t-4 border-rose-500 border-x border-b border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Syringe className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-gray-900">Red: Medical & Hazard</span>
            </div>
            <p className="text-xs text-gray-600">
              Syringes, bandages, expired pills, diapers, sanitizers, pesticide sprays.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
              ⚠️ Incinerated under NHRC protocol
            </div>
          </div>
        </div>

        {/* Interactive "Can I Recycle This?" Tool */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                &ldquo;Can I Recycle This?&rdquo; Instant Lookup
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Type any household item to see disposal directions.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search item (e.g. bottle, battery, apple, cable)..."
                className="w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-400 text-[11px] font-semibold">Quick lookups:</span>
            {['Bottle', 'Battery', 'Apple', 'Needle', 'Pizza Box', 'Cable', 'Medicine'].map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchTerm(kw)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-gray-700 text-[11px] font-medium transition"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredItems.map((item, idx) => {
              const binBadgeColor = {
                Green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                Blue: 'bg-blue-100 text-blue-800 border-blue-300',
                Yellow: 'bg-amber-100 text-amber-800 border-amber-300',
                Red: 'bg-rose-100 text-rose-800 border-rose-300',
                Black: 'bg-gray-100 text-gray-800 border-gray-300',
              }[item.binColor];

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 p-4 bg-slate-50/60 hover:bg-white hover:shadow-xs transition space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${binBadgeColor}`}>
                      {item.binColor} Bin
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{item.action}</p>

                  <div className="text-[11px] text-gray-500 italic bg-white/80 p-2 rounded-lg border border-gray-100">
                    💡 <strong>Tip:</strong> {item.tip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Home Composting 4-Step DIY Guide */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-300" />
            <h2 className="text-2xl font-bold tracking-tight">How To Compost Wet Waste At Home</h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Home composting eliminates up to 60% of domestic waste before it reaches the municipal transport system, generating free fertilizer for gardens and potted plants.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-2">
              <span className="font-extrabold text-emerald-300 text-sm block">1. Pot / Drum</span>
              <p className="text-emerald-50">Use a clay pot, plastic bucket, or wooden bin with aeration holes drilled in the sides and lid.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-2">
              <span className="font-extrabold text-emerald-300 text-sm block">2. Layering</span>
              <p className="text-emerald-50">Alternate 1 layer of wet kitchen scraps (green) with 1 layer of dry leaves/sawdust (brown) to prevent odor.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-2">
              <span className="font-extrabold text-emerald-300 text-sm block">3. Aerate</span>
              <p className="text-emerald-50">Stir the compost mixture once a week with a garden trowel to supply oxygen for helpful microbes.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-2">
              <span className="font-extrabold text-emerald-300 text-sm block">4. Harvest</span>
              <p className="text-emerald-50">After 30-45 days, you get rich, dark, pleasant-smelling organic compost ready for plants!</p>
            </div>
          </div>
        </div>

        {/* CTA to Report */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 mb-3">Notice dumped recyclable or hazardous materials in your street?</p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Report Waste to Municipality <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
