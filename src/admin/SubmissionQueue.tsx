import React from 'react';
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Utensils,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { CommunitySubmission } from '../types';
import { HalalBadge } from '../components/HalalBadge';
import { useLanguage } from '../i18n/LanguageContext';

interface SubmissionQueueProps {
  submissions: CommunitySubmission[];
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
}

export const SubmissionQueue: React.FC<SubmissionQueueProps> = ({
  submissions,
  onApprove,
  onReject,
}) => {
  const { t, translateCuisine } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="border-b border-cream-200 pb-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          {t.admin.queueTitle} ({submissions.length})
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">{t.admin.queueDesc}</p>
      </div>

      {submissions.length === 0 ? (
        <div className="warm-card rounded-2xl p-12 text-center bg-white space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-olive-50 border border-olive/30 flex items-center justify-center text-olive">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="font-serif text-xl font-bold text-charcoal-900">
            {t.admin.queueEmpty}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {submissions.map((item) => (
            <div
              key={item.id}
              className="warm-card rounded-2xl p-5 sm:p-6 bg-white flex flex-col lg:flex-row gap-6 items-stretch justify-between"
            >
              {/* Left Image & Details */}
              <div className="flex flex-col sm:flex-row gap-5 flex-1">
                <img
                  src={item.photoUrl}
                  alt={item.restaurantName}
                  className="h-44 sm:h-36 sm:w-44 rounded-xl object-cover shrink-0 bg-cream-100"
                />

                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-terracotta-50 border border-terracotta/25 px-3 py-0.5 text-xs font-semibold text-terracotta-dark">
                      <MapPin className="h-3 w-3" />
                      {item.neighborhood}
                    </span>
                    <HalalBadge status={item.halalStatus} size="sm" />
                    <span className="rounded-full bg-cream-100 px-3 py-0.5 text-xs font-semibold text-charcoal-700">
                      {translateCuisine(item.cuisine)}
                    </span>
                    <span className="rounded-full bg-olive-50 px-3 py-0.5 text-xs font-bold text-olive-dark">
                      {item.priceTier} • {item.estimatedPriceIdr}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                    {item.restaurantName}
                  </h3>

                  <p className="text-xs text-charcoal-600">{item.address}</p>

                  <div className="rounded-xl bg-cream-50 border border-cream-200 p-3 space-y-1">
                    <p className="text-xs font-bold text-olive-dark flex items-center gap-1.5">
                      <Utensils className="h-3.5 w-3.5 text-terracotta" />
                      <span>
                        {t.admin.signatureDish} {item.signatureDish}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                      “{item.reason}”
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-charcoal-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-charcoal-500" />
                      {t.admin.submittedBy}{' '}
                      <strong className="text-charcoal-800">
                        {item.submittedBy}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-charcoal-500" />
                      {item.submittedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex sm:flex-row lg:flex-col justify-end lg:justify-center gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-cream-200 pt-4 lg:pt-0 lg:pl-6">
                <button
                  type="button"
                  onClick={() => onApprove(item.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive hover:bg-olive-dark text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t.admin.approveBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 px-5 py-2.5 text-xs font-bold transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{t.admin.rejectBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
