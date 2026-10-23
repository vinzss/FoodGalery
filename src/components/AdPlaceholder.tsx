import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AdPlaceholderProps {
  variant?: 'leaderboard' | 'rectangle' | 'in-feed' | 'article-inline';
  className?: string;
  onPartnerClick?: () => void;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  variant = 'leaderboard',
  className = '',
  onPartnerClick,
}) => {
  const { lang, t } = useLanguage();

  const content = {
    leaderboard: {
      headline:
        lang === 'id'
          ? 'Festival Kuliner Pilihan — Akhir Pekan Ini di Sunter, Kelapa Gading & Kemayoran'
          : 'Jakarta Local Culinary Festival — This Weekend across Sunter, Kelapa Gading & Kemayoran',
      subtext:
        lang === 'id'
          ? 'Nikmati sajian lebih dari 40 UMKM pilihan mulai dari bakmi tradisional, es kopi saring, hingga hidangan Nusantara.'
          : 'Savor dishes from over 40 curated local kitchens featuring handmade noodles, artisan coffee, and heritage comfort food.',
    },
    rectangle: {
      headline:
        lang === 'id'
          ? 'Jelajahi Rute Kuliner Malam Mangga Besar, Kemayoran & Senen'
          : 'Explore the Night Culinary Trail of Mangga Besar, Kemayoran & Senen',
      subtext:
        lang === 'id'
          ? 'Temukan deretan tempat makan legendaris dan jajanan tradisional bersama komunitas Food Album.'
          : 'Discover heritage eateries and warm evening comfort dishes with the Food Album community.',
    },
    'in-feed': {
      headline:
        lang === 'id'
          ? 'Punya Rekomendasi Tempat Makan Favorit di Jakarta?'
          : 'Know a Hidden Culinary Gem in Jakarta?',
      subtext:
        lang === 'id'
          ? 'Bagikan tempat makan langganan Anda di Sunter, Kelapa Gading, Kemayoran, Mangga Besar, atau Senen.'
          : 'Share your favorite neighborhood dining spot so fellow food lovers can discover it too.',
    },
    'article-inline': {
      headline:
        lang === 'id'
          ? 'Dukung UMKM Kuliner Lokal Bersama Food Album'
          : 'Support Local Culinary UMKM with Food Album',
      subtext:
        lang === 'id'
          ? 'Kirimkan saran tempat makan atau ulasan jujur Anda untuk dikurasi oleh tim redaksi kami.'
          : 'Submit a dining spot recommendation or honest review to be curated by our editorial desk.',
    },
  }[variant];

  return (
    <div
      role="complementary"
      className={`relative overflow-hidden rounded-2xl border border-terracotta/25 bg-gradient-to-br from-terracotta-50 via-cream-50 to-olive-50 p-5 sm:p-6 shadow-warm transition-all duration-300 hover:border-terracotta/45 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-cream-200">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-terracotta-dark">
          <Sparkles className="h-3 w-3" />
          {t.ad.sponsoredLabel}
        </span>
      </div>

      <div
        className={`flex ${
          variant === 'rectangle' || variant === 'in-feed'
            ? 'flex-col justify-between gap-4'
            : 'flex-col md:flex-row md:items-center justify-between gap-4'
        }`}
      >
        <div className="space-y-1.5 max-w-2xl">
          <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 leading-snug">
            {content.headline}
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {content.subtext}
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onPartnerClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 text-xs font-semibold transition-all duration-200 shadow-sm"
          >
            <span>{t.ad.partnerCta}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
