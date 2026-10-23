import React, { createContext, useContext, useState } from 'react';
import { Language, LocalizedText, CuisineType, HalalStatus } from '../types';

const translations = {
  id: {
    nav: {
      brandSubtitle: 'Direktori & Cerita Kuliner Jakarta',
      home: 'Beranda',
      directory: 'Direktori Kuliner',
      featuredSpot: 'Ulasan Pilihan',
      editorial: 'Cerita Redaksi',
      submitRecommendation: 'Kirim Rekomendasi',
      savedAlbum: 'Favorit Saya',
      savedAlbumEmpty: 'Belum ada tempat makan favorit yang disimpan.',
      savedAlbumHint:
        'Klik ikon penanda (bookmark) pada kartu restoran untuk menyimpan daftar kunjungan kuliner Anda.',
      exploreDirectory: 'Jelajahi Direktori',
    },
    hero: {
      badge: 'Edisi Kuliner Pilihan Jakarta',
      titleStart: 'Temukan Cita Rasa Terbaik di',
      titleHighlight: 'Jakarta',
      subtitle:
        'Panduan kuliner hangat yang merangkum kelezatan autentik—mulai dari kedai mie tepi danau di Sunter, ruko legendaris di Kelapa Gading, kuliner malam Mangga Besar, hingga jajanan klasik di Kemayoran dan Senen.',
      searchPlaceholder: 'Cari bakmi karet, sate kuah, kopi saring, atau nama tempat...',
      allNeighborhoods: 'Semua Wilayah',
      searchBtn: 'Cari Kuliner',
      trendingLabel: 'Pencarian Populer:',
      instantMatches: 'Rekomendasi Tempat Makan',
      coverSpotlight: 'Pilihan Editor Minggu Ini',
      editorialPromiseTitle: 'Kurasi Komunitas & Redaksi',
      editorialPromiseDesc: 'Setiap tempat makan dipilih berdasarkan keaslian rasa dan suasana.',
    },
    home: {
      neighborhoodTag: 'Jelajahi Per Wilayah',
      neighborhoodTitle: 'Kawasan Kuliner Pilihan Jakarta',
      neighborhoodSubtitle:
        'Fokus kurasi kuliner di lima kawasan utama yang kaya tradisi rasa: Kemayoran, Sunter, Kelapa Gading, Mangga Besar, dan Senen.',
      spotsAvailable: 'Tempat Makan',
      browseNeighborhood: 'Lihat Kuliner di',
      featuredTag: 'Rekomendasi Pilihan',
      featuredTitle: 'Tempat Makan Favorit Minggu Ini',
      viewAllDirectory: 'Lihat Semua Tempat Makan',
      collectionsTag: 'Koleksi Tematik',
      collectionsTitle: 'Panduan Kuliner Terkurasi',
      collectionsSubtitle:
        'Daftar pilihan redaksi untuk makan siang praktis, makan malam keluarga, hingga kuliner malam hari.',
      openCollection: 'Buka Koleksi',
      editorialTag: 'Jurnal Food Album',
      editorialTitle: 'Cerita & Liputan Kuliner Terbaru',
      readMagazine: 'Baca Selengkapnya',
      readFullStory: 'Baca Artikel',
      communityBannerTitle: 'Punya Tempat Makan Favorit di Sekitar Anda?',
      communityBannerDesc:
        'Bantu komunitas kami menemukan kuliner tersembunyi di Kemayoran, Sunter, Kelapa Gading, Mangga Besar, atau Senen! Kirimkan rekomendasi atau ulasan Anda.',
      communityBannerBtn: 'Kirim Rekomendasi Sekarang',
    },
    directory: {
      badge: 'Direktori Kuliner Jakarta',
      title: 'Temukan Tempat Makan Pilihan',
      subtitle:
        'Gunakan filter wilayah, jenis hidangan, status kehalalan, dan kisaran harga untuk menemukan destinasi kuliner Anda.',
      showing: 'Menampilkan',
      of: 'dari',
      spots: 'tempat makan',
      clearAll: 'Atur Ulang Filter',
      searchPlaceholder: 'Cari nama restoran, hidangan, atau jalan...',
      allListings: 'Semua Status Kurasi',
      verifiedOnly: 'Terverifikasi Redaksi',
      communityCurated: 'Rekomendasi Komunitas',
      allHalal: 'Semua Status Halal',
      sortFeatured: 'Urutkan: Pilihan Redaksi',
      sortRating: 'Urutkan: Rating Tertinggi',
      sortPriceLow: 'Urutkan: Harga Terendah',
      sortPriceHigh: 'Urutkan: Harga Tertinggi',
      neighborhoodLabel: 'Pilih Wilayah Jakarta:',
      allSectors: 'Semua Wilayah',
      cuisineLabel: 'Kategori Hidangan:',
      allCuisines: 'Semua Hidangan',
      priceLabel: 'Kisaran Harga Per Orang:',
      anyPrice: 'Semua Harga',
      activeFilters: 'Filter Aktif:',
      emptyTitle: 'Belum Ada Tempat Makan yang Sesuai Filter',
      emptyDesc:
        'Kami belum menemukan tempat makan dengan kombinasi filter tersebut. Coba atur ulang pencarian atau rekomendasikan tempat favorit Anda.',
      resetBtn: 'Atur Ulang Semua Filter',
      suggestBtn: 'Kirim Rekomendasi Tempat Baru',
    },
    card: {
      verifiedBadge: 'Pilihan Terverifikasi',
      communityBadge: 'Kurasi Komunitas',
      sponsoredBadge: 'Disponsori',
      estPrice: 'Kisaran Harga',
      exploreBtn: 'Lihat Detail',
    },
    detail: {
      backToDirectory: 'Kembali ke Direktori',
      switchSpot: 'Pilih Tempat Lain:',
      estPriceLabel: 'Estimasi Pengeluaran / Orang',
      saveSpot: 'Simpan Favorit',
      savedSpot: 'Tersimpan',
      vibeTagsTitle: 'Suasana & Karakter',
      galleryTitle: 'Galeri Foto Tempat Makan',
      editorialReviewTag: 'Ulasan Redaksi Food Album',
      editorialReviewTitle: 'Catatan Cita Rasa & Suasana',
      byAuthor: 'Ditulis oleh',
      atmosphereTitle: 'Suasana Tempat',
      insiderTipTitle: 'Tips Berkunjung',
      signatureDishesTag: 'Daftar Menu & Harga',
      signatureDishesTitle: 'Menu Makanan & Minuman',
      popularDish: 'Menu Favorit',
      estDishPrice: 'Harga menu',
      locationTitle: 'Lokasi & Jam Operasional',
      streetAddress: 'Alamat Lengkap',
      openingHours: 'Jam Buka',
      nearbyLandmark: 'Patokan Lokasi',
      copyAddress: 'Salin Alamat',
      copied: 'Tersalin!',
      openGoogleMaps: 'Buka di Google Maps',
      userReviewsTitle: 'Ulasan Pengunjung',
      writeReviewBtn: 'Tulis Ulasan / Rekomendasi',
      noReviewsYet: 'Belum ada ulasan pengunjung untuk tempat ini.',
      favoriteDishLabel: 'Hidangan Favorit:',
      relatedTitle: 'Tempat Makan Serupa di Sekitar',
      seeAllNeighborhood: 'Lihat semua di',
    },
    editorial: {
      issueHeader: 'Pilih Liputan Redaksi:',
      sponsoredTag: 'Artikel Disponsori',
      independentTag: 'Liputan Independen',
      publishedOn: 'Diterbitkan:',
      shareStory: 'Bagikan Cerita',
      linkCopied: 'Tautan Tersalin',
      tocTitle: 'Daftar Isi Artikel',
      disclosureTitle: 'Tentang Liputan Ini',
      sponsoredDisclosure:
        'Artikel ini merupakan kolaborasi bersponsor bersama mitra kuliner kami, disusun dengan standar kurasi redaksi Food Album.',
      independentDisclosure:
        'Artikel ini ditulis secara independen oleh tim redaksi Food Album sebagai panduan eksplorasi kuliner Jakarta.',
      aboutWriter: 'Tentang Penulis',
      featuredInChapter: 'Tempat Makan dalam Bab Ini',
      editorDishPick: 'Menu Andalan:',
      openFullReview: 'Lihat Ulasan Lengkap',
    },
    submit: {
      badge: 'Kurasi Berbasis Komunitas',
      title: 'Kirim Rekomendasi & Ulasan Kuliner',
      subtitle:
        'Bantu sesama pecinta kuliner menemukan tempat makan terbaik di Kemayoran, Sunter, Kelapa Gading, Mangga Besar, dan Senen. Setiap saran tempat makan dan ulasan yang masuk akan melalui proses kurasi tim kami.',
      tabNewSpot: 'Sarankan Tempat Makan Baru',
      tabNewReview: 'Kirim Ulasan Pengunjung',
      successBannerTitle: 'Rekomendasi Berhasil Dikirim',
      successBannerMessage:
        'Terima kasih! Rekomendasi Anda telah diterima dan akan dikurasi oleh tim kami sebelum dipublikasikan.',
      submitAnotherBtn: 'Kirim Rekomendasi Lainnya',
      spotNameLabel: 'Nama Tempat Makan / UMKM',
      spotNamePlaceholder: 'Contoh: Bakmi Karet Krekot Sunter',
      neighborhoodLabel: 'Wilayah di Jakarta',
      cuisineLabel: 'Kategori Hidangan',
      halalStatusLabel: 'Status Sertifikasi Halal',
      priceTierLabel: 'Tingkat Harga',
      estPriceLabel: 'Estimasi Harga Per Orang (Rupiah)',
      estPricePlaceholder: 'Contoh: Rp 35.000 – Rp 65.000',
      addressLabel: 'Alamat atau Patokan Lokasi',
      addressPlaceholder: 'Contoh: Jl. Danau Sunter Utara Blok G, dekat danau',
      signatureDishLabel: 'Menu Andalan Wajib Coba',
      signatureDishPlaceholder: 'Contoh: Bakmi Karet Ayam Kampung & Bakso Goreng',
      reasonLabel: 'Mengapa Anda Merekomendasikan Tempat Ini?',
      reasonPlaceholder:
        'Ceritakan keistimewaan rasa, tekstur hidangan, atau suasana tempat makan ini...',
      submitterNameLabel: 'Nama Anda',
      submitterNamePlaceholder: 'Contoh: Clarissa Putri',
      submitterEmailLabel: 'Alamat Email Anda',
      submitterEmailPlaceholder: 'Contoh: clarissa@email.com',
      submitSpotBtn: 'Kirim Rekomendasi Tempat Makan',
      fillDemoBtn: 'Isi Contoh Data',
      selectRestaurantLabel: 'Pilih Tempat Makan yang Ingin Diulas',
      reviewerNameLabel: 'Nama Anda',
      ratingLabel: 'Penilaian Anda (1 - 5 Bintang)',
      favDishLabel: 'Menu yang Anda Pesan',
      favDishPlaceholder: 'Contoh: Sate Kuah Pontianak',
      reviewCommentLabel: 'Ulasan & Pengalaman Anda',
      reviewCommentPlaceholder:
        'Bagikan pengalaman Anda mencicipi hidangan dan pelayanan di tempat ini...',
      submitReviewBtn: 'Kirim Ulasan untuk Dikurasi',
      curationStepsTitle: 'Bagaimana Proses Kurasi Kami?',
      step1Title: '1. Pengiriman Komunitas',
      step1Desc: 'Pengunjung mengirimkan saran tempat makan baru atau ulasan pengalaman bersantap.',
      step2Title: '2. Verifikasi & Moderasi Tim',
      step2Desc: 'Tim kurator memeriksa keaslian lokasi, kesesuaian menu, dan memoderasi ulasan.',
      step3Title: '3. Publikasi di Direktori',
      step3Desc: 'Tempat makan yang disetujui langsung tampil di halaman utama dan direktori Food Album.',
    },
    admin: {
      loginTitle: 'Login Administrator Food Album',
      loginSubtitle: 'Silakan masuk menggunakan kredensial pengelola untuk mengakses Dashboard Admin.',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginBtn: 'Masuk ke Dashboard Admin',
      loginError: 'Username atau password tidak sesuai. Silakan periksa kembali.',
      logoutBtn: 'Keluar (Logout)',
      badge: 'Panel Pengelola Platform',
      title: 'Dashboard Admin Food Album',
      subtitle:
        'Kelola direktori UMKM, daftar menu makanan, galeri foto (maks. 10 foto), moderasi ulasan, dan antrean rekomendasi komunitas.',
      backToPublicSite: 'Lihat Website Utama',
      tabSubmissions: 'Antrean Persetujuan',
      tabUmkm: 'Manajemen UMKM & Menu',
      tabReviews: 'Moderasi Ulasan',
      statsActiveUmkm: 'UMKM Terpublikasi',
      statsPendingQueue: 'Menunggu Persetujuan',
      statsTotalReviews: 'Total Ulasan Pengguna',
      queueTitle: 'Antrean Rekomendasi Komunitas',
      queueDesc:
        'Tinjau saran tempat makan dari pengguna. Klik "Setujui & Publikasikan" agar tempat makan langsung tampil di Direktori utama.',
      queueEmpty: 'Tidak ada antrean rekomendasi saat ini. Semua saran telah ditinjau!',
      submittedBy: 'Direkomendasikan oleh:',
      signatureDish: 'Menu Andalan:',
      approveBtn: 'Setujui & Publikasikan',
      rejectBtn: 'Tolak Saran',
      approvedToast: 'Tempat makan berhasil disetujui dan telah dipublikasikan ke Direktori!',
      umkmAddTitle: 'Tambah UMKM Baru',
      umkmEditTitle: 'Edit Data UMKM & Menu',
      umkmAddDesc: 'Tambahkan atau perbarui tempat makan, daftar menu beserta harga, status halal, dan galeri foto (maksimal 10 foto).',
      umkmListTitle: 'Daftar UMKM Terpublikasi',
      umkmListDesc: 'Kelola daftar tempat makan yang saat ini tampil di website.',
      addUmkmBtn: 'Simpan & Publikasikan UMKM',
      updateUmkmBtn: 'Simpan Perubahan UMKM',
      cancelEditBtn: 'Batal Edit',
      editUmkmBtn: 'Edit Menu / Foto',
      deleteUmkmBtn: 'Hapus UMKM',
      umkmAddedToast: 'UMKM baru beserta menu dan galeri berhasil ditambahkan!',
      umkmUpdatedToast: 'Data UMKM, menu, dan galeri foto berhasil diperbarui!',
      umkmDeletedToast: 'UMKM telah dihapus dari direktori.',
      photoPresetLabel: 'Foto Sampul Utama (Cover)',
      gallerySectionTitle: 'Upload Foto Galeri Tempat Makan (Maksimal 10 Foto)',
      gallerySectionHint: 'Unggah file gambar dari perangkat Anda atau tambahkan foto galeri untuk ditampilkan di halaman detail restoran.',
      uploadGalleryBtn: 'Pilih File Gambar Galeri',
      addSampleGalleryBtn: '+ Tambah Foto Contoh',
      galleryLimitReached: 'Batas maksimal 10 foto galeri telah tercapai.',
      menuSectionTitle: 'Manajemen Daftar Menu Makanan & Harga',
      addMenuRowBtn: '+ Tambah Menu Lain',
      menuNamePlaceholder: 'Nama Menu (misal: Bakmi Karet Spesial)',
      menuPricePlaceholder: 'Harga (misal: Rp 45.000)',
      menuDescPlaceholder: 'Deskripsi singkat menu',
      reviewModTitle: 'Moderasi Ulasan Pengunjung',
      reviewModDesc:
        'Pantau seluruh ulasan pengguna. Gunakan tombol Hapus merah untuk menyingkirkan ulasan palsu, spam, atau tidak pantas.',
      deleteReviewBtn: 'Hapus Ulasan',
      flaggedBadge: 'Perlu Ditinjau',
      reviewDeletedToast: 'Ulasan telah dihapus secara permanen.',
      reviewsEmpty: 'Belum ada ulasan pengunjung.',
    },
    ad: {
      sponsoredLabel: 'Sponsor & Mitra Kuliner',
      partnerCta: 'Rekomendasikan Kuliner',
    },
    footer: {
      description:
        'Panduan direktori dan cerita kuliner yang merayakan kelezatan autentik di Kemayoran, Sunter, Kelapa Gading, Mangga Besar, dan Senen.',
      neighborhoodsTitle: 'Wilayah Kuliner',
      navigationTitle: 'Navigasi Utama',
      communityTitle: 'Kontribusi Komunitas',
      communityText:
        'Temukan tempat makan lezat di Sunter, Kelapa Gading, Kemayoran, Mangga Besar, atau Senen? Bagikan rekomendasi Anda.',
      rights: '© 2026 Food Album Jakarta. Seluruh hak cipta dilindungi.',
    },
  },
  en: {
    nav: {
      brandSubtitle: 'Jakarta Culinary Directory & Stories',
      home: 'Home',
      directory: 'Directory',
      featuredSpot: 'Featured Review',
      editorial: 'Editorial Stories',
      submitRecommendation: 'Submit Recommendation',
      savedAlbum: 'My Saved Spots',
      savedAlbumEmpty: 'You have not saved any favorite spots yet.',
      savedAlbumHint:
        'Click the bookmark icon on any restaurant card to save places for your next culinary visit.',
      exploreDirectory: 'Explore Directory',
    },
    hero: {
      badge: 'Curated Jakarta Culinary Edition',
      titleStart: 'Savor the Finest Authentic Flavors of',
      titleHighlight: 'Jakarta',
      subtitle:
        'A warm culinary guide celebrating hyper-local favorites—from lakeside noodle stalls in Sunter and legendary shophouses in Kelapa Gading to night-market gems in Mangga Besar, Kemayoran, and Senen.',
      searchPlaceholder: 'Search handmade noodles, satay, artisan coffee, or restaurant name...',
      allNeighborhoods: 'All Areas',
      searchBtn: 'Find Food',
      trendingLabel: 'Popular Cravings:',
      instantMatches: 'Matching Culinary Spots',
      coverSpotlight: 'Editor’s Weekly Spotlight',
      editorialPromiseTitle: 'Community & Editorial Curation',
      editorialPromiseDesc: 'Every culinary spot is selected for authentic flavor and welcoming character.',
    },
    home: {
      neighborhoodTag: 'Explore by Area',
      neighborhoodTitle: 'Curated Jakarta Culinary Areas',
      neighborhoodSubtitle:
        'Focused on five vibrant culinary neighborhoods rich in flavor: Kemayoran, Sunter, Kelapa Gading, Mangga Besar, and Senen.',
      spotsAvailable: 'Dining Spots',
      browseNeighborhood: 'Explore Spots in',
      featuredTag: 'Curated Selection',
      featuredTitle: 'Featured Tables This Week',
      viewAllDirectory: 'View Full Directory',
      collectionsTag: 'Thematic Guides',
      collectionsTitle: 'Curated Food Collections',
      collectionsSubtitle:
        'Hand-picked dining guides for quick lunches, family feasts, and late-night comfort bowls.',
      openCollection: 'Explore Collection',
      editorialTag: 'The Food Album Journal',
      editorialTitle: 'Latest Culinary Stories',
      readMagazine: 'Read Full Issue',
      readFullStory: 'Read Article',
      communityBannerTitle: 'Know a Hidden Culinary Gem Nearby?',
      communityBannerDesc:
        'Help fellow food lovers discover great local kitchens across Kemayoran, Sunter, Kelapa Gading, Mangga Besar, and Senen! Submit your recommendation.',
      communityBannerBtn: 'Submit Recommendation',
    },
    directory: {
      badge: 'Jakarta Culinary Directory',
      title: 'Explore Curated Dining Spots',
      subtitle:
        'Filter by area, cuisine specialization, halal status, and price range to find your next memorable meal.',
      showing: 'Showing',
      of: 'of',
      spots: 'dining spots',
      clearAll: 'Reset Filters',
      searchPlaceholder: 'Search by restaurant name, signature dish, or street...',
      allListings: 'All Curation Status',
      verifiedOnly: 'Editorial Verified',
      communityCurated: 'Community Pick',
      allHalal: 'All Halal Status',
      sortFeatured: 'Sort: Editorial Featured',
      sortRating: 'Sort: Highest Rated',
      sortPriceLow: 'Sort: Price Low to High',
      sortPriceHigh: 'Sort: Price High to Low',
      neighborhoodLabel: 'Jakarta Areas:',
      allSectors: 'All Areas',
      cuisineLabel: 'Cuisine Categories:',
      allCuisines: 'All Cuisines',
      priceLabel: 'Estimated Price Per Person:',
      anyPrice: 'Any Price',
      activeFilters: 'Active Filters:',
      emptyTitle: 'No Dining Spots Match Your Filters',
      emptyDesc:
        'We could not find any restaurants matching that exact filter combination. Try resetting your filters or recommend a new spot.',
      resetBtn: 'Reset All Filters',
      suggestBtn: 'Recommend a New Spot',
    },
    card: {
      verifiedBadge: 'Verified Pick',
      communityBadge: 'Community Curated',
      sponsoredBadge: 'Sponsored',
      estPrice: 'Estimated Price',
      exploreBtn: 'View Details',
    },
    detail: {
      backToDirectory: 'Back to Directory',
      switchSpot: 'Switch Restaurant:',
      estPriceLabel: 'Estimated Cost / Person',
      saveSpot: 'Save to Favorites',
      savedSpot: 'Saved',
      vibeTagsTitle: 'Atmosphere & Highlights',
      galleryTitle: 'Restaurant Photo Gallery',
      editorialReviewTag: 'Food Album Editorial Review',
      editorialReviewTitle: 'Tasting Notes & Verdict',
      byAuthor: 'Written by',
      atmosphereTitle: 'The Atmosphere',
      insiderTipTitle: 'Insider Tip',
      signatureDishesTag: 'Full Menu & Prices',
      signatureDishesTitle: 'Food & Beverage Menu',
      popularDish: 'Signature Dish',
      estDishPrice: 'Menu price',
      locationTitle: 'Location & Opening Hours',
      streetAddress: 'Street Address',
      openingHours: 'Opening Hours',
      nearbyLandmark: 'Nearby Landmark',
      copyAddress: 'Copy Address',
      copied: 'Copied!',
      openGoogleMaps: 'Open in Google Maps',
      userReviewsTitle: 'Diner Reviews',
      writeReviewBtn: 'Submit a Review',
      noReviewsYet: 'No diner reviews yet for this spot.',
      favoriteDishLabel: 'Ordered Dish:',
      relatedTitle: 'Similar Dining Spots Nearby',
      seeAllNeighborhood: 'See all in',
    },
    editorial: {
      issueHeader: 'Select Feature Story:',
      sponsoredTag: 'Sponsored Feature',
      independentTag: 'Independent Editorial',
      publishedOn: 'Published:',
      shareStory: 'Share Article',
      linkCopied: 'Link Copied',
      tocTitle: 'Table of Contents',
      disclosureTitle: 'Editorial Note',
      sponsoredDisclosure:
        'This story is presented in partnership with our culinary sponsor and crafted with Food Album editorial standards.',
      independentDisclosure:
        'This feature was independently produced by the Food Album editorial team as a guide to Jakarta dining.',
      aboutWriter: 'About the Author',
      featuredInChapter: 'Featured Spot in This Chapter',
      editorDishPick: 'Signature Dish:',
      openFullReview: 'Read Full Review',
    },
    submit: {
      badge: 'Community-Driven Curation',
      title: 'Submit a Culinary Recommendation',
      subtitle:
        'Help fellow food lovers discover the best kitchens in Kemayoran, Sunter, Kelapa Gading, Mangga Besar, and Senen. Every submission is curated by our team before publication.',
      tabNewSpot: 'Recommend a New Spot',
      tabNewReview: 'Submit a Diner Review',
      successBannerTitle: 'Recommendation Received',
      successBannerMessage:
        'Thank you! Your recommendation has been received and will be curated by our team before being published.',
      submitAnotherBtn: 'Submit Another Recommendation',
      spotNameLabel: 'Restaurant / Culinary Spot Name',
      spotNamePlaceholder: 'e.g. Bakmi Karet Krekot Sunter',
      neighborhoodLabel: 'Jakarta Area',
      cuisineLabel: 'Cuisine Category',
      halalStatusLabel: 'Halal Certification Status',
      priceTierLabel: 'Price Tier',
      estPriceLabel: 'Estimated Price Per Person (IDR)',
      estPricePlaceholder: 'e.g. Rp 35.000 – Rp 65.000',
      addressLabel: 'Street Address or Landmark',
      addressPlaceholder: 'e.g. Jl. Danau Sunter Utara Blok G',
      signatureDishLabel: 'Must-Try Signature Dish',
      signatureDishPlaceholder: 'e.g. Handmade Springy Egg Noodles & Fried Meatballs',
      reasonLabel: 'Why Do You Recommend This Spot?',
      reasonPlaceholder:
        'Tell us what makes the flavors, cooking technique, or atmosphere special...',
      submitterNameLabel: 'Your Name',
      submitterNamePlaceholder: 'e.g. Clarissa Putri',
      submitterEmailLabel: 'Your Email Address',
      submitterEmailPlaceholder: 'e.g. clarissa@email.com',
      submitSpotBtn: 'Submit Spot Recommendation',
      fillDemoBtn: 'Fill Sample Recommendation',
      selectRestaurantLabel: 'Select Restaurant to Review',
      reviewerNameLabel: 'Your Name',
      ratingLabel: 'Your Rating (1 - 5 Stars)',
      favDishLabel: 'Dish You Ordered',
      favDishPlaceholder: 'e.g. Soto Betawi Susu',
      reviewCommentLabel: 'Your Review & Dining Experience',
      reviewCommentPlaceholder:
        'Share your honest thoughts on the flavors, portion, and atmosphere...',
      submitReviewBtn: 'Submit Review for Curation',
      curationStepsTitle: 'How Our Community Curation Works',
      step1Title: '1. Community Submission',
      step1Desc: 'Diners submit a hidden-gem restaurant suggestion or an honest dining review.',
      step2Title: '2. Team Curation & Verification',
      step2Desc: 'Our editors verify the location, signature dishes, and moderate community reviews.',
      step3Title: '3. Published to the Directory',
      step3Desc: 'Approved spots immediately go live in the main Food Album directory.',
    },
    admin: {
      loginTitle: 'Food Album Administrator Login',
      loginSubtitle: 'Please sign in with your administrator credentials to access the Admin Dashboard.',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginBtn: 'Sign In to Admin Dashboard',
      loginError: 'Invalid username or password. Please try again.',
      logoutBtn: 'Sign Out',
      badge: 'Platform Management Panel',
      title: 'Food Album Admin Dashboard',
      subtitle:
        'Manage UMKM directory listings, dynamic food menus & prices, photo galleries (up to 10 photos), diner reviews, and community submissions.',
      backToPublicSite: 'View Public Website',
      tabSubmissions: 'Submission Queue',
      tabUmkm: 'UMKM & Menu Manager',
      tabReviews: 'Review Moderation',
      statsActiveUmkm: 'Published UMKM Spots',
      statsPendingQueue: 'Pending Approval',
      statsTotalReviews: 'Total User Reviews',
      queueTitle: 'Community Submission Queue',
      queueDesc:
        'Review dining recommendations from the community. Click "Approve & Publish" to publish the spot directly to the main Directory.',
      queueEmpty: 'The submission queue is empty. All community suggestions have been reviewed!',
      submittedBy: 'Submitted by:',
      signatureDish: 'Signature Dish:',
      approveBtn: 'Approve & Publish',
      rejectBtn: 'Reject',
      approvedToast: 'Spot approved and published live to the main Directory!',
      umkmAddTitle: 'Add New UMKM Spot',
      umkmEditTitle: 'Edit UMKM & Menu Details',
      umkmAddDesc: 'Add or update a dining spot, dynamic menu items with prices, halal status, and up to 10 gallery photos.',
      umkmListTitle: 'Published UMKM Directory List',
      umkmListDesc: 'Manage all restaurants currently live on the platform.',
      addUmkmBtn: 'Save & Publish UMKM',
      updateUmkmBtn: 'Save UMKM Changes',
      cancelEditBtn: 'Cancel Edit',
      editUmkmBtn: 'Edit Menu / Photos',
      deleteUmkmBtn: 'Delete UMKM',
      umkmAddedToast: 'New UMKM spot with menu and gallery added to the live directory!',
      umkmUpdatedToast: 'UMKM details, menu, and photo gallery updated!',
      umkmDeletedToast: 'UMKM spot removed from the directory.',
      photoPresetLabel: 'Main Cover Photo',
      gallerySectionTitle: 'Upload Restaurant Gallery Photos (Max 10 Photos)',
      gallerySectionHint: 'Upload image files from your device or add sample food photos to render on the restaurant detail page.',
      uploadGalleryBtn: 'Choose Gallery Image Files',
      addSampleGalleryBtn: '+ Add Sample Photo',
      galleryLimitReached: 'Maximum limit of 10 gallery photos reached.',
      menuSectionTitle: 'Dynamic Food Menu & Price Management',
      addMenuRowBtn: '+ Add Another Menu Item',
      menuNamePlaceholder: 'Menu Name (e.g. Special Handmade Noodles)',
      menuPricePlaceholder: 'Price (e.g. Rp 45.000)',
      menuDescPlaceholder: 'Short menu description',
      reviewModTitle: 'Diner Review Moderation',
      reviewModDesc:
        'Inspect all user-submitted reviews. Use the prominent red Delete button to remove irrelevant, fake, or inappropriate reviews.',
      deleteReviewBtn: 'Delete',
      flaggedBadge: 'Needs Attention',
      reviewDeletedToast: 'Review has been permanently deleted.',
      reviewsEmpty: 'No user reviews remaining.',
    },
    ad: {
      sponsoredLabel: 'Culinary Partner Spotlight',
      partnerCta: 'Recommend a Spot',
    },
    footer: {
      description:
        'A warm culinary directory and magazine celebrating authentic flavors across Kemayoran, Sunter, Kelapa Gading, Mangga Besar, and Senen.',
      neighborhoodsTitle: 'Culinary Areas',
      navigationTitle: 'Explore Platform',
      communityTitle: 'Community Curation',
      communityText:
        'Found a delicious spot in Sunter, Kelapa Gading, Kemayoran, Mangga Besar, or Senen? Share your recommendation with our team.',
      rights: '© 2026 Food Album Jakarta. All rights reserved.',
    },
  },
};

const cuisineLabels: Record<CuisineType, LocalizedText> = {
  'Bakmi & Mie Tradisional': {
    id: 'Bakmi & Mie Tradisional',
    en: 'Handmade Noodles & Bakmi',
  },
  'Seafood Pesisir Segar': {
    id: 'Seafood Pesisir Segar',
    en: 'Fresh Coastal Seafood',
  },
  'Kopitiam & Roastery': {
    id: 'Kopitiam & Roastery',
    en: 'Kopitiam & Coffee Roastery',
  },
  'Jepang & Grill Modern': {
    id: 'Jepang & Grill Modern',
    en: 'Modern Japanese & Grill',
  },
  'Nusantara & Bakar Arang': {
    id: 'Nusantara & Bakar Arang',
    en: 'Indonesian Charcoal Grill',
  },
  'Pastry & Hidangan Penutup': {
    id: 'Pastry & Hidangan Penutup',
    en: 'Artisan Pastry & Desserts',
  },
};

const halalLabels: Record<HalalStatus, LocalizedText> = {
  Halal: { id: 'Halal', en: 'Halal' },
  'Non-Halal': { id: 'Non-Halal', en: 'Non-Halal' },
  'Belum Ada Sertifikasi': {
    id: 'Belum Ada Sertifikasi',
    en: 'No Certification Yet',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof translations.id;
  localize: (text: LocalizedText | string) => string;
  translateCuisine: (cuisine: CuisineType) => string;
  translateHalal: (status: HalalStatus) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Language>('id');

  const toggleLang = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const localize = (text: LocalizedText | string): string => {
    if (typeof text === 'string') return text;
    return text[lang] || text.id;
  };

  const translateCuisine = (cuisine: CuisineType): string => {
    const item = cuisineLabels[cuisine];
    return item ? item[lang] : cuisine;
  };

  const translateHalal = (status: HalalStatus): string => {
    const item = halalLabels[status];
    return item ? item[lang] : status;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t: translations[lang],
        localize,
        translateCuisine,
        translateHalal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
