import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Store,
  MessageSquareWarning,
  ClipboardCheck,
  ArrowLeft,
  CheckCircle2,
  X,
  LogOut,
  Users,
  LifeBuoy,
} from 'lucide-react';
import {
  Restaurant,
  UserReview,
  CommunitySubmission,
} from '../types';
import { SubmissionQueue } from './SubmissionQueue';
import { UmkmManager, UmkmFormPayload } from './UmkmManager';
import { ReviewModerator } from './ReviewModerator';
import { UserManager } from './UserManager';
import { ResetRequests } from './ResetRequests';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuthText } from '../auth/authText';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  reviews: UserReview[];
  submissions: CommunitySubmission[];
  onApproveSubmission: (submissionId: string) => void;
  onRejectSubmission: (submissionId: string) => void;
  onSaveRestaurant: (payload: UmkmFormPayload) => void;
  onDeleteRestaurant: (restaurantId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  onBackToSite: () => void;
  onLogout: () => void;
  /** Username admin yang sedang login */
  adminUsername: string;
  /** Dipanggil jika API admin menolak (sesi habis / role dicabut / dibanned) */
  onAuthLost: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  reviews,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
  onSaveRestaurant,
  onDeleteRestaurant,
  onDeleteReview,
  onBackToSite,
  onLogout,
  adminUsername,
  onAuthLost,
}) => {
  const { t } = useLanguage();
  const a = useAuthText();
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'umkm' | 'reviews' | 'users' | 'reset-requests'
  >('umkm');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setAdminToast(message);
    setTimeout(() => setAdminToast(null), 3500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      {/* Floating Admin Feedback Toast */}
      <AnimatePresence>
        {adminToast && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 sm:right-8 z-50 warm-card rounded-2xl bg-charcoal-900 text-white px-5 py-4 shadow-warm-lg flex items-center gap-3 max-w-md"
          >
            <CheckCircle2 className="h-5 w-5 text-olive-light shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{adminToast}</span>
            <button
              type="button"
              onClick={() => setAdminToast(null)}
              className="text-cream-200 hover:text-white ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header Banner */}
      <section className="warm-card rounded-3xl p-6 sm:p-10 bg-white border border-cream-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-olive-50 border border-olive/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-olive-dark">
              <Shield className="h-3.5 w-3.5 text-olive" />
              <span>{t.admin.badge} • {adminUsername}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {t.admin.title}
            </h1>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              {t.admin.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 rounded-xl bg-cream-100 hover:bg-cream-200 px-4 py-2.5 text-xs font-bold text-charcoal-800 transition"
            >
              <ArrowLeft className="h-4 w-4 text-terracotta" />
              <span>{t.admin.backToPublicSite}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 px-4 py-2.5 text-xs font-bold transition"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.admin.logoutBtn}</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-cream-200">
          <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-charcoal-600 block">
                {t.admin.statsActiveUmkm}
              </span>
              <span className="font-serif text-3xl font-bold text-olive-dark">
                {restaurants.length}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-olive-50 flex items-center justify-center text-olive">
              <Store className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-charcoal-600 block">
                {t.admin.statsPendingQueue}
              </span>
              <span className="font-serif text-3xl font-bold text-terracotta-dark">
                {submissions.length}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-terracotta-50 flex items-center justify-center text-terracotta">
              <ClipboardCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-charcoal-600 block">
                {t.admin.statsTotalReviews}
              </span>
              <span className="font-serif text-3xl font-bold text-charcoal-900">
                {reviews.length}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-cream-200/70 flex items-center justify-center text-charcoal-800">
              <MessageSquareWarning className="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl bg-cream-100 p-1.5 border border-cream-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('umkm')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'umkm'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-charcoal-700 hover:text-charcoal-900'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>
            {t.admin.tabUmkm} ({restaurants.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-charcoal-700 hover:text-charcoal-900'
          }`}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span>{t.admin.tabSubmissions}</span>
          {submissions.length > 0 && (
            <span
              className={`rounded-full px-2 py-0.2 text-[11px] ${
                activeTab === 'submissions'
                  ? 'bg-white/25 text-white'
                  : 'bg-terracotta text-white'
              }`}
            >
              {submissions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reviews'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-charcoal-700 hover:text-charcoal-900'
          }`}
        >
          <MessageSquareWarning className="h-4 w-4" />
          <span>
            {t.admin.tabReviews} ({reviews.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-charcoal-700 hover:text-charcoal-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{a.admin.tabUsers}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reset-requests')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'reset-requests'
              ? 'bg-terracotta text-white shadow-sm'
              : 'text-charcoal-700 hover:text-charcoal-900'
          }`}
        >
          <LifeBuoy className="h-4 w-4" />
          <span>{a.admin.tabResetRequests}</span>
        </button>
      </div>

      {/* Active Admin Module */}
      <div>
        {activeTab === 'umkm' && (
          <UmkmManager
            restaurants={restaurants}
            onSaveRestaurant={(payload) => {
              onSaveRestaurant(payload);
              triggerToast(
                payload.editingId
                  ? t.admin.umkmUpdatedToast
                  : t.admin.umkmAddedToast
              );
            }}
            onDeleteRestaurant={(id) => {
              onDeleteRestaurant(id);
              triggerToast(t.admin.umkmDeletedToast);
            }}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionQueue
            submissions={submissions}
            onApprove={(id) => {
              onApproveSubmission(id);
              triggerToast(t.admin.approvedToast);
            }}
            onReject={(id) => {
              onRejectSubmission(id);
            }}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewModerator
            reviews={reviews}
            onDeleteReview={(id) => {
              onDeleteReview(id);
              triggerToast(t.admin.reviewDeletedToast);
            }}
          />
        )}

        {activeTab === 'users' && (
          <UserManager onToast={triggerToast} onAuthLost={onAuthLost} />
        )}

        {activeTab === 'reset-requests' && (
          <ResetRequests onToast={triggerToast} onAuthLost={onAuthLost} />
        )}
      </div>
    </div>
  );
};
