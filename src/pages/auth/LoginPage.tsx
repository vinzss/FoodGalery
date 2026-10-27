import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useAuthText, useErrorMessage } from '../../auth/authText';
import { ApiError } from '../../auth/api';
import { AuthUser } from '../../types';
import {
  AuthCard,
  FieldLabel,
  FormAlert,
  IconInput,
  LinkButton,
  PasswordInput,
  PrimaryButton,
} from '../../components/auth/AuthUI';
import { OtpVerificationStep } from '../../components/auth/OtpVerificationStep';

interface LoginPageProps {
  onSuccess: (user: AuthUser) => void;
  onNavigateSignup: () => void;
  onNavigateForgot: () => void;
  onBack: () => void;
  /** Pesan info opsional (mis. setelah reset password berhasil) */
  notice?: string;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateSignup,
  onNavigateForgot,
  onBack,
  notice,
  title,
  subtitle,
  badge,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(identifier.trim(), password);
      onSuccess(user);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'UNVERIFIED') {
        setPendingOtpEmail(String(err.details.email || identifier.trim()));
        setDevOtp(
          typeof err.details.devOtp === 'string' ? err.details.devOtp : undefined
        );
        return;
      }
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={pendingOtpEmail ? a.otp.title : title || a.loginTitle}
      subtitle={pendingOtpEmail ? a.otp.subtitle : subtitle || a.loginSubtitle}
      badge={badge}
      footer={
        <>
          <p className="text-xs text-charcoal-600">
            {a.noAccount} <LinkButton onClick={onNavigateSignup}>{a.signup}</LinkButton>
          </p>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {a.backToSite}
          </button>
        </>
      }
    >
      {pendingOtpEmail ? (
        <OtpVerificationStep
          email={pendingOtpEmail}
          initialDevOtp={devOtp}
          onVerified={onSuccess}
          onBackToForm={() => setPendingOtpEmail(null)}
        />
      ) : (
        <>
      {notice && <FormAlert type="success">{notice}</FormAlert>}
      {error && <FormAlert>{error}</FormAlert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="login-identifier">{a.identifierLabel}</FieldLabel>
          <IconInput
            id="login-identifier"
            icon={<User className="h-4 w-4" />}
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={a.identifierPlaceholder}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="login-password">{a.passwordLabel}</FieldLabel>
            <LinkButton onClick={onNavigateForgot}>{a.forgotLink}</LinkButton>
          </div>
          <PasswordInput
            id="login-password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={a.passwordPlaceholder}
          />
        </div>

        <PrimaryButton type="submit" disabled={submitting} className="mt-2">
          {submitting ? a.submitting : a.login}
        </PrimaryButton>
      </form>
        </>
      )}
    </AuthCard>
  );
};
