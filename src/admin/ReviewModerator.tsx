import React, { useMemo, useState } from 'react';
import {
  Trash2,
  Star,
  AlertTriangle,
  MessageSquare,
  Utensils,
  Search,
} from 'lucide-react';
import { UserReview } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ReviewModeratorProps {
  reviews: UserReview[];
  onDeleteReview: (reviewId: string) => void;
}

export const ReviewModerator: React.FC<ReviewModeratorProps> = ({
  reviews,
  onDeleteReview,
}) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const flaggedCount = useMemo(
    () => reviews.filter((r) => r.isFlagged).length,
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (onlyFlagged && !r.isFlagged) return false;
      if (!q) return true;
      return (
        r.reviewerName.toLowerCase().includes(q) ||
        r.restaurantName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.favoriteDish && r.favoriteDish.toLowerCase().includes(q))
      );
    });
  }, [reviews, search, onlyFlagged]);

  return (
    <div className="rounded-3xl bg-white border border-cream-200 p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Comment Manager — {t.admin.reviewModTitle} ({reviews.length})
          </h2>
          <p className="text-sm text-charcoal-600 mt-1">
            {t.admin.reviewModDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyFlagged(false)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              !onlyFlagged
                ? 'bg-charcoal-900 text-white'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            Semua Komentar ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setOnlyFlagged(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              onlyFlagged
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Dilaporkan ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-4 w-4 text-charcoal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama pengulas, nama tempat makan, atau isi komentar..."
          className="w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
        />
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-cream-50 border border-cream-200">
          <MessageSquare className="h-8 w-8 text-charcoal-500 mx-auto mb-2" />
          <p className="font-serif text-lg font-bold text-charcoal-900">
            {t.admin.reviewsEmpty}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-2xl border border-cream-200 p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-l-4 ${
                rev.isFlagged
                  ? 'border-l-red-500 bg-red-50/30'
                  : 'border-l-olive'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-base font-bold text-charcoal-900">
                    {rev.reviewerName}
                  </span>
                  <span className="text-xs text-charcoal-500">•</span>
                  <span className="text-xs font-semibold text-terracotta-dark flex items-center gap-1">
                    <Utensils className="h-3 w-3" />
                    {rev.restaurantName}
                  </span>
                  <span className="text-xs text-charcoal-500">
                    • {rev.createdAt}
                  </span>

                  <div className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-bold text-charcoal-900">
                    <Star className="h-3 w-3 fill-terracotta text-terracotta" />
                    <span>{rev.rating}.0</span>
                  </div>

                  {rev.isFlagged && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-300 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      {t.admin.flaggedBadge}
                    </span>
                  )}
                </div>

                {rev.favoriteDish && rev.favoriteDish !== '-' && (
                  <p className="text-xs font-semibold text-olive-dark">
                    {t.detail.favoriteDishLabel} {rev.favoriteDish}
                  </p>
                )}

                <p className="text-sm text-charcoal-800 leading-relaxed">
                  “{rev.comment}”
                </p>
              </div>

              {/* Prominent Red Delete Button */}
              <div className="shrink-0 flex justify-end">
                <button
                  type="button"
                  onClick={() => onDeleteReview(rev.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t.admin.deleteReviewBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
