import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Store,
  MessageSquareWarning,
  ClipboardCheck,
  CheckCircle2,
  X,
  LogOut,
  Users,
  LifeBuoy,
  Crown,
  Eye,
  ShieldCheck,
  Terminal,
  Activity,
} from 'lucide-react';
import {
  Restaurant,
  UserReview,
  CommunitySubmission,
  UserRole,
} from '../types';
import { SubmissionQueue } from './SubmissionQueue';
import { UmkmManager, UmkmFormPayload } from './UmkmManager';
import { ReviewModerator } from './ReviewModerator';
import { UserManager } from './UserManager';
import { AdminApprovalManager } from './AdminApprovalManager';
import { ResetRequests } from './ResetRequests';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuthText } from '../auth/authText';
import { adminApi } from '../auth/api';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  reviews: UserReview[];
  submissions: CommunitySubmission[];
  onApproveSubmission: (submissionId: string) => void;
  onRejectSubmission: (submissionId: string) => void;
  onSaveRestaurant: (payload: UmkmFormPayload) => void;
  onDeleteRestaurant: (restaurantId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  /** Beralih ke mode pratinjau tampilan user publik tanpa keluar dari sesi admin */
  onSwitchToUserView: () => void;
  onLogout: () => void;
  adminUsername: string;
  adminRole: UserRole;
  onAuthLost: () => void;
}

type AdminTab =
  | 'umkm'
  | 'submissions'
  | 'reviews'
  | 'users'
  | 'admin-requests'
  | 'reset-requests';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  reviews,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
  onSaveRestaurant,
  onDeleteRestaurant,
  onDeleteReview,
  onSwitchToUserView,
  onLogout,
  adminUsername,
  adminRole,
  onAuthLost,
}) => {
  const { t } = useLanguage();
  const a = useAuthText();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [pendingAdminApprovals, setPendingAdminApprovals] = useState<number>(0);

  const isMainAdmin = adminRole === 'main_admin';

  useEffect(() => {
    let active = true;
    adminApi
      .listAdminRequests()
      .then(({ requests }) => {
        if (!active) return;
        setPendingAdminApprovals(
          requests.filter((r) => r.status === 'pending').length
        );
      })
      .catch(() => {
        // abaikan jika gagal memuat badge awal
      });
    return () => {
      active = false;
    };
  }, [activeTab]);

  const triggerToast = (message: string) => {
    setAdminToast(message);
    setTimeout(() => setAdminToast(null), 3500);
  };

  const navModules: {
    id: AdminTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'users',
      label: 'User & Ban Manager',
      sublabel: 'Daftar Akun & Blokir Pelanggar',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'admin-requests',
      label: a.admin.tabAdminRequests,
      sublabel: isMainAdmin
        ? 'Persetujuan Main Admin'
        : 'Antrean Konfirmasi Admin',
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: pendingAdminApprovals > 0 ? pendingAdminApprovals : undefined,
      badgeColor: 'bg-amber-500 text-charcoal-900',
    },
    {
      id: 'umkm',
      label: 'Post Manager (Kuliner)',
      sublabel: `${restaurants.length} Tempat Makan Aktif`,
      icon: <Store className="h-4 w-4" />,
    },
    {
      id: 'submissions',
      label: 'Moderasi Kiriman Post',
      sublabel: 'Rekomendasi Komunitas',
      icon: <ClipboardCheck className="h-4 w-4" />,
      badge: submissions.length > 0 ? submissions.length : undefined,
      badgeColor: 'bg-terracotta text-white',
    },
    {
      id: 'reviews',
      label: 'Comment Manager',
      sublabel: `${reviews.length} Komentar & Ulasan`,
      icon: <MessageSquareWarning className="h-4 w-4" />,
    },
    {
      id: 'reset-requests',
      label: a.admin.tabResetRequests,
      sublabel: 'Bantuan Pemulihan Akun',
      icon: <LifeBuoy className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-charcoal-900 text-charcoal-900 flex flex-col lg:flex-row">
      {/* Floating Admin Feedback Toast */}
      <AnimatePresence>
        {adminToast && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 rounded-2xl bg-charcoal-900 border border-olive/50 text-white px-5 py-4 shadow-2xl flex items-center gap-3 max-w-md"
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

      {/* LEFT SIDEBAR — Dedicated Dark Command Center Navigation (Distinct from User UI) */}
      <aside className="w-full lg:w-72 xl:w-80 bg-charcoal-900 text-white border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Brand & Command Center Identity */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-terracotta flex items-center justify-center text-white shadow-lg">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-tight text-white">
                    Food Album
                  </span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cream-200">
                    OS v2.4
                  </span>
                </div>
                <p className="text-xs text-cream-200/70">
                  Dynamic Admin Command Center
                </p>
              </div>
            </div>
          </div>

          {/* Active Admin Session Card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-cream-200/60 font-bold">
                Sesi Otoritas Aktif
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <Activity className="h-3 w-3" /> Online
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold uppercase text-sm ${
                  isMainAdmin
                    ? 'bg-amber-500 text-charcoal-900'
                    : 'bg-olive text-white'
                }`}
              >
                {adminUsername[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">
                  @{adminUsername}
                </p>
                {isMainAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 mt-0.5">
                    <Crown className="h-3 w-3" /> Super Admin Utama (Main Admin)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-olive/30 border border-olive-light/40 px-2 py-0.5 text-[10px] font-bold text-cream-100 mt-0.5">
                    <Shield className="h-3 w-3" /> Moderator Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Module Navigation */}
          <nav className="space-y-1.5" aria-label="Admin Modules">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-cream-200/50 mb-2">
              Modul Manajemen Sistem
            </p>
            {navModules.map((mod) => {
              const active = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveTab(mod.id)}
                  className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                    active
                      ? 'bg-terracotta text-white shadow-md'
                      : 'text-cream-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? 'bg-white/20' : 'bg-white/5'
                      }`}
                    >
                      {mod.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate">
                        {mod.label}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          active ? 'text-white/80' : 'text-cream-200/50'
                        }`}
                      >
                        {mod.sublabel}
                      </p>
                    </div>
                  </div>
                  {mod.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0 ${
                        active
                          ? 'bg-white text-terracotta-dark'
                          : mod.badgeColor || 'bg-terracotta text-white'
                      }`}
                    >
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Controls: Live Public View Switch & Logout */}
        <div className="p-5 sm:p-6 border-t border-white/10 space-y-2.5 bg-black/20">
          <button
            type="button"
            onClick={onSwitchToUserView}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-bold text-white transition"
          >
            <Eye className="h-4 w-4 text-amber-400" />
            <span>Pratinjau Situs Publik</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/30 px-4 py-2.5 text-xs font-bold transition"
          >
            <LogOut className="h-4 w-4" />
            <span>{t.admin.logoutBtn}</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE — High-Contrast Admin Operations Area */}
      <div className="flex-1 bg-cream-100 min-h-screen flex flex-col">
        {/* Top Command Header & Telemetry Bar */}
        <header className="bg-white border-b border-cream-200 px-5 sm:px-8 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-charcoal-900 text-white px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  <Shield className="h-3 w-3 text-terracotta" />
                  Dynamic Role-Based Admin Mode
                </span>
                <span className="text-xs text-charcoal-500 font-mono">
                  • Rute Statis /admin Dinonaktifkan
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
                {t.admin.title}
              </h1>
            </div>

            {/* Quick Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('umkm')}
                className="rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-200 px-3.5 py-2 text-left transition"
              >
                <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 block">
                  Post Aktif
                </span>
                <span className="font-serif text-xl font-bold text-olive-dark">
                  {restaurants.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className="rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-200 px-3.5 py-2 text-left transition"
              >
                <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 block">
                  Antrean Post
                </span>
                <span className="font-serif text-xl font-bold text-terracotta-dark">
                  {submissions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-200 px-3.5 py-2 text-left transition"
              >
                <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 block">
                  Komentar
                </span>
                <span className="font-serif text-xl font-bold text-charcoal-900">
                  {reviews.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin-requests')}
                className="rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 px-3.5 py-2 text-left transition"
              >
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 block">
                  Approval Admin
                </span>
                <span className="font-serif text-xl font-bold text-amber-800">
                  {pendingAdminApprovals}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Active Module Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'users' && (
            <UserManager onToast={triggerToast} onAuthLost={onAuthLost} />
          )}

          {activeTab === 'admin-requests' && (
            <AdminApprovalManager
              onToast={triggerToast}
              onAuthLost={onAuthLost}
              onPendingCountChange={setPendingAdminApprovals}
            />
          )}

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

          {activeTab === 'reset-requests' && (
            <ResetRequests onToast={triggerToast} onAuthLost={onAuthLost} />
          )}
        </main>
      </div>
    </div>
  );
};
