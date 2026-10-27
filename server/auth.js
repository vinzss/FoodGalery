// JWT session (httpOnly cookie) + middleware RBAC.
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { pool } from './db.js';

export const COOKIE_NAME = 'fa_session';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 hari

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn(
    '[auth] JWT_SECRET tidak di-set di server/.env — memakai secret acak (semua sesi hilang saat server restart).'
  );
}

export function toPublicUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    isBanned: Boolean(row.is_banned),
    isVerified: Boolean(row.is_verified),
    createdAt: row.created_at,
  };
}

export function issueSession(res, user) {
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS,
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_TTL_SECONDS * 1000,
    path: '/',
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

/**
 * Wajib login. User selalu dibaca ulang dari DB setiap request sehingga
 * perubahan role / status ban langsung berlaku tanpa menunggu token kadaluarsa.
 */
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'UNAUTHENTICATED' });

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    clearSession(res);
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [
    payload.sub,
  ]);
  const user = rows[0];
  if (!user) {
    clearSession(res);
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }
  if (user.is_banned) {
    clearSession(res);
    return res.status(403).json({ error: 'BANNED' });
  }
  req.user = user;
  next();
}

/** RBAC: batasi route ke role tertentu. Pakai setelah requireAuth. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
}

/** Mengisi req.user jika ada sesi valid, atau biarkan null untuk guest. */
export async function optionalAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [
      payload.sub,
    ]);
    if (rows[0] && !rows[0].is_banned) {
      req.user = rows[0];
    }
  } catch {
    // Abaikan token tidak valid pada endpoint publik
  }
  next();
}
