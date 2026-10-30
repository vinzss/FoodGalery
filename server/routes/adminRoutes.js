// /api/admin/* — Manajemen akun, sistem ban, penambahan admin baru (approval Main Admin), & reset password.
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, BCRYPT_ROUNDS } from '../db.js';
import {
  isAdminRole,
  isMainAdminRole,
  requireAuth,
  requireRole,
  toPublicUser,
} from '../auth.js';
import {
  checkStrongPassword,
  normalizeEmail,
  normalizeUsername,
} from '../validation.js';

const router = Router();

// Seluruh route di file ini wajib login + role admin atau main_admin
router.use(requireAuth, requireRole('admin', 'main_admin'));

async function getTargetUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'INVALID_ID' });
    return null;
  }
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!rows[0]) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return null;
  }
  return rows[0];
}

async function countActiveAdmins() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM users WHERE role IN ('admin', 'main_admin') AND is_banned = 0"
  );
  return Number(rows[0].total);
}

/**
 * Cegah admin mengunci dirinya sendiri, menyentuh Main Admin, atau
 * admin biasa memodifikasi sesama admin.
 */
async function guardHierarchy(req, res, target, action) {
  if (target.id === req.user.id) {
    res.status(400).json({ error: 'CANNOT_MODIFY_SELF', action });
    return false;
  }
  if (target.role === 'main_admin') {
    res.status(403).json({ error: 'CANNOT_MODIFY_MAIN_ADMIN', action });
    return false;
  }
  if (target.role === 'admin' && !isMainAdminRole(req.user.role)) {
    res.status(403).json({ error: 'ONLY_MAIN_ADMIN', action });
    return false;
  }
  if (
    isAdminRole(target.role) &&
    !target.is_banned &&
    (await countActiveAdmins()) <= 1
  ) {
    res.status(400).json({ error: 'LAST_ADMIN', action });
    return false;
  }
  return true;
}

// ---------- Daftar user ----------
router.get('/users', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM users
      ORDER BY FIELD(role, 'main_admin', 'admin', 'user'), created_at DESC`
  );
  res.json({ users: rows.map(toPublicUser) });
});

// ---------- Ubah role / Ajukan promosi Admin ----------
router.patch('/users/:id/role', async (req, res) => {
  const { role, reason } = req.body || {};
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'INVALID_ROLE' });
  }
  const target = await getTargetUser(req, res);
  if (!target) return;

  if (target.id === req.user.id) {
    return res.status(400).json({ error: 'CANNOT_MODIFY_SELF' });
  }
  if (target.role === 'main_admin') {
    return res.status(403).json({ error: 'CANNOT_MODIFY_MAIN_ADMIN' });
  }

  // Demosi admin -> user: hanya Main Admin yang diizinkan
  if (role === 'user') {
    if (!isMainAdminRole(req.user.role)) {
      return res.status(403).json({ error: 'ONLY_MAIN_ADMIN' });
    }
    if (!(await guardHierarchy(req, res, target, 'demote'))) return;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', ['user', target.id]);
    return res.json({ ok: true, pendingApproval: false });
  }

  // Promosi user -> admin:
  // 1) Jika Main Admin (calvin), langsung aktif menjadi admin.
  if (isMainAdminRole(req.user.role)) {
    await pool.query(
      "UPDATE users SET role = 'admin', is_verified = 1 WHERE id = ?",
      [target.id]
    );
    await pool.query(
      "UPDATE admin_requests SET status = 'approved', reviewed_by = ?, reviewed_at = NOW() WHERE target_user_id = ? AND status = 'pending'",
      [req.user.id, target.id]
    );
    return res.json({ ok: true, pendingApproval: false });
  }

  // 2) Jika Admin biasa, wajib masuk ke antrean approval Main Admin!
  const [existingPending] = await pool.query(
    "SELECT id FROM admin_requests WHERE target_user_id = ? AND status = 'pending' LIMIT 1",
    [target.id]
  );
  if (existingPending.length > 0) {
    return res.status(409).json({ error: 'ADMIN_REQUEST_ALREADY_PENDING' });
  }

  const cleanReason =
    typeof reason === 'string' && reason.trim()
      ? reason.trim().slice(0, 500)
      : `Diajukan menjadi Admin oleh @${req.user.username}`;

  await pool.query(
    `INSERT INTO admin_requests (target_user_id, requested_by, reason, status)
     VALUES (?, ?, ?, 'pending')`,
    [target.id, req.user.id, cleanReason]
  );

  return res.json({ ok: true, pendingApproval: true });
});

// ---------- Buat kandidat Admin baru (lewat form Tambah Admin Baru) ----------
router.post('/create-admin', async (req, res) => {
  const { username, email, password, reason } = req.body || {};
  const cleanUsername = normalizeUsername(username);
  const cleanEmail = normalizeEmail(email);

  if (!cleanUsername) {
    return res.status(400).json({ error: 'INVALID_USERNAME' });
  }
  if (!cleanEmail) {
    return res.status(400).json({ error: 'INVALID_EMAIL' });
  }
  const failed = checkStrongPassword(password);
  if (failed.length > 0) {
    return res.status(400).json({ error: 'WEAK_PASSWORD', failed });
  }

  const [dups] = await pool.query(
    'SELECT id, username, email FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) LIMIT 1',
    [cleanUsername, cleanEmail]
  );
  if (dups.length > 0) {
    const takenByUsername =
      dups[0].username.toLowerCase() === cleanUsername.toLowerCase();
    return res.status(409).json({
      error: takenByUsername ? 'USERNAME_TAKEN' : 'EMAIL_TAKEN',
    });
  }

  // Hash password dengan bcrypt (12 rounds)
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const isSuper = isMainAdminRole(req.user.role);
  const initialRole = isSuper ? 'admin' : 'user';
  const cleanReason =
    typeof reason === 'string' && reason.trim()
      ? reason.trim().slice(0, 500)
      : `Pendaftaran Admin baru oleh @${req.user.username}`;

  const [result] = await pool.query(
    `INSERT INTO users (username, email, password_hash, role, is_banned, is_verified)
     VALUES (?, ?, ?, ?, 0, 1)`,
    [cleanUsername, cleanEmail, passwordHash, initialRole]
  );
  const newUserId = result.insertId;

  if (isSuper) {
    await pool.query(
      `INSERT INTO admin_requests (target_user_id, requested_by, reason, status, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, 'approved', ?, NOW())`,
      [newUserId, req.user.id, cleanReason, req.user.id]
    );
    return res.status(201).json({ ok: true, pendingApproval: false });
  } else {
    await pool.query(
      `INSERT INTO admin_requests (target_user_id, requested_by, reason, status)
       VALUES (?, ?, ?, 'pending')`,
      [newUserId, req.user.id, cleanReason]
    );
    return res.status(201).json({ ok: true, pendingApproval: true });
  }
});

// ---------- Daftar Permintaan Approval Admin Baru ----------
router.get('/admin-requests', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ar.id,
            ar.target_user_id,
            ar.requested_by,
            ar.reason,
            ar.status,
            ar.created_at,
            ar.reviewed_at,
            tu.username AS target_username,
            tu.email AS target_email,
            tu.role AS target_role,
            ru.username AS requested_by_username,
            rev.username AS reviewed_by_username
       FROM admin_requests ar
       JOIN users tu ON tu.id = ar.target_user_id
       JOIN users ru ON ru.id = ar.requested_by
       LEFT JOIN users rev ON rev.id = ar.reviewed_by
      ORDER BY ar.status = 'pending' DESC, ar.created_at DESC
      LIMIT 200`
  );

  res.json({
    requests: rows.map((r) => ({
      id: r.id,
      targetUserId: r.target_user_id,
      targetUsername: r.target_username,
      targetEmail: r.target_email,
      targetRole: r.target_role,
      requestedById: r.requested_by,
      requestedByUsername: r.requested_by_username,
      reason: r.reason,
      status: r.status,
      createdAt: r.created_at,
      reviewedAt: r.reviewed_at,
      reviewedByUsername: r.reviewed_by_username,
    })),
  });
});

// ---------- Konfirmasi / Approval Penambahan Admin Baru (KHUSUS MAIN ADMIN) ----------
router.post(
  '/admin-requests/:id/decision',
  requireRole('main_admin'),
  async (req, res) => {
    const requestId = Number(req.params.id);
    const { decision } = req.body || {};
    if (!Number.isInteger(requestId)) {
      return res.status(400).json({ error: 'INVALID_ID' });
    }
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ error: 'INVALID_STATUS' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM admin_requests WHERE id = ? LIMIT 1',
      [requestId]
    );
    const reqRow = rows[0];
    if (!reqRow) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    if (reqRow.status !== 'pending') {
      return res.status(400).json({ error: 'ALREADY_PROCESSED' });
    }

    if (decision === 'approved') {
      await pool.query(
        "UPDATE users SET role = 'admin', is_verified = 1 WHERE id = ? AND role = 'user'",
        [reqRow.target_user_id]
      );
    }

    await pool.query(
      'UPDATE admin_requests SET status = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
      [decision, req.user.id, requestId]
    );

    res.json({ ok: true, status: decision });
  }
);

// ---------- Ban / Unban ----------
router.patch('/users/:id/ban', async (req, res) => {
  const banned = Boolean(req.body?.banned);
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (!(await guardHierarchy(req, res, target, 'ban'))) return;

  await pool.query('UPDATE users SET is_banned = ? WHERE id = ?', [
    banned ? 1 : 0,
    target.id,
  ]);
  res.json({ ok: true });
});

// ---------- Verifikasi Akun Manual oleh Admin ----------
router.patch('/users/:id/verify', async (req, res) => {
  const verified = Boolean(req.body?.verified);
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (target.role === 'main_admin' && !verified) {
    return res.status(403).json({ error: 'CANNOT_MODIFY_MAIN_ADMIN' });
  }

  await pool.query(
    'UPDATE users SET is_verified = ?, otp_code_hash = NULL, otp_expires_at = NULL WHERE id = ?',
    [verified ? 1 : 0, target.id]
  );
  res.json({ ok: true });
});

// ---------- Reset password oleh admin ----------
router.post('/users/:id/reset-password', async (req, res) => {
  const { newPassword } = req.body || {};
  const failed = checkStrongPassword(newPassword);
  if (failed.length > 0) {
    return res.status(400).json({ error: 'WEAK_PASSWORD', failed });
  }
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (
    target.id !== req.user.id &&
    !(await guardHierarchy(req, res, target, 'reset-password'))
  ) {
    return;
  }

  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [
    hash,
    target.id,
  ]);
  await pool.query(
    "UPDATE password_reset_requests SET status = 'resolved', handled_by = ?, handled_at = NOW() WHERE user_id = ? AND status = 'pending'",
    [req.user.id, target.id]
  );
  res.json({ ok: true });
});

// ---------- Hapus akun ----------
router.delete('/users/:id', async (req, res) => {
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (!(await guardHierarchy(req, res, target, 'delete'))) return;

  await pool.query('DELETE FROM users WHERE id = ?', [target.id]);
  res.json({ ok: true });
});

// ---------- Permintaan reset password ----------
router.get('/reset-requests', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.user_id, r.note, r.status, r.created_at, r.handled_at,
            u.username, u.email, h.username AS handled_by_username
       FROM password_reset_requests r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN users h ON h.id = r.handled_by
      ORDER BY r.status = 'pending' DESC, r.created_at DESC
      LIMIT 200`
  );
  res.json({
    requests: rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      username: r.username,
      email: r.email,
      note: r.note,
      status: r.status,
      createdAt: r.created_at,
      handledAt: r.handled_at,
      handledBy: r.handled_by_username,
    })),
  });
});

router.patch('/reset-requests/:id', async (req, res) => {
  const { status } = req.body || {};
  if (!['resolved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'INVALID_STATUS' });
  }
  await pool.query(
    'UPDATE password_reset_requests SET status = ?, handled_by = ?, handled_at = NOW() WHERE id = ?',
    [status, req.user.id, Number(req.params.id)]
  );
  res.json({ ok: true });
});

export default router;
