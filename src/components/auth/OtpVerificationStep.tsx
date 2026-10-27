import React, { useState } from 'react';
import { KeyRound, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { authApi, ApiError } from '../../auth/api';
import { useAuthText, useErrorMessage } from '../../auth/authText';
import { AuthUser } from '../../types';
import {
  FieldLabel,
  FormAlert,
  IconInput,
  LinkButton,
  PrimaryButton,
} from './AuthUI';

interface OtpVerificationStepProps {
  email: string;
  initialDevOtp?: string;
  onVerified: (user: AuthUser) => void;
  onBackToForm: () => void;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  email,
  initialDevOtp,
  onVerified,
  onBackToForm,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const { verifyOtp } = useAuth();

  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>(initialDevOtp);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      const user = await verifyOtp(email, otp.trim());
      onVerified(user);
    } catch (err) {
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    setResending(true);
    try {
      const res = await authApi.resendOtp(email);
      if (res.devOtp) setDevOtp(res.devOtp);
      setNotice(a.otp.resentNotice);
    } catch (err) {
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-olive-50 border border-olive/30 p-4 space-y-1 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-olive-dark">
          <ShieldCheck className="h-4 w-4 text-olive" />
          <span>{a.otp.sentTo}</span>
        </div>
        <p className="font-bold text-sm text-charcoal-900 break-all">{email}</p>
      </div>

      {devOtp && (
        <div className="rounded-2xl bg-terracotta-50 border border-terracotta/30 p-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark block">
              {a.otp.devHint}
            </span>
            <span className="font-mono text-2xl font-extrabold tracking-widest text-charcoal-900">
              {devOtp}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOtp(devOtp)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-3.5 py-2 text-xs font-bold shadow-sm transition shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{a.otp.autoFill}</span>
          </button>
        </div>
      )}

      {notice && <FormAlert type="success">{notice}</FormAlert>}
      {error && <FormAlert>{error}</FormAlert>}

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-1.5">
          <FieldLabel htmlFor="otp-code">{a.otp.inputLabel}</FieldLabel>
          <IconInput
            id="otp-code"
            icon={<KeyRound className="h-4 w-4" />}
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder={a.otp.inputPlaceholder}
            className="font-mono text-lg tracking-widest font-bold"
          />
        </div>

        <PrimaryButton type="submit" disabled={submitting || otp.length !== 6}>
          {submitting ? a.submitting : a.otp.verifyBtn}
        </PrimaryButton>
      </form>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-olive-dark hover:text-terracotta transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
          <span>{a.otp.resendBtn}</span>
        </button>

        <LinkButton onClick={onBackToForm}>{a.otp.changeEmail}</LinkButton>
      </div>
    </div>
  );
};
