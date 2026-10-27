// /api/admin/* — Manajemen akun & permintaan reset password. Khusus role admin (RBAC).
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, BCRYPT_ROUNDS } from '../db.js';
import { requireAuth, requireRole, toPublicUser } from '../auth.js';
import { checkStrongPassword } from '../validation.js';

const router = Router();

// Seluruh route di file ini wajib login + role admin
router.use(requireAuth, requireRole('admin'));

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
    "SELECT COUNT(*) AS total FROM users WHERE role = 'admin' AND is_banned = 0"
  );
  return Number(rows[0].total);
}

/** Cegah admin mengunci dirinya sendiri / menghapus admin terakhir. */
async function guardSelfAndLastAdmin(req, res, target, action) {
  if (target.id === req.user.id) {
    res.status(400).json({ error: 'CANNOT_MODIFY_SELF', action });
    return false;
  }
  if (target.role === 'admin' && !target.is_banned && (await countActiveAdmins()) <= 1) {
    res.status(400).json({ error: 'LAST_ADMIN', action });
    return false;
  }
  return true;
}

// ---------- Daftar user ----------
router.get('/users', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM users ORDER BY role = "admin" DESC, created_at DESC'
  );
  res.json({ users: rows.map(toPublicUser) });
});

// ---------- Ubah role ----------
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body || {};
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'INVALID_ROLE' });
  }
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (role === 'user' && !(await guardSelfAndLastAdmin(req, res, target, 'demote'))) return;
  if (target.id === req.user.id) {
    return res.status(400).json({ error: 'CANNOT_MODIFY_SELF' });
  }

  await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, target.id]);
  res.json({ ok: true });
});

// ---------- Ban / Unban ----------
router.patch('/users/:id/ban', async (req, res) => {
  const banned = Boolean(req.body?.banned);
  const target = await getTargetUser(req, res);
  if (!target) return;
  if (banned && !(await guardSelfAndLastAdmin(req, res, target, 'ban'))) return;

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
  if (!(await guardSelfAndLastAdmin(req, res, target, 'delete'))) return;

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
