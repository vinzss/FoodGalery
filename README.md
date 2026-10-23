# Food Album — Direktori & Cerita Kuliner Jakarta Utara (Bilingual ID/EN)

Platform pencarian dan cerita kuliner *hyper-local* yang berfokus pada kawasan **Jakarta Utara** (*Kelapa Gading, PIK, Sunter, Pluit, Muara Karang, dan Ancol*).

## ✨ Pembaruan Utama (Major Refactoring)

### 1. Desain Ulang UI/UX (Tema Terang, Hangat & Menggugah Selera)
- **Palet Warna Hangat**: Latar belakang krem hangat (`#FAF6F0`, `#F4EDE2`), kartu putih bersih (`#FFFFFF`), teks *charcoal* (`#1F1D1A`), serta aksen *Terracotta* (`#D96C45`) dan *Olive* (`#637048`).
- **Antarmuka Bersih (Clean UI)**: Seluruh kode area mentah, nomor ID database, koordinat teknis, maupun teks debug telah dihapus sepenuhnya dari tampilan pengguna.

### 2. Fitur Multi-Bahasa (Bilingual ID / EN)
- Dilengkapi sakelar bahasa (**ID / EN**) di bagian navigasi atas (`GlassHeader`).
- Seluruh teks antarmuka, deskripsi tempat makan, ulasan redaksi, artikel majalah, formulir rekomendasi, hingga Dashboard Admin berubah secara dinamis antara **Bahasa Indonesia** dan **Bahasa Inggris**.

### 3. Alur Kurasi Berbasis Komunitas (Sisi Pengguna)
- Pengguna tidak dapat mempublikasikan tempat makan secara instan ke direktori utama.
- Tersedia halaman **Kirim Rekomendasi / Submit Recommendation** (`src/pages/SubmitRecommendationPage.tsx`) untuk menyarankan tempat makan baru atau mengirim ulasan pengunjung.
- Menampilkan pesan konfirmasi ramah setelah pengiriman:
  - **ID**: *"Terima kasih! Rekomendasi Anda telah diterima dan akan dikurasi oleh tim kami sebelum dipublikasikan."*
  - **EN**: *"Thank you! Your recommendation has been received and will be curated by our team before being published."*

### 4. Dashboard Admin (`/admin` — `src/admin/`)
- **Antrean Persetujuan (`SubmissionQueue.tsx`)**: Melihat rekomendasi tempat makan dari komunitas dan menyetujuinya (**Setujui & Publikasikan / Approve & Publish**) agar langsung tampil di direktori utama.
- **Manajemen UMKM (`UmkmManager.tsx`)**: Menambahkan UMKM baru ke direktori publik dan menghapus UMKM yang ada.
- **Moderasi Ulasan (`ReviewModerator.tsx`)**: Memantau seluruh ulasan pengunjung dengan tombol **Hapus (Delete)** berwarna merah yang menonjol untuk menghapus ulasan palsu, spam, atau tidak pantas.

## 🚀 Cara Menjalankan

```powershell
cd D:\github\FoodAlbum
npm run dev
```
