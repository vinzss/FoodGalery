import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, KeyRound, Mail, User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useAuthText, useErrorMessage } from '../../auth/authText';
import { ApiError } from '../../auth/api';
import {
  EMAIL_RE,
  SECURITY_QUESTION_IDS,
  USERNAME_RE,
  evaluatePassword,
} from '../../auth/password';
import { AuthUser } from '../../types';
import {
  AuthCard,
  FieldLabel,
  FormAlert,
  IconInput,
  LinkButton,
  PasswordInput,
  PasswordStrengthMeter,
  PrimaryButton,
  inputClass,
} from '../../components/auth/AuthUI';
import { OtpVerificationStep } from '../../components/auth/OtpVerificationStep';

interface SignUpPageProps {
  onSuccess: (user: AuthUser) => void;
  onNavigateLogin: () => void;
  onBack: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateLogin,
  onBack,
}) => {
  const a = useAuthText();
  const errorMessage = useErrorMessage();
  const { signup } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState<string>(
    SECURITY_QUESTION_IDS[0]
  );
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State untuk tahap Verifikasi Kode OTP 6 Digit
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  const { isStrong } = evaluatePassword(password);
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi frontend (server tetap memvalidasi ulang)
    if (!USERNAME_RE.test(username.trim())) return setError(a.errors.INVALID_USERNAME);
    if (!EMAIL_RE.test(email.trim())) return setError(a.errors.INVALID_EMAIL);
    if (!isStrong) return setError(a.errors.WEAK_PASSWORD);
    if (password !== confirmPassword) return setError(a.passwordMismatch);
    if (securityAnswer.trim().length < 2) return setError(a.errors.INVALID_SECURITY_ANSWER);

    setSubmitting(true);
    try {
      // Password dikirim via HTTPS/proxy lalu di-hash bcrypt di server sebelum disimpan
      const res = await signup({
        username: username.trim(),
        email: email.trim(),
        password,
        securityQuestion,
        securityAnswer,
      });
      setPendingOtpEmail(res.email);
      setDevOtp(res.devOtp);
    } catch (err) {
      setError(errorMessage(err instanceof ApiError ? err.code : 'UNKNOWN_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={pendingOtpEmail ? a.otp.title : a.signupTitle}
      subtitle={pendingOtpEmail ? a.otp.subtitle : a.signupSubtitle}
      footer={
        <>
          <p className="text-xs text-charcoal-600">
            {a.haveAccount} <LinkButton onClick={onNavigateLogin}>{a.login}</LinkButton>
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
      {error && <FormAlert>{error}</FormAlert>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <FieldLabel htmlFor="signup-username">{a.usernameLabel}</FieldLabel>
          <IconInput
            id="signup-username"
            icon={<User className="h-4 w-4" />}
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={a.usernamePlaceholder}
            maxLength={32}
          />
          <p className="text-[11px] text-charcoal-500">{a.usernameHint}</p>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="signup-email">{a.emailLabel}</FieldLabel>
          <IconInput
            id="signup-email"
            icon={<Mail className="h-4 w-4" />}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={a.emailPlaceholder}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="signup-password">{a.passwordLabel}</FieldLabel>
          <PasswordInput
            id="signup-password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={a.passwordPlaceholder}
            maxLength={72}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="signup-confirm">{a.confirmPasswordLabel}</FieldLabel>
          <PasswordInput
            id="signup-confirm"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={a.confirmPasswordPlaceholder}
            maxLength={72}
          />
          {mismatch && <p className="text-[11px] font-semibold text-red-600">{a.passwordMismatch}</p>}
        </div>

        <div className="space-y-1.5 rounded-2xl border border-cream-200 p-3.5 bg-cream-50/60">
          <FieldLabel htmlFor="signup-question">{a.securityQuestionLabel}</FieldLabel>
          <p className="text-[11px] text-charcoal-500">{a.securityQuestionHint}</p>
          <div className="relative flex items-center">
            <HelpCircle className="h-4 w-4 text-charcoal-500 absolute left-3.5" />
            <select
              id="signup-question"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className={`${inputClass} bg-white cursor-pointer`}
            >
              {SECURITY_QUESTION_IDS.map((id) => (
                <option key={id} value={id}>
                  {a.securityQuestions[id]}
                </option>
              ))}
            </select>
          </div>
          <IconInput
            id="signup-answer"
            aria-label={a.securityAnswerLabel}
            icon={<KeyRound className="h-4 w-4" />}
            required
            autoComplete="off"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder={a.securityAnswerPlaceholder}
            className="bg-white"
            maxLength={100}
          />
        </div>

        <PrimaryButton
          type="submit"
          disabled={submitting || !isStrong || mismatch}
          className="mt-2"
        >
          {submitting ? a.submitting : a.signup}
        </PrimaryButton>
      </form>
        </>
      )}
    </AuthCard>
  );
};
