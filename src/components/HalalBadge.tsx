import React from 'react';
import { CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { HalalStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HalalBadgeProps {
  status: HalalStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const HalalBadge: React.FC<HalalBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  const { lang } = useLanguage();

  const config = {
    Halal: {
      label: 'Halal',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className={size === 'sm' ? 'h-3 w-3 text-emerald-700' : 'h-3.5 w-3.5 text-emerald-700'} />,
    },
    'Non-Halal': {
      label: 'Non-Halal',
      bg: 'bg-red-100 text-red-800 border-red-300',
      icon: <AlertOctagon className={size === 'sm' ? 'h-3 w-3 text-red-700' : 'h-3.5 w-3.5 text-red-700'} />,
    },
    'Belum Ada Sertifikasi': {
      label: lang === 'id' ? 'Belum Ada Sertifikasi' : 'No Certification Yet',
      bg: 'bg-stone-100 text-stone-700 border-stone-300',
      icon: <HelpCircle className={size === 'sm' ? 'h-3 w-3 text-stone-600' : 'h-3.5 w-3.5 text-stone-600'} />,
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold shadow-sm ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
