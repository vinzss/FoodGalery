import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, LifeBuoy, RefreshCw, XCircle } from 'lucide-react';
import { PasswordResetRequest } from '../types';
import { adminApi, ApiError } from '../auth/api';
import { useAuthText, useErrorMessage } from '../auth/authText';
import { FormAlert } from '../components/auth/AuthUI';
import { ResetPasswordModal } from './UserManager';

interface ResetRequestsProps {
  onToast: (message: string) => void;
  onAuthLost: () => void;
  onPendingCountChange?: (count: number) => void;
}

/** Dashboard permintaan "Lupa Password" yang dikirim user ke admin. */
export const ResetRequests: React.FC<ResetRequestsProps> = ({
  onToast,
  onAuthLost,
  onPendingCountChange,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetTarget, setResetTarget] = useState<PasswordResetRequest | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        onAuthLost();
        return;
      }
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    },
    [errorMessage, onAuthLost]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { requests } = await adminApi.listResetRequests();
      setRequests(requests);
      onPendingCountChange?.(requests.filter((r) => r.status === 'pending').length);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError, onPendingCountChange]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: number, status: 'resolved' | 'rejected') => {
    try {
      await adminApi.setResetRequestStatus(id, status);
      onToast(a.admin.toastUpdated);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  const statusStyle: Record<PasswordResetRequest['status'], string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    resolved: 'bg-olive-50 text-olive-dark border-olive/30',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="warm-card rounded-3xl bg-white border border-cream-200 p-5 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-terracotta" />
            {a.admin.requestsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{a.admin.requestsSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-cream-100 hover:bg-cream-200 px-4 py-2.5 text-xs font-bold text-charcoal-800 transition self-start"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {a.admin.refresh}
        </button>
      </div>

      {error && <FormAlert>{error}</FormAlert>}

      {!loading && requests.length === 0 ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">{a.admin.requestsEmpty}</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                r.status === 'pending' ? 'bg-amber-50/40 border-amber-200' : 'bg-cream-50 border-cream-200'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-charcoal-900">@{r.username}</span>
                  <span className="text-xs text-charcoal-500">{r.email}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusStyle[r.status]}`}>
                    {a.admin[r.status]}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500">
                  {new Date(r.createdAt).toLocaleString()}
                  {r.handledBy && ` • ${a.admin.handledBy} ${r.handledBy}`}
                </p>
                {r.note && (
                  <p className="text-xs text-charcoal-700 bg-white rounded-lg border border-cream-200 px-3 py-2 mt-1 break-words">
                    <span className="font-bold">{a.admin.note}:</span> {r.note}
                  </p>
                )}
              </div>

              {r.status === 'pending' && (
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setResetTarget(r)}
                    className="inline-flex items-center gap-1 rounded-lg bg-terracotta hover:bg-terracotta-dark px-3 py-2 text-[11px] font-bold text-white shadow-sm"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    {a.admin.resetPassword}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(r.id, 'resolved')}
                    className="inline-flex items-center gap-1 rounded-lg bg-olive-50 hover:bg-olive hover:text-white border border-olive/30 px-3 py-2 text-[11px] font-bold text-olive-dark"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {a.admin.markResolved}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(r.id, 'rejected')}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 px-3 py-2 text-[11px] font-bold text-red-700"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {a.admin.reject}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resetTarget && (
        <ResetPasswordModal
          target={{ id: resetTarget.userId, username: resetTarget.username }}
          onClose={() => setResetTarget(null)}
          onDone={() => {
            setResetTarget(null);
            onToast(a.admin.toastReset);
            load();
          }}
          onError={handleError}
        />
      )}
    </div>
  );
};
