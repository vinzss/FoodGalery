// /api/content/* — Tempat Makan (UMKM), Ulasan, Antrean Rekomendasi & Favorit di MySQL XAMPP.
import { Router } from 'express';
import {
  pool,
  rowToRestaurant,
  rowToReview,
  rowToSubmission,
  upsertRestaurant,
  insertReview,
  insertSubmission,
} from '../db.js';
import {
  isAdminRole,
  optionalAuth,
  requireAuth,
  requireRole,
} from '../auth.js';

const router = Router();

const MIN_PRICE_MAP = {
  $: 35000,
  $$: 75000,
  $$$: 180000,
  $$$$: 360000,
};

function formatIndonesianDate(date = new Date()) {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

async function listAllRestaurants() {
  const [rows] = await pool.query(
    'SELECT * FROM restaurants ORDER BY created_at DESC, id ASC'
  );
  return rows.map(rowToRestaurant);
}

async function listAllReviews() {
  const [rows] = await pool.query(
    'SELECT * FROM reviews ORDER BY created_at DESC, id ASC'
  );
  return rows.map(rowToReview);
}

async function listAllSubmissions() {
  const [rows] = await pool.query(
    'SELECT * FROM submissions ORDER BY created_at DESC, id ASC'
  );
  return rows.map(rowToSubmission);
}

async function listUserFavorites(userId) {
  const [rows] = await pool.query(
    'SELECT restaurant_id FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows.map((r) => r.restaurant_id);
}

// ---------- BOOTSTRAP DATA DARI MYSQL XAMPP ----------
router.get('/bootstrap', optionalAuth, async (req, res) => {
  const [restaurants, reviews, submissions, savedIds] = await Promise.all([
    listAllRestaurants(),
    listAllReviews(),
    isAdminRole(req.user?.role) ? listAllSubmissions() : Promise.resolve([]),
    req.user ? listUserFavorites(req.user.id) : Promise.resolve([]),
  ]);

  res.json({
    restaurants,
    reviews,
    submissions,
    savedIds,
  });
});

// ---------- SINKRONISASI SEKALI JALAN DARI LOCALSTORAGE KE MYSQL ----------
router.post('/migrate-local', optionalAuth, async (req, res) => {
  const { restaurants = [], reviews = [], submissions = [] } = req.body || {};

  if (Array.isArray(restaurants)) {
    for (const r of restaurants) {
      if (r && r.id && r.name) {
        await upsertRestaurant(r);
      }
    }
  }
  if (Array.isArray(reviews)) {
    for (const rev of reviews) {
      if (rev && rev.id && rev.restaurantId && rev.comment) {
        await insertReview(rev, req.user?.id || null);
      }
    }
  }
  if (Array.isArray(submissions)) {
    for (const sub of submissions) {
      if (sub && sub.id && sub.restaurantName) {
        await insertSubmission(sub, req.user?.id || null);
      }
    }
  }

  const [allRestaurants, allReviews, allSubmissions] = await Promise.all([
    listAllRestaurants(),
    listAllReviews(),
    isAdminRole(req.user?.role) ? listAllSubmissions() : Promise.resolve([]),
  ]);

  res.json({
    restaurants: allRestaurants,
    reviews: allReviews,
    submissions: allSubmissions,
  });
});

// ---------- KIRIM REKOMENDASI TEMPAT MAKAN BARU (Wajib Login) ----------
router.post('/submissions', requireAuth, async (req, res) => {
  const body = req.body || {};
  if (!body.restaurantName || !body.address || !body.signatureDish || !body.reason) {
    return res.status(400).json({ error: 'INVALID_PAYLOAD' });
  }

  const created = {
    id: `sub-${Date.now()}`,
    restaurantName: String(body.restaurantName).trim(),
    neighborhood: body.neighborhood || 'Sunter',
    cuisine: body.cuisine || 'Bakmi & Mie Tradisional',
    priceTier: body.priceTier || '$',
    estimatedPriceIdr: String(body.estimatedPriceIdr || 'Rp 35.000 – Rp 65.000').trim(),
    halalStatus: body.halalStatus || 'Halal',
    address: String(body.address).trim(),
    signatureDish: String(body.signatureDish).trim(),
    reason: String(body.reason).trim(),
    submittedBy: String(body.submittedBy || req.user.username).trim(),
    submitterEmail: String(body.submitterEmail || req.user.email).trim(),
    submittedAt: formatIndonesianDate(),
    photoUrl: String(body.photoUrl || '').trim(),
  };

  await insertSubmission(created, req.user.id);
  res.status(201).json({ submission: created });
});

// ---------- KIRIM ULASAN PENGUNJUNG BARU (Wajib Login) ----------
router.post('/reviews', requireAuth, async (req, res) => {
  const body = req.body || {};
  if (!body.restaurantId || !body.comment) {
    return res.status(400).json({ error: 'INVALID_PAYLOAD' });
  }

  const created = {
    id: `rev-${Date.now()}`,
    restaurantId: String(body.restaurantId),
    restaurantName: String(body.restaurantName || 'Restoran Pilihan').trim(),
    reviewerName: String(body.reviewerName || req.user.username).trim(),
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    favoriteDish: String(body.favoriteDish || '-').trim(),
    comment: String(body.comment).trim(),
    createdAt: formatIndonesianDate(),
    isFlagged: false,
  };

  await insertReview(created, req.user.id);
  res.status(201).json({ review: created });
});

// ---------- TOGGLE FAVORIT PENGGUNA (Wajib Login) ----------
router.post('/favorites/:restaurantId/toggle', requireAuth, async (req, res) => {
  const restaurantId = String(req.params.restaurantId);
  const [existing] = await pool.query(
    'SELECT 1 FROM user_favorites WHERE user_id = ? AND restaurant_id = ? LIMIT 1',
    [req.user.id, restaurantId]
  );

  if (existing.length > 0) {
    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND restaurant_id = ?',
      [req.user.id, restaurantId]
    );
  } else {
    await pool.query(
      'INSERT IGNORE INTO user_favorites (user_id, restaurant_id) VALUES (?, ?)',
      [req.user.id, restaurantId]
    );
  }

  const savedIds = await listUserFavorites(req.user.id);
  res.json({ savedIds });
});

router.delete('/favorites/:restaurantId', requireAuth, async (req, res) => {
  const restaurantId = String(req.params.restaurantId);
  await pool.query(
    'DELETE FROM user_favorites WHERE user_id = ? AND restaurant_id = ?',
    [req.user.id, restaurantId]
  );
  const savedIds = await listUserFavorites(req.user.id);
  res.json({ savedIds });
});

// ============================================================================
// ADMIN ONLY (RBAC) — Manajemen UMKM, Persetujuan Rekomendasi & Moderasi Ulasan
// ============================================================================

// ---------- CREATE / UPDATE UMKM ----------
router.post('/restaurants', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = req.body || {};
  if (!payload.name || !payload.address) {
    return res.status(400).json({ error: 'INVALID_PAYLOAD' });
  }

  const minPriceIdr = MIN_PRICE_MAP[payload.priceTier] || 35000;

  if (payload.editingId) {
    const [rows] = await pool.query('SELECT * FROM restaurants WHERE id = ?', [
      payload.editingId,
    ]);
    if (!rows[0]) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    const existing = rowToRestaurant(rows[0]);
    const updated = {
      ...existing,
      name: payload.name,
      tagline: { id: payload.description, en: payload.description },
      neighborhood: payload.neighborhood,
      subArea: payload.address,
      address: payload.address,
      cuisine: payload.cuisine,
      priceTier: payload.priceTier,
      estimatedPriceIdr: payload.estimatedPriceIdr,
      minPriceIdr,
      halalStatus: payload.halalStatus,
      heroImage: payload.heroImage,
      gallery: (payload.gallery || []).slice(0, 10),
      signatureDishes: payload.signatureDishes || [],
      editorialSummary: { id: payload.description, en: payload.description },
      editorialReview: {
        ...existing.editorialReview,
        verdict: { id: payload.description, en: payload.description },
      },
    };
    await upsertRestaurant(updated);
    return res.json({ restaurant: updated });
  }

  const firstDishName = payload.signatureDishes?.[0]?.name || payload.name;
  const created = {
    id: `rest-${Date.now()}`,
    name: payload.name,
    tagline: { id: payload.description, en: payload.description },
    neighborhood: payload.neighborhood,
    subArea: payload.address,
    cuisine: payload.cuisine,
    priceTier: payload.priceTier,
    estimatedPriceIdr: payload.estimatedPriceIdr,
    minPriceIdr,
    rating: 4.8,
    isVerified: true,
    isFeatured: true,
    halalStatus: payload.halalStatus,
    heroImage: payload.heroImage,
    gallery: (payload.gallery || []).slice(0, 10),
    editorialSummary: { id: payload.description, en: payload.description },
    editorialReview: {
      verdict: { id: payload.description, en: payload.description },
      atmosphere: {
        id: 'Nyaman untuk bersantap bersama keluarga dan kerabat.',
        en: 'Welcoming atmosphere for family and friends.',
      },
      insiderTip: {
        id: `Jangan lewatkan menu andalan ${firstDishName}.`,
        en: `Do not miss their signature ${firstDishName}.`,
      },
      author: 'Tim Kurator Food Album',
      authorRole: {
        id: 'Redaksi Food Album',
        en: 'Food Album Editorial Desk',
      },
      publishedPeriod: {
        id: 'Terverifikasi Redaksi',
        en: 'Editorial Verified',
      },
    },
    signatureDishes: payload.signatureDishes || [],
    openingHours: {
      id: 'Setiap Hari • 08.00 – 22.00 WIB',
      en: 'Daily • 8:00 AM – 10:00 PM',
    },
    address: payload.address,
    nearbyLandmark: {
      id: `Kawasan ${payload.neighborhood}, Jakarta`,
      en: `${payload.neighborhood}, Jakarta`,
    },
    vibeTags: [
      { id: 'UMKM Pilihan', en: 'Featured UMKM' },
      { id: 'Rasa Autentik', en: 'Authentic Flavor' },
    ],
  };

  await upsertRestaurant(created);
  res.status(201).json({ restaurant: created });
});

// ---------- DELETE UMKM ----------
router.delete('/restaurants/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = String(req.params.id);
  await pool.query('DELETE FROM restaurants WHERE id = ?', [id]);
  await pool.query('DELETE FROM user_favorites WHERE restaurant_id = ?', [id]);
  res.json({ ok: true });
});

// ---------- APPROVE COMMUNITY SUBMISSION -> PUBLISH TO RESTAURANTS ----------
router.post(
  '/submissions/:id/approve',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    const id = String(req.params.id);
    const [rows] = await pool.query('SELECT * FROM submissions WHERE id = ?', [id]);
    if (!rows[0]) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }
    const target = rowToSubmission(rows[0]);
    const minPriceIdr = MIN_PRICE_MAP[target.priceTier] || 35000;

    const newlyApprovedRestaurant = {
      id: `rest-${Date.now()}`,
      name: target.restaurantName,
      tagline: { id: target.reason, en: target.reason },
      neighborhood: target.neighborhood,
      subArea: target.address,
      cuisine: target.cuisine,
      priceTier: target.priceTier,
      estimatedPriceIdr: target.estimatedPriceIdr,
      minPriceIdr,
      rating: 4.8,
      isVerified: false,
      isFeatured: true,
      halalStatus: target.halalStatus,
      heroImage: target.photoUrl,
      gallery: [
        {
          url: target.photoUrl,
          caption: {
            id: `${target.signatureDish} — Rekomendasi dari ${target.submittedBy}`,
            en: `${target.signatureDish} — Recommended by ${target.submittedBy}`,
          },
        },
      ],
      editorialSummary: { id: target.reason, en: target.reason },
      editorialReview: {
        verdict: { id: target.reason, en: target.reason },
        atmosphere: {
          id: 'Tempat makan pilihan hasil rekomendasi komunitas kuliner Jakarta.',
          en: 'Community-recommended dining spot in Jakarta.',
        },
        insiderTip: {
          id: `Cobalah hidangan andalan mereka: ${target.signatureDish}.`,
          en: `Be sure to order their signature dish: ${target.signatureDish}.`,
        },
        author: target.submittedBy,
        authorRole: {
          id: 'Rekomendasi Komunitas',
          en: 'Community Recommendation',
        },
        publishedPeriod: {
          id: 'Kurasi Terbaru',
          en: 'Newly Curated',
        },
      },
      signatureDishes: [
        {
          name: target.signatureDish,
          priceIdr: target.estimatedPriceIdr.split('–')[0].trim(),
          description: { id: target.reason, en: target.reason },
          isPopular: true,
          halalStatus: target.halalStatus,
        },
      ],
      openingHours: {
        id: 'Setiap Hari • 09.00 – 22.00 WIB',
        en: 'Daily • 9:00 AM – 10:00 PM',
      },
      address: target.address,
      nearbyLandmark: {
        id: `Kawasan ${target.neighborhood}, Jakarta`,
        en: `${target.neighborhood} Sector, Jakarta`,
      },
      vibeTags: [
        { id: 'Pilihan Komunitas', en: 'Community Pick' },
        { id: 'Kuliner Lokal', en: 'Local Culinary' },
      ],
    };

    await upsertRestaurant(newlyApprovedRestaurant);
    await pool.query('DELETE FROM submissions WHERE id = ?', [id]);
    res.json({ restaurant: newlyApprovedRestaurant });
  }
);

// ---------- REJECT COMMUNITY SUBMISSION ----------
router.delete(
  '/submissions/:id',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    await pool.query('DELETE FROM submissions WHERE id = ?', [
      String(req.params.id),
    ]);
    res.json({ ok: true });
  }
);

// ---------- DELETE REVIEW ----------
router.delete(
  '/reviews/:id',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    await pool.query('DELETE FROM reviews WHERE id = ?', [
      String(req.params.id),
    ]);
    res.json({ ok: true });
  }
);

export default router;
