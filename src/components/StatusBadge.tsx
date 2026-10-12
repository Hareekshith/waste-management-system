import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ComplaintStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const normalized = (status || 'Pending').trim();

  let colorClasses = 'bg-amber-100 text-amber-800 border-amber-300';
  let Icon = Clock;

  if (normalized === 'Completed') {
    colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    Icon = CheckCircle2;
  } else if (normalized === 'In Progress') {
    colorClasses = 'bg-blue-100 text-blue-800 border-blue-300';
    Icon = RefreshCw;
  } else if (normalized === 'Rejected' || normalized.toLowerCase().includes('valid')) {
    colorClasses = 'bg-rose-100 text-rose-800 border-rose-300';
    Icon = AlertCircle;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={`h-3.5 w-3.5 ${normalized === 'In Progress' ? 'animate-spin' : ''}`} />}
      {normalized}
    </span>
  );
};
