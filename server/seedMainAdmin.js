// Skrip inisialisasi / seeder khusus Super Admin Utama (calvin / 123456).
// Password selalu di-hash menggunakan bcrypt (12 rounds) sebelum disimpan ke MySQL.
import { initDatabase, seedMainAdmin, pool } from './db.js';

async function main() {
  try {
    await initDatabase();
    await seedMainAdmin({ resetPassword: true });
    const [rows] = await pool.query(
      "SELECT id, username, email, role, is_verified, is_banned, LEFT(password_hash, 12) AS bcrypt_prefix FROM users WHERE role = 'main_admin'"
    );
    console.log('[seed:admin] Status Super Admin di database:', rows);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('[seed:admin] Gagal menjalankan seeder Main Admin:', err);
    process.exit(1);
  }
}

main();
