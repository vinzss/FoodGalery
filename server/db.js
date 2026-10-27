// Koneksi ke MySQL/MariaDB milik XAMPP + inisialisasi skema & auto-seed otomatis.
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {
  INITIAL_RESTAURANTS,
  INITIAL_USER_REVIEWS,
  INITIAL_PENDING_SUBMISSIONS,
} from '../src/data/mockData.ts';

export const BCRYPT_ROUNDS = 12;

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};
const DB_NAME = process.env.DB_NAME || 'foodalbum_db';

/** @type {import('mysql2/promise').Pool} */
export let pool;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','admin') NOT NULL DEFAULT 'user',
    is_banned TINYINT(1) NOT NULL DEFAULT 0,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    otp_code_hash VARCHAR(255) NULL,
    otp_expires_at DATETIME NULL,
    security_question VARCHAR(100) NULL,
    security_answer_hash VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS password_reset_requests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    note VARCHAR(500) NULL,
    status ENUM('pending','resolved','rejected') NOT NULL DEFAULT 'pending',
    handled_by INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    handled_at TIMESTAMP NULL,
    CONSTRAINT fk_prr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_prr_admin FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    neighborhood VARCHAR(64) NOT NULL,
    sub_area VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    price_tier VARCHAR(8) NOT NULL,
    estimated_price_idr VARCHAR(100) NOT NULL,
    min_price_idr INT NOT NULL DEFAULT 35000,
    rating DECIMAL(3,1) NOT NULL DEFAULT 4.8,
    is_verified TINYINT(1) NOT NULL DEFAULT 1,
    is_sponsored TINYINT(1) NOT NULL DEFAULT 0,
    is_featured TINYINT(1) NOT NULL DEFAULT 1,
    halal_status VARCHAR(64) NOT NULL,
    address VARCHAR(500) NOT NULL,
    hero_image LONGTEXT NOT NULL,
    tagline_json TEXT NOT NULL,
    editorial_summary_json TEXT NOT NULL,
    editorial_review_json TEXT NOT NULL,
    gallery_json LONGTEXT NOT NULL,
    signature_dishes_json LONGTEXT NOT NULL,
    opening_hours_json TEXT NOT NULL,
    nearby_landmark_json TEXT NOT NULL,
    vibe_tags_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    restaurant_id VARCHAR(64) NOT NULL,
    restaurant_name VARCHAR(191) NOT NULL,
    reviewer_name VARCHAR(120) NOT NULL,
    user_id INT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    favorite_dish VARCHAR(191) NOT NULL DEFAULT '-',
    comment TEXT NOT NULL,
    created_at_label VARCHAR(64) NOT NULL,
    is_flagged TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    restaurant_name VARCHAR(191) NOT NULL,
    neighborhood VARCHAR(64) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    price_tier VARCHAR(8) NOT NULL,
    estimated_price_idr VARCHAR(100) NOT NULL,
    halal_status VARCHAR(64) NOT NULL,
    address VARCHAR(500) NOT NULL,
    signature_dish VARCHAR(191) NOT NULL,
    reason TEXT NOT NULL,
    submitted_by VARCHAR(120) NOT NULL,
    submitter_email VARCHAR(191) NOT NULL,
    submitted_at_label VARCHAR(64) NOT NULL,
    photo_url LONGTEXT NOT NULL,
    user_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS user_favorites (
    user_id INT UNSIGNED NOT NULL,
    restaurant_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, restaurant_id),
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

export function rowToRestaurant(row) {
  return {
    id: row.id,
    name: row.name,
    tagline: JSON.parse(row.tagline_json),
    neighborhood: row.neighborhood,
    subArea: row.sub_area,
    cuisine: row.cuisine,
    priceTier: row.price_tier,
    estimatedPriceIdr: row.estimated_price_idr,
    minPriceIdr: Number(row.min_price_idr),
    rating: Number(row.rating),
    isVerified: Boolean(row.is_verified),
    isSponsored: Boolean(row.is_sponsored),
    isFeatured: Boolean(row.is_featured),
    halalStatus: row.halal_status,
    heroImage: row.hero_image,
    gallery: JSON.parse(row.gallery_json),
    editorialSummary: JSON.parse(row.editorial_summary_json),
    editorialReview: JSON.parse(row.editorial_review_json),
    signatureDishes: JSON.parse(row.signature_dishes_json),
    openingHours: JSON.parse(row.opening_hours_json),
    address: row.address,
    nearbyLandmark: JSON.parse(row.nearby_landmark_json),
    vibeTags: JSON.parse(row.vibe_tags_json),
  };
}

export function rowToReview(row) {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    reviewerName: row.reviewer_name,
    rating: Number(row.rating),
    favoriteDish: row.favorite_dish,
    comment: row.comment,
    createdAt: row.created_at_label,
    isFlagged: Boolean(row.is_flagged),
  };
}

export function rowToSubmission(row) {
  return {
    id: row.id,
    restaurantName: row.restaurant_name,
    neighborhood: row.neighborhood,
    cuisine: row.cuisine,
    priceTier: row.price_tier,
    estimatedPriceIdr: row.estimated_price_idr,
    halalStatus: row.halal_status,
    address: row.address,
    signatureDish: row.signature_dish,
    reason: row.reason,
    submittedBy: row.submitted_by,
    submitterEmail: row.submitter_email,
    submittedAt: row.submitted_at_label,
    photoUrl: row.photo_url,
  };
}

export async function upsertRestaurant(rest) {
  await pool.query(
    `INSERT INTO restaurants (
      id, name, neighborhood, sub_area, cuisine, price_tier,
      estimated_price_idr, min_price_idr, rating, is_verified,
      is_sponsored, is_featured, halal_status, address, hero_image,
      tagline_json, editorial_summary_json, editorial_review_json,
      gallery_json, signature_dishes_json, opening_hours_json,
      nearby_landmark_json, vibe_tags_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      neighborhood = VALUES(neighborhood),
      sub_area = VALUES(sub_area),
      cuisine = VALUES(cuisine),
      price_tier = VALUES(price_tier),
      estimated_price_idr = VALUES(estimated_price_idr),
      min_price_idr = VALUES(min_price_idr),
      rating = VALUES(rating),
      is_verified = VALUES(is_verified),
      is_sponsored = VALUES(is_sponsored),
      is_featured = VALUES(is_featured),
      halal_status = VALUES(halal_status),
      address = VALUES(address),
      hero_image = VALUES(hero_image),
      tagline_json = VALUES(tagline_json),
      editorial_summary_json = VALUES(editorial_summary_json),
      editorial_review_json = VALUES(editorial_review_json),
      gallery_json = VALUES(gallery_json),
      signature_dishes_json = VALUES(signature_dishes_json),
      opening_hours_json = VALUES(opening_hours_json),
      nearby_landmark_json = VALUES(nearby_landmark_json),
      vibe_tags_json = VALUES(vibe_tags_json)`,
    [
      rest.id,
      rest.name,
      rest.neighborhood,
      rest.subArea,
      rest.cuisine,
      rest.priceTier,
      rest.estimatedPriceIdr,
      rest.minPriceIdr,
      rest.rating,
      rest.isVerified ? 1 : 0,
      rest.isSponsored ? 1 : 0,
      rest.isFeatured ? 1 : 0,
      rest.halalStatus,
      rest.address,
      rest.heroImage,
      JSON.stringify(rest.tagline),
      JSON.stringify(rest.editorialSummary),
      JSON.stringify(rest.editorialReview),
      JSON.stringify(rest.gallery || []),
      JSON.stringify(rest.signatureDishes || []),
      JSON.stringify(rest.openingHours),
      JSON.stringify(rest.nearbyLandmark),
      JSON.stringify(rest.vibeTags || []),
    ]
  );
}

export async function insertReview(rev, userId = null) {
  await pool.query(
    `INSERT IGNORE INTO reviews (
      id, restaurant_id, restaurant_name, reviewer_name, user_id,
      rating, favorite_dish, comment, created_at_label, is_flagged
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rev.id,
      rev.restaurantId,
      rev.restaurantName,
      rev.reviewerName,
      userId,
      rev.rating,
      rev.favoriteDish || '-',
      rev.comment,
      rev.createdAt,
      rev.isFlagged ? 1 : 0,
    ]
  );
}

export async function insertSubmission(sub, userId = null) {
  await pool.query(
    `INSERT IGNORE INTO submissions (
      id, restaurant_name, neighborhood, cuisine, price_tier,
      estimated_price_idr, halal_status, address, signature_dish,
      reason, submitted_by, submitter_email, submitted_at_label,
      photo_url, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sub.id,
      sub.restaurantName,
      sub.neighborhood,
      sub.cuisine,
      sub.priceTier,
      sub.estimatedPriceIdr,
      sub.halalStatus,
      sub.address,
      sub.signatureDish,
      sub.reason,
      sub.submittedBy,
      sub.submitterEmail,
      sub.submittedAt,
      sub.photoUrl,
      userId,
    ]
  );
}

export async function initDatabase() {
  // 1. Pastikan database ada
  const bootstrap = await mysql.createConnection(DB_CONFIG);
  await bootstrap.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrap.end();

  // 2. Pool koneksi ke database aplikasi
  pool = mysql.createPool({
    ...DB_CONFIG,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // 3. Tabel & migrasi kolom OTP verifikasi pada tabel users yang sudah ada
  for (const sql of SCHEMA) {
    await pool.query(sql);
  }
  await pool.query(
    `ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER is_banned,
      ADD COLUMN IF NOT EXISTS otp_code_hash VARCHAR(255) NULL AFTER is_verified,
      ADD COLUMN IF NOT EXISTS otp_expires_at DATETIME NULL AFTER otp_code_hash`
  );
  await pool.query("UPDATE users SET is_verified = 1 WHERE role = 'admin'");

  // 4. Seed admin pertama (hanya jika belum ada admin sama sekali)
  const [admins] = await pool.query(
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
  );
  if (admins.length === 0) {
    const username = process.env.SEED_ADMIN_USERNAME || 'calvin';
    const password = process.env.SEED_ADMIN_PASSWORD || '123456';
    const email = process.env.SEED_ADMIN_EMAIL || 'calvin@foodalbum.local';
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role, is_verified)
       VALUES (?, ?, ?, 'admin', 1)
       ON DUPLICATE KEY UPDATE role = 'admin', is_verified = 1`,
      [username, email, hash]
    );
    console.log(
      `[db] Admin pertama dibuat: "${username}". Segera ganti password default!`
    );
  }

  // 5. Auto-seed Tempat Makan (restaurants), Ulasan (reviews), & Antrean Rekomendasi (submissions)
  const [existingRestRows] = await pool.query('SELECT id FROM restaurants');
  const existingRestIds = new Set(existingRestRows.map((r) => r.id));
  let addedRests = 0;
  for (const r of INITIAL_RESTAURANTS) {
    if (!existingRestIds.has(r.id)) {
      await upsertRestaurant(r);
      addedRests += 1;
    }
  }
  if (addedRests > 0) {
    console.log(
      `[db] Seeded ${addedRests} tempat makan baru ke tabel restaurants.`
    );
  }

  const [existingRevRows] = await pool.query('SELECT id FROM reviews');
  const existingRevIds = new Set(existingRevRows.map((r) => r.id));
  let addedRevs = 0;
  for (const rev of INITIAL_USER_REVIEWS) {
    if (!existingRevIds.has(rev.id)) {
      await insertReview(rev);
      addedRevs += 1;
    }
  }
  if (addedRevs > 0) {
    console.log(`[db] Seeded ${addedRevs} ulasan baru ke tabel reviews.`);
  }

  const [[{ subCount }]] = await pool.query(
    'SELECT COUNT(*) AS subCount FROM submissions'
  );
  if (Number(subCount) === 0) {
    for (const sub of INITIAL_PENDING_SUBMISSIONS) {
      await insertSubmission(sub);
    }
    console.log(
      `[db] Seeded ${INITIAL_PENDING_SUBMISSIONS.length} rekomendasi komunitas ke tabel submissions.`
    );
  }

  console.log(
    `[db] Terhubung ke MySQL ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_NAME}`
  );
}
