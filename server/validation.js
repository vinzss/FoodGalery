// Validasi sisi server (jangan pernah hanya mengandalkan validasi frontend).

export const SECURITY_QUESTIONS = [
  'mother_name',
  'father_name',
  'first_pet',
  'birth_city',
  'elementary_school',
  'favorite_food',
];

export const USERNAME_RE = /^[a-zA-Z0-9_.]{3,32}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mengembalikan daftar aturan password yang belum terpenuhi. */
export function checkStrongPassword(password) {
  const failed = [];
  if (typeof password !== 'string') return ['length'];
  if (password.length < 8) failed.push('length');
  if (password.length > 72) failed.push('maxLength'); // batas bcrypt
  if (!/[a-z]/.test(password)) failed.push('lowercase');
  if (!/[A-Z]/.test(password)) failed.push('uppercase');
  if (!/[0-9]/.test(password)) failed.push('number');
  if (!/[^A-Za-z0-9]/.test(password)) failed.push('symbol');
  return failed;
}

/** Normalisasi jawaban keamanan agar tidak sensitif huruf besar/spasi. */
export function normalizeAnswer(answer) {
  return String(answer || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}
