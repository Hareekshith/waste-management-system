'use client';

import React from 'react';
import { Apple, Package, Trash2, AlertTriangle, Zap, Syringe, Layers } from 'lucide-react';

export interface WasteCategoryOption {
  id: string;
  label: string;
  icon: any;
  color: string;
  borderColor: string;
  bgSelected: string;
  description: string;
  examples: string;
}

export const WASTE_CATEGORIES: WasteCategoryOption[] = [
  {
    id: 'Organic',
    label: 'Organic / Wet Waste',
    icon: Apple,
    color: 'text-emerald-700',
    borderColor: 'border-emerald-500',
    bgSelected: 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20',
    description: 'Decomposable food and garden remnants',
    examples: 'Fruit peels, vegetable waste, leftovers, garden leaves, tea bags',
  },
  {
    id: 'Plastic',
    label: 'Plastic & Packaging',
    icon: Package,
    color: 'text-blue-700',
    borderColor: 'border-blue-500',
    bgSelected: 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20',
    description: 'Clean recyclable plastics and wrappers',
    examples: 'Bottles, grocery bags, milk pouches, snack wrappers, takeout boxes',
  },
  {
    id: 'Household',
    label: 'Household Mixed Trash',
    icon: Trash2,
    color: 'text-amber-700',
    borderColor: 'border-amber-500',
    bgSelected: 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20',
    description: 'General domestic rubbish and everyday dry items',
    examples: 'Dust, broken ceramics, old clothes, sweepings, soiled wrappers',
  },
  {
    id: 'E-Waste',
    label: 'Electronic (E-Waste)',
    icon: Zap,
    color: 'text-violet-700',
    borderColor: 'border-violet-500',
    bgSelected: 'bg-violet-50 border-violet-500 ring-2 ring-violet-500/20',
    description: 'Old electronics, wires, cords, and gadgets',
    examples: 'Batteries, broken chargers, phone screens, light bulbs, circuit boards',
  },
  {
    id: 'Medical',
    label: 'Medical & Hazardous',
    icon: Syringe,
    color: 'text-rose-700',
    borderColor: 'border-rose-500',
    bgSelected: 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20',
    description: 'Biohazard & clinical items requiring careful disposal',
    examples: 'Bandages, syringes, expired medicines, face masks, chemical bottles',
  },
  {
    id: 'Inorganic',
    label: 'Inorganic / Scrap Metals & Glass',
    icon: Layers,
    color: 'text-cyan-700',
    borderColor: 'border-cyan-500',
    bgSelected: 'bg-cyan-50 border-cyan-500 ring-2 ring-cyan-500/20',
    description: 'Glass bottles, aluminum cans, construction debris',
    examples: 'Soda cans, broken mirrors, jars, tin plates, construction scrap',
  },
];

interface WasteTypeSelectorProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({
  selectedTypes,
  onChange,
}) => {
  const toggleType = (id: string) => {
    if (selectedTypes.includes(id)) {
      if (selectedTypes.length === 1) return; // keep at least 1
      onChange(selectedTypes.filter(t => t !== id));
    } else {
      onChange([...selectedTypes, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <span>Waste Classification</span>
          <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Select one or more
          </span>
        </label>
        <span className="text-xs text-gray-500">
          Selected: {selectedTypes.join(', ')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {WASTE_CATEGORIES.map((cat) => {
          const isSelected = selectedTypes.includes(cat.id);
          const Icon = cat.icon;

          return (
            <div
              key={cat.id}
              onClick={() => toggleType(cat.id)}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? cat.bgSelected
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-white shadow-sm' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${cat.color}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {cat.label}
                  </span>
                </div>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-2.5">
                <p className="text-xs text-gray-600">{cat.description}</p>
                <p className="mt-1 text-[11px] text-gray-500 italic">
                  e.g. {cat.examples}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
