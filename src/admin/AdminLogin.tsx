import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Utensils,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../auth/api';
import { useAuthText, useErrorMessage } from '../auth/authText';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPublicSite: () => void;
  onNavigateForgot?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublicSite,
  onNavigateForgot,
}) => {
  const { t } = useLanguage();
  const a = useAuthText();
  const errorMessageFor = useErrorMessage();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Kredensial diverifikasi di backend (bcrypt) — tidak ada lagi password hardcoded di client.
  // Role admin dicek oleh App (RBAC) setelah login berhasil.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      onLoginSuccess();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'UNKNOWN_ERROR';
      setErrorMessage(
        code === 'INVALID_CREDENTIALS' ? t.admin.loginError : errorMessageFor(code)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md warm-card rounded-3xl p-8 sm:p-10 bg-white border border-cream-200 shadow-warm-lg space-y-6"
      >
        {/* Top Brand & Badge */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-white shadow-md">
            <Utensils className="h-7 w-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-olive-50 border border-olive/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-olive-dark">
            <ShieldCheck className="h-3.5 w-3.5 text-olive" />
            <span>Protected Route • /admin</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {t.admin.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            {t.admin.loginSubtitle}
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs font-medium text-red-700">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-username"
              className="block text-xs font-bold text-charcoal-800"
            >
              {t.admin.usernameLabel}
            </label>
            <div className="relative flex items-center">
              <User className="h-4 w-4 text-charcoal-500 absolute left-3.5" />
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-charcoal-800"
            >
              {t.admin.passwordLabel}
            </label>
            <div className="relative flex items-center">
              <Lock className="h-4 w-4 text-charcoal-500 absolute left-3.5" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-11 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="absolute right-3.5 text-charcoal-500 hover:text-charcoal-800"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white py-3.5 text-sm font-bold shadow-md transition-all mt-2"
          >
            {submitting ? a.submitting : t.admin.loginBtn}
          </button>
          {onNavigateForgot && (
            <div className="text-center">
              <button
                type="button"
                onClick={onNavigateForgot}
                className="text-xs font-bold text-terracotta hover:underline"
              >
                {a.forgotLink}
              </button>
            </div>
          )}
        </form>

        <div className="pt-4 border-t border-cream-200 flex items-center justify-center">
          <button
            type="button"
            onClick={onBackToPublicSite}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.admin.backToPublicSite}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
