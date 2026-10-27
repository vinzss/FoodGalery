// /api/auth/* — Sign Up + OTP Verification, Login, Logout, Me, Forgot Password.
import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool, BCRYPT_ROUNDS } from '../db.js';
import {
  issueSession,
  clearSession,
  requireAuth,
  toPublicUser,
} from '../auth.js';
import {
  SECURITY_QUESTIONS,
  USERNAME_RE,
  EMAIL_RE,
  checkStrongPassword,
  normalizeAnswer,
} from '../validation.js';
import { rateLimit } from '../rateLimit.js';

const router = Router();

// Hash dummy agar waktu respons login sama walau user tidak ditemukan
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', BCRYPT_ROUNDS);
const OTP_TTL_MINUTES = 10;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyPrefix: 'login',
});
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: 'forgot',
});
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 25,
  keyPrefix: 'signup',
});
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyPrefix: 'otp',
});

function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

async function createAndSaveOtp(userId, email, username) {
  const otp = generateOtpCode();
  const otpHash = await bcrypt.hash(otp, 10);
  await pool.query(
    `UPDATE users
        SET otp_code_hash = ?,
            otp_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE)
      WHERE id = ?`,
    [otpHash, OTP_TTL_MINUTES, userId]
  );
  console.log(
    `\n========================================================\n` +
      `[OTP VERIFICATION] Akun: @${username} (${email})\n` +
      `Kode Verifikasi 6 Digit: ${otp} (Berlaku ${OTP_TTL_MINUTES} menit)\n` +
      `========================================================\n`
  );
  return otp;
}

async function findByIdentifier(identifier) {
  const value = String(identifier || '').trim();
  if (!value) return null;
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) LIMIT 1',
    [value, value.toLowerCase()]
  );
  return rows[0] || null;
}

// ---------- SIGN UP (Tahap 1: Buat akun + kirim Kode OTP 6 digit) ----------
router.post('/signup', signupLimiter, async (req, res) => {
  const { username, email, password, securityQuestion, securityAnswer } =
    req.body || {};

  const cleanUsername = String(username || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!USERNAME_RE.test(cleanUsername)) {
    return res.status(400).json({ error: 'INVALID_USERNAME' });
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return res.status(400).json({ error: 'INVALID_EMAIL' });
  }
  const failed = checkStrongPassword(password);
  if (failed.length > 0) {
    return res.status(400).json({ error: 'WEAK_PASSWORD', failed });
  }
  if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
    return res.status(400).json({ error: 'INVALID_SECURITY_QUESTION' });
  }
  const answer = normalizeAnswer(securityAnswer);
  if (answer.length < 2) {
    return res.status(400).json({ error: 'INVALID_SECURITY_ANSWER' });
  }

  const [existing] = await pool.query(
    'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
    [cleanUsername, cleanEmail]
  );

  // Hashing bcrypt untuk password & jawaban keamanan sebelum disimpan ke DB
  const [passwordHash, answerHash] = await Promise.all([
    bcrypt.hash(password, BCRYPT_ROUNDS),
    bcrypt.hash(answer, BCRYPT_ROUNDS),
  ]);

  let userId;
  if (existing.length > 0) {
    // Jika akun yang ada ternyata belum diverifikasi (is_verified = 0) dan milik pendaftar yang sama,
    // izinkan perbarui data & kirim OTP baru supaya user tidak terjebak error "sudah terdaftar".
    const unverifiedMatch = existing.find(
      (u) =>
        !u.is_verified &&
        existing.every((other) => other.id === u.id)
    );
    if (unverifiedMatch) {
      await pool.query(
        `UPDATE users
            SET username = ?,
                email = ?,
                password_hash = ?,
                security_question = ?,
                security_answer_hash = ?
          WHERE id = ?`,
        [
          cleanUsername,
          cleanEmail,
          passwordHash,
          securityQuestion,
          answerHash,
          unverifiedMatch.id,
        ]
      );
      userId = unverifiedMatch.id;
    } else {
      // Cek secara case-insensitive mana yang bentrok: username atau email
      const isUsernameTaken = existing.some(
        (u) =>
          String(u.username || '').toLowerCase() === cleanUsername.toLowerCase()
      );
      const taken = isUsernameTaken ? 'USERNAME_TAKEN' : 'EMAIL_TAKEN';
      return res.status(409).json({ error: taken });
    }
  } else {
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, is_verified, security_question, security_answer_hash)
       VALUES (?, ?, ?, 'user', 0, ?, ?)`,
      [cleanUsername, cleanEmail, passwordHash, securityQuestion, answerHash]
    );
    userId = result.insertId;
  }

  const otp = await createAndSaveOtp(userId, cleanEmail, cleanUsername);

  res.status(201).json({
    requiresVerification: true,
    email: cleanEmail,
    username: cleanUsername,
    // Dikembalikan saat mode lokal/dev agar langsung tampil di layar simulasi OTP
    devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
  });
});

// ---------- VERIFIKASI KODE OTP 6 DIGIT ----------
router.post('/verify-otp', otpLimiter, async (req, res) => {
  const { email, otp } = req.body || {};
  const cleanOtp = String(otp || '').trim();
  const user = await findByIdentifier(email);

  if (!user) {
    return res.status(404).json({ error: 'USER_NOT_FOUND' });
  }
  if (user.is_banned) {
    return res.status(403).json({ error: 'BANNED' });
  }
  if (user.is_verified) {
    issueSession(res, user);
    return res.json({ user: toPublicUser(user) });
  }
  if (!user.otp_code_hash || !user.otp_expires_at) {
    return res.status(400).json({ error: 'OTP_EXPIRED' });
  }

  const [[{ expired }]] = await pool.query(
    'SELECT NOW() > ? AS expired',
    [user.otp_expires_at]
  );
  if (expired) {
    return res.status(400).json({ error: 'OTP_EXPIRED' });
  }

  const valid = await bcrypt.compare(cleanOtp, user.otp_code_hash);
  if (!valid) {
    return res.status(400).json({ error: 'INVALID_OTP' });
  }

  await pool.query(
    'UPDATE users SET is_verified = 1, otp_code_hash = NULL, otp_expires_at = NULL WHERE id = ?',
    [user.id]
  );

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [
    user.id,
  ]);
  issueSession(res, rows[0]);
  res.json({ user: toPublicUser(rows[0]) });
});

// ---------- KIRIM ULANG KODE OTP ----------
router.post('/resend-otp', otpLimiter, async (req, res) => {
  const { email } = req.body || {};
  const user = await findByIdentifier(email);
  if (!user || user.is_banned) {
    return res.status(404).json({ error: 'USER_NOT_FOUND' });
  }
  if (user.is_verified) {
    return res.json({ alreadyVerified: true });
  }

  const otp = await createAndSaveOtp(user.id, user.email, user.username);
  res.json({
    ok: true,
    email: user.email,
    devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
  });
});

// ---------- LOGIN ----------
router.post('/login', loginLimiter, async (req, res) => {
  const { identifier, password } = req.body || {};
  const user = await findByIdentifier(identifier);

  const ok = await bcrypt.compare(
    String(password || ''),
    user ? user.password_hash : DUMMY_HASH
  );
  if (!user || !ok) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
  if (user.is_banned) {
    return res.status(403).json({ error: 'BANNED' });
  }
  if (!user.is_verified) {
    const otp = await createAndSaveOtp(user.id, user.email, user.username);
    return res.status(403).json({
      error: 'UNVERIFIED',
      email: user.email,
      username: user.username,
      devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    });
  }

  issueSession(res, user);
  res.json({ user: toPublicUser(user) });
});

// ---------- LOGOUT ----------
router.post('/logout', (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

// ---------- CURRENT USER ----------
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

// ---------- FORGOT PASSWORD (Step 1): ambil pertanyaan keamanan ----------
router.post('/forgot/question', forgotLimiter, async (req, res) => {
  const user = await findByIdentifier(req.body?.identifier);
  if (!user || user.is_banned) {
    return res.status(404).json({ error: 'USER_NOT_FOUND' });
  }
  res.json({
    hasSecurityQuestion: Boolean(
      user.security_question && user.security_answer_hash
    ),
    securityQuestion: user.security_question,
  });
});

// ---------- FORGOT PASSWORD (Step 2a): verifikasi jawaban & set password baru ----------
router.post('/forgot/verify', forgotLimiter, async (req, res) => {
  const { identifier, answer, newPassword } = req.body || {};
  const user = await findByIdentifier(identifier);
  if (!user || user.is_banned || !user.security_answer_hash) {
    return res.status(400).json({ error: 'WRONG_ANSWER' });
  }

  const correct = await bcrypt.compare(
    normalizeAnswer(answer),
    user.security_answer_hash
  );
  if (!correct) {
    return res.status(400).json({ error: 'WRONG_ANSWER' });
  }

  const failed = checkStrongPassword(newPassword);
  if (failed.length > 0) {
    return res.status(400).json({ error: 'WEAK_PASSWORD', failed });
  }

  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [
    hash,
    user.id,
  ]);
  await pool.query(
    "UPDATE password_reset_requests SET status = 'resolved', handled_at = NOW() WHERE user_id = ? AND status = 'pending'",
    [user.id]
  );
  res.json({ ok: true });
});

// ---------- FORGOT PASSWORD (Step 2b): minta bantuan admin ----------
router.post('/forgot/request-admin', forgotLimiter, async (req, res) => {
  const { identifier, note } = req.body || {};
  const user = await findByIdentifier(identifier);

  if (user && !user.is_banned) {
    const [pending] = await pool.query(
      "SELECT id FROM password_reset_requests WHERE user_id = ? AND status = 'pending' LIMIT 1",
      [user.id]
    );
    if (pending.length === 0) {
      await pool.query(
        'INSERT INTO password_reset_requests (user_id, note) VALUES (?, ?)',
        [user.id, String(note || '').slice(0, 500) || null]
      );
    }
  }
  res.json({ ok: true });
});

export default router;
