import React from 'react';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuthText } from '../auth/authText';

interface GuestLockProps {
  /** true = user belum login → konten di-blur + overlay prompt login */
  locked: boolean;
  message: string;
  onLogin: () => void;
  onSignup: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Guest Mode wrapper: mem-blur konten (Tailwind `blur-md`) dan menampilkan
 * overlay ajakan login. Konten tidak dapat diklik/diseleksi saat terkunci.
 */
export const GuestLock: React.FC<GuestLockProps> = ({
  locked,
  message,
  onLogin,
  onSignup,
  children,
  className,
}) => {
  const a = useAuthText();

  if (!locked) return <>{children}</>;

  return (
    <div className={`relative ${className || ''}`}>
      <div
        aria-hidden="true"
        className="blur-md select-none pointer-events-none max-h-[420px] overflow-hidden"
        // Mencegah konten terblur ikut ter-fokus via keyboard
        {...({ inert: '' } as Record<string, string>)}
      >
        {children}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-gradient-to-b from-white/30 via-white/60 to-white/80 rounded-2xl">
        <div className="max-w-sm w-full text-center rounded-2xl bg-white/95 border border-cream-200 shadow-warm-lg p-6 space-y-3">
          <div className="mx-auto h-11 w-11 rounded-xl bg-terracotta-50 border border-terracotta/30 flex items-center justify-center text-terracotta">
            <Lock className="h-5 w-5" />
          </div>
          <h4 className="font-serif text-lg font-bold text-charcoal-900">
            {a.guest.lockedTitle}
          </h4>
          <p className="text-xs text-charcoal-600 leading-relaxed">{message}</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={onLogin}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 text-xs font-bold shadow-sm transition"
            >
              <LogIn className="h-4 w-4" />
              {a.guest.loginBtn}
            </button>
            <button
              type="button"
              onClick={onSignup}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 px-4 py-2.5 text-xs font-bold transition"
            >
              <UserPlus className="h-4 w-4" />
              {a.guest.signupBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
