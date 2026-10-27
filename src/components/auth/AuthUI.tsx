import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Circle, Eye, EyeOff, Lock, Utensils } from 'lucide-react';
import { evaluatePassword, PASSWORD_RULES } from '../../auth/password';
import { useAuthText } from '../../auth/authText';

/** Kartu pembungkus halaman Login / Sign Up / Forgot Password. */
export const AuthCard: React.FC<{
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, badge, children, footer }) => (
  <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 pb-28 xl:pb-12">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md warm-card rounded-3xl p-8 sm:p-10 bg-white border border-cream-200 shadow-warm-lg space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta text-white shadow-md">
          <Utensils className="h-7 w-7" />
        </div>
        {badge}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children}
      {footer && <div className="pt-4 border-t border-cream-200 space-y-2 text-center">{footer}</div>}
    </motion.div>
  </div>
);

export const FormAlert: React.FC<{ type?: 'error' | 'success'; children: React.ReactNode }> = ({
  type = 'error',
  children,
}) => (
  <div
    role={type === 'error' ? 'alert' : 'status'}
    className={`rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium border ${
      type === 'error'
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-olive-50 border-olive/30 text-olive-dark'
    }`}
  >
    {type === 'error' ? (
      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
    ) : (
      <CheckCircle2 className="h-4 w-4 text-olive shrink-0 mt-0.5" />
    )}
    <span>{children}</span>
  </div>
);

export const inputClass =
  'w-full rounded-xl bg-cream-50 border border-cream-200 pl-10 pr-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta';

export const FieldLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({
  htmlFor,
  children,
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-charcoal-800">
    {children}
  </label>
);

export const IconInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }
> = ({ icon, className, ...props }) => (
  <div className="relative flex items-center">
    <span className="absolute left-3.5 text-charcoal-500">{icon}</span>
    <input {...props} className={`${inputClass} ${className || ''}`} />
  </div>
);

export const PasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center">
      <Lock className="h-4 w-4 text-charcoal-500 absolute left-3.5" />
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        aria-label="Toggle password visibility"
        className="absolute right-3.5 text-charcoal-500 hover:text-charcoal-800"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

const BAR_COLORS = [
  'bg-red-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-olive',
  'bg-olive-dark',
];

/** Indikator kekuatan password + checklist aturan strong password. */
export const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const a = useAuthText();
  const { passed, score } = evaluatePassword(password);
  const pct = Math.round((score / 6) * 100);

  return (
    <div className="space-y-2 rounded-xl bg-cream-50 border border-cream-200 p-3">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-charcoal-600">{a.strength.title}</span>
        <span className={password ? 'text-charcoal-900' : 'text-charcoal-500'}>
          {password ? a.strength.levels[score] : '—'}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-cream-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${BAR_COLORS[score]}`}
          style={{ width: `${password ? Math.max(pct, 8) : 0}%` }}
        />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pt-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = passed.includes(rule.id);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-1.5 text-[11px] ${
                ok ? 'text-olive-dark font-semibold' : 'text-charcoal-500'
              }`}
            >
              {ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-olive shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 shrink-0" />
              )}
              {a.strength.rules[rule.id]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => (
  <button
    {...props}
    className={`w-full rounded-xl bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 text-sm font-bold shadow-md transition-all ${
      className || ''
    }`}
  />
);

export const LinkButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => (
  <button
    type="button"
    {...props}
    className={`text-xs font-bold text-terracotta hover:text-terracotta-dark hover:underline ${
      className || ''
    }`}
  />
);
