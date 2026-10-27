import React, { useState } from 'react';
import { ArrowLeft, KeyRound, LifeBuoy, MessageSquare, User } from 'lucide-react';
import { useAuthText, useErrorMessage } from '../../auth/authText';
import { authApi, ApiError } from '../../auth/api';
import { evaluatePassword } from '../../auth/password';
import {
  AuthCard,
  FieldLabel,
  FormAlert,
  IconInput,
  LinkButton,
  PasswordInput,
  PasswordStrengthMeter,
  PrimaryButton,
} from '../../components/auth/AuthUI';

interface ForgotPasswordPageProps {
  /** Dipanggil setelah password berhasil direset sendiri */
  onResetSuccess: () => void;
  onNavigateLogin: () => void;
}

type Step = 'identify' | 'answer' | 'request-admin' | 'request-sent';

/**
 * Alur pemulihan password:
 *  1. User memasukkan username/email → server mengembalikan pertanyaan keamanan.
 *  2a. Jawab pertanyaan (diverifikasi bcrypt di server) + set password baru.
 *  2b. Jika lupa jawaban / tidak ada pertanyaan → kirim permintaan ke dashboard admin.
 */
export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onResetSuccess,
  onNavigateLogin,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();

  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setError('');
    setSubmitting(true);
    try {
      await fn();
    } catch (err) {
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const res = await authApi.forgotQuestion(identifier.trim());
      if (res.hasSecurityQuestion && res.securityQuestion) {
        setQuestion(res.securityQuestion);
        setStep('answer');
      } else {
        setQuestion(null);
        setStep('request-admin');
      }
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatePassword(newPassword).isStrong) return setError(a.errors.WEAK_PASSWORD);
    if (newPassword !== confirmPassword) return setError(a.passwordMismatch);
    run(async () => {
      await authApi.forgotVerify(identifier.trim(), answer, newPassword);
      onResetSuccess();
    });
  };

  const handleRequestAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await authApi.forgotRequestAdmin(identifier.trim(), note.trim());
      setStep('request-sent');
    });
  };

  const backFooter = (
    <button
      type="button"
      onClick={onNavigateLogin}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta transition"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {a.backToLogin}
    </button>
  );

  return (
    <AuthCard title={a.forgot.title} subtitle={a.forgot.subtitle} footer={backFooter}>
      {error && <FormAlert>{error}</FormAlert>}

      {step === 'identify' && (
        <form onSubmit={handleIdentify} className="space-y-4">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="forgot-identifier">{a.identifierLabel}</FieldLabel>
            <IconInput
              id="forgot-identifier"
              icon={<User className="h-4 w-4" />}
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={a.identifierPlaceholder}
            />
          </div>
          <PrimaryButton type="submit" disabled={submitting || !identifier.trim()}>
            {submitting ? a.submitting : a.forgot.step1Btn}
          </PrimaryButton>
        </form>
      )}

      {step === 'answer' && question && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="rounded-2xl bg-terracotta-50 border border-terracotta/25 p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark">
              {a.forgot.answerQuestion}
            </span>
            <p className="font-serif text-base font-bold text-charcoal-900">
              {a.securityQuestions[question] || question}
            </p>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="forgot-answer">{a.securityAnswerLabel}</FieldLabel>
            <IconInput
              id="forgot-answer"
              icon={<KeyRound className="h-4 w-4" />}
              required
              autoComplete="off"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={a.securityAnswerPlaceholder}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="forgot-new">{a.newPasswordLabel}</FieldLabel>
            <PasswordInput
              id="forgot-new"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={a.passwordPlaceholder}
              maxLength={72}
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="forgot-confirm">{a.confirmPasswordLabel}</FieldLabel>
            <PasswordInput
              id="forgot-confirm"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={a.confirmPasswordPlaceholder}
              maxLength={72}
            />
          </div>

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? a.submitting : a.forgot.verifyBtn}
          </PrimaryButton>

          <div className="text-center">
            <LinkButton
              onClick={() => {
                setError('');
                setStep('request-admin');
              }}
            >
              {a.forgot.forgotAnswer}
            </LinkButton>
          </div>
        </form>
      )}

      {step === 'request-admin' && (
        <form onSubmit={handleRequestAdmin} className="space-y-4">
          {!question && <FormAlert>{a.forgot.noQuestion}</FormAlert>}
          <div className="rounded-2xl bg-olive-50 border border-olive/25 p-4 space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-olive-dark">
              <LifeBuoy className="h-4 w-4" />
              {a.forgot.requestAdminTitle}
            </span>
            <p className="text-xs text-charcoal-700 leading-relaxed">{a.forgot.requestAdminDesc}</p>
            <p className="text-xs font-semibold text-charcoal-900">@{identifier.trim()}</p>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="forgot-note">{a.forgot.noteLabel}</FieldLabel>
            <div className="relative">
              <MessageSquare className="h-4 w-4 text-charcoal-500 absolute left-3.5 top-3.5" />
              <textarea
                id="forgot-note"
                rows={3}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={a.forgot.notePlaceholder}
                className="w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta resize-none"
              />
            </div>
          </div>

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? a.submitting : a.forgot.requestAdminBtn}
          </PrimaryButton>

          {question && (
            <div className="text-center">
              <LinkButton
                onClick={() => {
                  setError('');
                  setStep('answer');
                }}
              >
                {a.forgot.useQuestion}
              </LinkButton>
            </div>
          )}
        </form>
      )}

      {step === 'request-sent' && (
        <div className="space-y-4">
          <FormAlert type="success">{a.forgot.successRequest}</FormAlert>
          <PrimaryButton type="button" onClick={onNavigateLogin}>
            {a.backToLogin}
          </PrimaryButton>
        </div>
      )}
    </AuthCard>
  );
};
