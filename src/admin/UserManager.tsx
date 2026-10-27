import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Ban,
  KeyRound,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import { AuthUser } from '../types';
import { adminApi, ApiError } from '../auth/api';
import { useAuth } from '../auth/AuthContext';
import { useAuthText, useErrorMessage } from '../auth/authText';
import { evaluatePassword } from '../auth/password';
import {
  FormAlert,
  PasswordInput,
  PasswordStrengthMeter,
} from '../components/auth/AuthUI';

interface UserManagerProps {
  onToast: (message: string) => void;
  /** Dipanggil saat request admin ditolak 401/403 (sesi habis / role dicabut) */
  onAuthLost: () => void;
}

type Filter = 'all' | 'admin' | 'user' | 'banned';

export function generateStrongPassword(length = 14): string {
  const sets = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnpqrstuvwxyz', '23456789', '!@#$%^&*?-_'];
  const all = sets.join('');
  const rand = (max: number) => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
  };
  const chars = sets.map((s) => s[rand(s.length)]);
  while (chars.length < length) chars.push(all[rand(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export const UserManager: React.FC<UserManagerProps> = ({ onToast, onAuthLost }) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const { user: me } = useAuth();

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [resetTarget, setResetTarget] = useState<AuthUser | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const code = err instanceof ApiError ? err.code : 'UNKNOWN_ERROR';
      if (err instanceof ApiError && (err.status === 401 || code === 'BANNED' || (err.status === 403 && code === 'FORBIDDEN'))) {
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
      const { users } = await adminApi.listUsers();
      setUsers(users);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAction = async (id: number, fn: () => Promise<unknown>, toast: string) => {
    setBusyId(id);
    setError('');
    try {
      await fn();
      onToast(toast);
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === 'admin' && u.role !== 'admin') return false;
      if (filter === 'user' && u.role !== 'user') return false;
      if (filter === 'banned' && !u.isBanned) return false;
      if (!q) return true;
      return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, query, filter]);

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    user: users.filter((u) => u.role === 'user').length,
    banned: users.filter((u) => u.isBanned).length,
  };

  const filterLabels: Record<Filter, string> = {
    all: a.admin.filterAll,
    admin: a.admin.filterAdmin,
    user: a.admin.filterUser,
    banned: a.admin.filterBanned,
  };

  return (
    <div className="warm-card rounded-3xl bg-white border border-cream-200 p-5 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-terracotta" />
            {a.admin.usersTitle}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">{a.admin.usersSubtitle}</p>
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

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-charcoal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={a.admin.searchPlaceholder}
            className="w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-terracotta"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-cream-100 p-1 border border-cream-200 w-fit">
          {(Object.keys(filterLabels) as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filter === f ? 'bg-terracotta text-white shadow-sm' : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              {filterLabels[f]} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {error && <FormAlert>{error}</FormAlert>}

      <div className="overflow-x-auto rounded-2xl border border-cream-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-50 text-[11px] uppercase tracking-wider text-charcoal-600">
            <tr>
              <th className="px-4 py-3 font-bold">{a.admin.colUser}</th>
              <th className="px-4 py-3 font-bold">{a.admin.colRole}</th>
              <th className="px-4 py-3 font-bold">{a.admin.colStatus}</th>
              <th className="px-4 py-3 font-bold hidden md:table-cell">{a.admin.colJoined}</th>
              <th className="px-4 py-3 font-bold text-right">{a.admin.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-charcoal-500">
                  {a.admin.empty}
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const isMe = me?.id === u.id;
              const busy = busyId === u.id;
              return (
                <tr key={u.id} className={u.isBanned ? 'bg-red-50/40' : ''}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-terracotta-50 border border-terracotta/20 flex items-center justify-center font-bold text-terracotta-dark uppercase">
                        {u.username[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-charcoal-900 truncate flex items-center gap-1.5">
                          {u.username}
                          {isMe && (
                            <span className="rounded-full bg-charcoal-900 px-2 py-0.5 text-[10px] text-white">
                              {a.admin.you}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-charcoal-500 truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-olive text-white'
                          : 'bg-cream-100 border border-cream-200 text-charcoal-700'
                      }`}
                    >
                      {u.role === 'admin' && <ShieldCheck className="h-3 w-3" />}
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          u.isBanned
                            ? 'bg-red-600 text-white'
                            : 'bg-olive-50 border border-olive/30 text-olive-dark'
                        }`}
                      >
                        {u.isBanned ? a.admin.banned : a.admin.active}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          u.isVerified !== false
                            ? 'bg-olive-50 text-olive-dark border border-olive/30'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {u.isVerified !== false
                          ? a.admin.verified
                          : a.admin.unverified}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal-600 hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {!isMe && (
                        <>
                          {u.isVerified === false && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                runAction(
                                  u.id,
                                  () => adminApi.setVerified(u.id, true),
                                  a.admin.toastUpdated
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-terracotta-50 hover:bg-terracotta hover:text-white border border-terracotta/30 px-2.5 py-1.5 text-[11px] font-bold text-terracotta-dark transition disabled:opacity-50"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              {a.admin.verifyNow}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              const nextRole = u.role === 'admin' ? 'user' : 'admin';
                              if (!window.confirm(a.admin.confirmRole(u.username, nextRole))) return;
                              runAction(u.id, () => adminApi.setRole(u.id, nextRole), a.admin.toastUpdated);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-olive-50 hover:bg-olive hover:text-white border border-olive/30 px-2.5 py-1.5 text-[11px] font-bold text-olive-dark transition disabled:opacity-50"
                          >
                            {u.role === 'admin' ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                            {u.role === 'admin' ? a.admin.makeUser : a.admin.makeAdmin}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              if (!u.isBanned && !window.confirm(a.admin.confirmBan(u.username))) return;
                              runAction(u.id, () => adminApi.setBanned(u.id, !u.isBanned), a.admin.toastUpdated);
                            }}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold border transition disabled:opacity-50 ${
                              u.isBanned
                                ? 'bg-white border-cream-200 text-charcoal-800 hover:bg-cream-100'
                                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-500 hover:text-white'
                            }`}
                          >
                            {u.isBanned ? <UserCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                            {u.isBanned ? a.admin.unban : a.admin.ban}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setResetTarget(u)}
                        className="inline-flex items-center gap-1 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-200 px-2.5 py-1.5 text-[11px] font-bold text-charcoal-800 transition disabled:opacity-50"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        {a.admin.resetPassword}
                      </button>
                      {!isMe && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            if (!window.confirm(a.admin.confirmDelete(u.username))) return;
                            runAction(u.id, () => adminApi.deleteUser(u.id), a.admin.toastDeleted);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 px-2.5 py-1.5 text-[11px] font-bold text-red-700 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {a.admin.delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {resetTarget && (
        <ResetPasswordModal
          target={resetTarget}
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

export const ResetPasswordModal: React.FC<{
  target: { id: number; username: string };
  onClose: () => void;
  onDone: () => void;
  onError: (err: unknown) => void;
}> = ({ target, onClose, onDone, onError }) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const strong = evaluatePassword(password).isStrong;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strong) return setError(a.errors.WEAK_PASSWORD);
    setSaving(true);
    setError('');
    try {
      await adminApi.resetPassword(target.id, password);
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500 && err.status !== 401 && err.status !== 403) {
        setError(errorMessage(err.code));
      } else {
        onError(err);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white border border-cream-200 shadow-warm-lg p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              {a.admin.resetModalTitle(target.username)}
            </h3>
            <p className="text-xs text-charcoal-600 mt-1">{a.admin.resetModalDesc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 shrink-0 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <div className="flex gap-2">
          <div className="flex-1">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={a.newPasswordLabel}
              autoComplete="new-password"
              maxLength={72}
            />
          </div>
          <button
            type="button"
            onClick={() => setPassword(generateStrongPassword())}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 px-3 text-xs font-bold text-charcoal-800"
          >
            <Wand2 className="h-4 w-4" />
            {a.admin.generate}
          </button>
        </div>
        <PasswordStrengthMeter password={password} />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-cream-100 hover:bg-cream-200 px-4 py-2.5 text-xs font-bold text-charcoal-800"
          >
            {a.admin.cancel}
          </button>
          <button
            type="submit"
            disabled={saving || !strong}
            className="rounded-xl bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
          >
            {saving ? a.submitting : a.admin.save}
          </button>
        </div>
      </form>
    </div>
  );
};
