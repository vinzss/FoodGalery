// Aturan strong password — harus sama dengan server/validation.js
export type PasswordRule =
  | 'length'
  | 'lowercase'
  | 'uppercase'
  | 'number'
  | 'symbol';

export const PASSWORD_RULES: { id: PasswordRule; test: (p: string) => boolean }[] = [
  { id: 'length', test: (p) => p.length >= 8 && p.length <= 72 },
  { id: 'lowercase', test: (p) => /[a-z]/.test(p) },
  { id: 'uppercase', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', test: (p) => /[0-9]/.test(p) },
  { id: 'symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function evaluatePassword(password: string) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).map((r) => r.id);
  let score = passed.length; // 0..5
  if (password.length >= 12 && score === 5) score = 6;
  return {
    passed,
    isStrong: passed.length === PASSWORD_RULES.length,
    score, // 0..6
  };
}

export const SECURITY_QUESTION_IDS = [
  'mother_name',
  'father_name',
  'first_pet',
  'birth_city',
  'elementary_school',
  'favorite_food',
] as const;

export type SecurityQuestionId = (typeof SECURITY_QUESTION_IDS)[number];

export const USERNAME_RE = /^[a-zA-Z0-9_.]{3,32}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
