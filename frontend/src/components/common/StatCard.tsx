import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'navy' | 'emerald' | 'gold' | 'crimson' | 'blue';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'navy',
  trend
}) => {
  const colorStyles = {
    navy: 'bg-blue-50/80 text-gov-navy border-blue-200',
    emerald: 'bg-emerald-50/80 text-emerald-700 border-emerald-200',
    gold: 'bg-amber-50/80 text-amber-800 border-amber-200',
    crimson: 'bg-red-50/80 text-red-700 border-red-200',
    blue: 'bg-sky-50/80 text-sky-700 border-sky-200',
  };

  const iconBgStyles = {
    navy: 'bg-gov-navy text-white',
    emerald: 'bg-emerald-600 text-white',
    gold: 'bg-amber-500 text-white',
    crimson: 'bg-red-600 text-white',
    blue: 'bg-sky-600 text-white',
  };

  return (
    <div className={`p-4 rounded-xl border bg-white shadow-sm flex items-start justify-between transition hover:shadow-md`}>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        {trend && <p className="text-[10px] text-emerald-600 font-bold mt-1.5">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${iconBgStyles[color]} shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
