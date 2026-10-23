import React from 'react';
import {
  Trash2,
  Star,
  AlertTriangle,
  MessageSquare,
  Utensils,
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

  return (
    <div className="space-y-6">
      <div className="border-b border-cream-200 pb-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          {t.admin.reviewModTitle} ({reviews.length})
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          {t.admin.reviewModDesc}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="warm-card rounded-2xl p-12 text-center bg-white">
          <MessageSquare className="h-8 w-8 text-charcoal-500 mx-auto mb-2" />
          <p className="font-serif text-lg font-bold text-charcoal-900">
            {t.admin.reviewsEmpty}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`warm-card rounded-2xl p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-l-4 ${
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
