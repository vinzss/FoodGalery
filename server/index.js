// Entry point backend Food Album (Express + MySQL XAMPP).
import express from 'express';
import cookieParser from 'cookie-parser';
import { initDatabase } from './db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

const PORT = Number(process.env.API_PORT || 4000);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

// Error handler terpusat (Express 5 meneruskan error async ke sini)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[api] Error:', err);
  res.status(500).json({ error: 'SERVER_ERROR' });
});

try {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[api] Food Album API berjalan di http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(
    '[api] Gagal terhubung ke MySQL. Pastikan MySQL di XAMPP Control Panel sudah "Start".\n',
    err.message
  );
  process.exit(1);
}
