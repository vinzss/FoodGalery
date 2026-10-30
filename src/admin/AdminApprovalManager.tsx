import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Crown,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { AdminApprovalRequest } from '../types';
import { adminApi, ApiError } from '../auth/api';
import { useAuth } from '../auth/AuthContext';
import { useAuthText, useErrorMessage } from '../auth/authText';
import { FormAlert } from '../components/auth/AuthUI';
import { AddAdminModal } from './UserManager';

interface AdminApprovalManagerProps {
  onToast: (message: string) => void;
  onAuthLost: () => void;
  onPendingCountChange?: (count: number) => void;
}

export const AdminApprovalManager: React.FC<AdminApprovalManagerProps> = ({
  onToast,
  onAuthLost,
  onPendingCountChange,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const { isMainAdmin } = useAuth();

  const [requests, setRequests] = useState<AdminApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleError = useCallback(
    (err: unknown) => {
      const code = err instanceof ApiError ? err.code : 'UNKNOWN_ERROR';
      if (
        err instanceof ApiError &&
        (err.status === 401 ||
          code === 'BANNED' ||
          (err.status === 403 && code === 'FORBIDDEN'))
      ) {
        onAuthLost();
        return;
      }
      setError(errorMessage(code));
    },
    [errorMessage, onAuthLost]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { requests: list } = await adminApi.listAdminRequests();
      setRequests(list);
      const pendingCount = list.filter((r) => r.status === 'pending').length;
      onPendingCountChange?.(pendingCount);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError, onPendingCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (
    id: number,
    decision: 'approved' | 'rejected'
  ) => {
    setBusyId(id);
    setError('');
    try {
      await adminApi.decideAdminRequest(id, decision);
      onToast(
        decision === 'approved'
          ? a.admin.toastApprovedAdmin
          : a.admin.toastRejectedAdmin
      );
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="rounded-3xl bg-white border border-cream-200 p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-[11px] font-bold text-amber-900 mb-2">
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            <span>
              {isMainAdmin
                ? 'Otoritas Super Admin Utama (calvin) Aktif'
                : 'Wajib Konfirmasi Super Admin Utama (calvin)'}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-terracotta" />
            {a.admin.approvalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            {a.admin.approvalSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
          >
            <UserPlus className="h-4 w-4" />
            {a.admin.addAdminBtn}
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-cream-100 hover:bg-cream-200 px-4 py-2.5 text-xs font-bold text-charcoal-800 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {a.admin.refresh}
          </button>
        </div>
      </div>

      {!isMainAdmin && (
        <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              Mode Admin Biasa — Menunggu Persetujuan Main Admin
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Anda dapat mengajukan pengguna atau mendaftarkan kandidat Admin
              baru melalui tombol <strong>{a.admin.addAdminBtn}</strong>, namun
              hak akses Admin baru akan aktif setelah disetujui oleh akun{' '}
              <strong>Main Admin (@calvin)</strong>.
            </p>
          </div>
        </div>
      )}

      {error && <FormAlert>{error}</FormAlert>}

      {!loading && requests.length === 0 ? (
        <div className="rounded-2xl bg-cream-50 border border-cream-200 p-10 text-center space-y-2">
          <ShieldCheck className="h-8 w-8 text-charcoal-500 mx-auto" />
          <p className="font-serif text-lg font-bold text-charcoal-900">
            {a.admin.approvalEmpty}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingCount > 0 && (
            <p className="text-xs font-bold uppercase tracking-wider text-terracotta-dark">
              Menunggu Konfirmasi Main Admin ({pendingCount})
            </p>
          )}
          {requests.map((req) => {
            const isPending = req.status === 'pending';
            const busy = busyId === req.id;

            return (
              <div
                key={req.id}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                  isPending
                    ? 'bg-amber-50/50 border-amber-300'
                    : req.status === 'approved'
                      ? 'bg-olive-50/30 border-olive/30'
                      : 'bg-cream-50 border-cream-200 opacity-80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-base font-bold text-charcoal-900">
                      @{req.targetUsername}
                    </span>
                    <span className="text-xs text-charcoal-500">
                      ({req.targetEmail})
                    </span>

                    {req.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                        <Clock className="h-3 w-3" />
                        {a.admin.pending}
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-olive text-white px-2.5 py-0.5 text-[11px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        Disetujui Main Admin
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-200 text-red-700 px-2.5 py-0.5 text-[11px] font-bold">
                        <XCircle className="h-3 w-3" />
                        {a.admin.rejected}
                      </span>
                    )}
                  </div>

                  {req.reason && (
                    <p className="text-xs sm:text-sm text-charcoal-800 bg-white/80 rounded-xl px-3 py-2 border border-cream-200">
                      <strong className="text-charcoal-900">
                        {a.admin.note}:
                      </strong>{' '}
                      {req.reason}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-charcoal-500 pt-1">
                    <span>
                      {a.admin.requestedBy}:{' '}
                      <strong className="text-charcoal-800">
                        @{req.requestedByUsername}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{new Date(req.createdAt).toLocaleString()}</span>
                    {req.reviewedByUsername && (
                      <>
                        <span>•</span>
                        <span>
                          {a.admin.reviewedBy}:{' '}
                          <strong className="text-charcoal-800">
                            @{req.reviewedByUsername}
                          </strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {isPending && isMainAdmin && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDecision(req.id, 'approved')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-olive hover:bg-olive-dark disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {a.admin.approveAdminBtn}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDecision(req.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 disabled:opacity-50 px-4 py-2.5 text-xs font-bold transition"
                    >
                      <XCircle className="h-4 w-4" />
                      {a.admin.rejectAdminBtn}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <AddAdminModal
          isMainAdmin={isMainAdmin}
          onClose={() => setShowAddModal(false)}
          onCreated={(pendingApproval) => {
            setShowAddModal(false);
            onToast(
              pendingApproval
                ? a.admin.toastAdminPending
                : a.admin.toastAdminCreated
            );
            load();
          }}
          onError={handleError}
        />
      )}
    </div>
  );
};
