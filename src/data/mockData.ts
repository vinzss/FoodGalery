import type {
  NeighborhoodInfo,
  Restaurant,
  CuratedCollection,
  EditorialArticle,
  CuisineType,
  PriceTier,
  NeighborhoodName,
  HalalStatus,
  UserReview,
  CommunitySubmission,
} from '../types';

export const NEIGHBORHOOD_NAMES: NeighborhoodName[] = [
  'Kemayoran',
  'Sunter',
  'Kelapa Gading',
  'Mangga Besar',
  'Senen',
];

export const HALAL_STATUS_OPTIONS: HalalStatus[] = [
  'Halal',
  'Non-Halal',
  'Belum Ada Sertifikasi',
];

export const NEIGHBORHOODS: NeighborhoodInfo[] = [
  {
    name: 'Sunter',
    tagline: {
      id: 'Kuliner Tepi Danau, Kedai Kopi & Hidangan Favorit Harian',
      en: 'Lakeside Street Food, Coffee Shops & Daily Favorites',
    },
    description: {
      id: 'Kawasan strategis dengan deretan kedai mie Hokkien arang, tempat nongkrong sore di sekitar Danau Sunter, dan rumah makan keluarga yang nyaman.',
      en: 'A vibrant culinary hub featuring charcoal-braised Hokkien noodles, afternoon coffee spots around Danau Sunter, and welcoming family kitchens.',
    },
    signatureCravings: [
      { id: 'Mie Hokkien Arang', en: 'Charcoal Hokkien Noodles' },
      { id: 'Kopi Susu Saring', en: 'Filtered Milk Coffee' },
      { id: 'Sate Ayam Kuah', en: 'Broth Chicken Satay' },
      { id: 'Ayam Geprek & Bakar', en: 'Charcoal Grilled Chicken' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Kelapa Gading',
    tagline: {
      id: 'Boulevard Kuliner yang Tak Pernah Tidur',
      en: 'The Sleepless Culinary Boulevard',
    },
    description: {
      id: 'Deretan ruko bakmi karet legendaris di Jl. Boulevard Raya hingga ikan bakar rempah khas Sulawesi dan kafe pastry modern.',
      en: 'From heritage handmade noodle shophouses along Boulevard Raya to smoky Sulawesi grilled fish and modern pastry cafes.',
    },
    signatureCravings: [
      { id: 'Bakmi Karet Kampung', en: 'Handmade Egg Noodles' },
      { id: 'Ikan Bakar Parape', en: 'Parape Grilled Fish' },
      { id: 'Seafood Wok Hangat', en: 'Wok-Fried Seafood' },
      { id: 'Artisan Croissant', en: 'Artisan Croissant' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Kemayoran',
    tagline: {
      id: 'Soto Betawi Legendaris, Ketan Susu & Kuliner Malam',
      en: 'Legendary Soto Betawi, Sweet Sticky Rice & Night Stalls',
    },
    description: {
      id: 'Pusat kuliner hangat dari pagi hingga larut malam—terkenal dengan ketan susu legendaris, soto kuah gurih, dan hidangan Nusantara.',
      en: 'A beloved culinary district from dawn till late night—famous for sweet milk sticky rice, rich Soto Betawi, and classic Indonesian comfort dishes.',
    },
    signatureCravings: [
      { id: 'Soto Betawi Susu', en: 'Milk-Broth Soto Betawi' },
      { id: 'Ketan Susu Hangat', en: 'Warm Milk Sticky Rice' },
      { id: 'Nasi Uduk Kebon Kacang', en: 'Fragrant Nasi Uduk' },
      { id: 'Bakso Sapi Urat', en: 'Tendon Beef Meatballs' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Mangga Besar',
    tagline: {
      id: 'Surga Kuliner Malam, Kwetiau Sapi & Bubur Tradisional',
      en: 'Late-Night Culinary Haven, Beef Flat Noodles & Congee',
    },
    description: {
      id: 'Kawasan legendaris yang hidup saat matahari terbenam dengan aroma wajan kwetiau siram sapi, bubur hangat, dan olahan durian.',
      en: 'An iconic evening food corridor alive with the smoky aroma of wok-seared beef flat noodles, warm rice porridge, and sweet desserts.',
    },
    signatureCravings: [
      { id: 'Kwetiau Sapi Siram', en: 'Beef Gravy Flat Noodles' },
      { id: 'Bubur Malam Hangat', en: 'Midnight Rice Congee' },
      { id: 'Cakwe & Roti Goreng', en: 'Crispy Fried Dough' },
      { id: 'Es Durian Manis', en: 'Sweet Iced Durian' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85',
  },
  {
    name: 'Senen',
    tagline: {
      id: 'Kue Subuh Tradisional, Nasi Kapau & Kopitiam Klasik',
      en: 'Traditional Dawn Pastries, Nasi Kapau & Heritage Kopitiams',
    },
    description: {
      id: 'Titik temu kuliner bersejarah Jakarta tempat berpadunya deretan Nasi Kapau Sabana, pasar kue tradisional, dan rumah makan tempo dulu.',
      en: 'A historic Jakarta culinary crossroads uniting authentic Nasi Kapau stalls, traditional pastry markets, and vintage coffee houses.',
    },
    signatureCravings: [
      { id: 'Nasi Kapau Bukittinggi', en: 'Authentic Nasi Kapau' },
      { id: 'Gulai Tambusu & Tunjang', en: 'Spiced Curry Delicacies' },
      { id: 'Kue Tradisional Pasar', en: 'Traditional Market Pastries' },
      { id: 'Es Krim & Roti Jadul', en: 'Vintage Ice Cream & Bakery' },
    ],
    heroImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85',
  },
];

export const CUISINE_TYPES: CuisineType[] = [
  'Bakmi & Mie Tradisional',
  'Seafood Pesisir Segar',
  'Kopitiam & Roastery',
  'Jepang & Grill Modern',
  'Nusantara & Bakar Arang',
  'Pastry & Hidangan Penutup',
];

export const PRICE_TIERS: { tier: PriceTier; rangeIdr: string }[] = [
  { tier: '$', rangeIdr: '< Rp 50.000' },
  { tier: '$$', rangeIdr: 'Rp 50.000 – Rp 150.000' },
  { tier: '$$$', rangeIdr: 'Rp 150.000 – Rp 350.000' },
  { tier: '$$$$', rangeIdr: '> Rp 350.000' },
];

export const FOOD_PHOTO_PRESETS: { label: string; url: string }[] = [
  {
    label: 'Bakmi & Mie Tradisional',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Mie Kuah & Pangsit Hangat',
    url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Seafood & Kepiting Segar',
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Kopi, Sourdough & Roastery',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Ikan Bakar & Kuliner Nusantara',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Pastry & Hidangan Penutup',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Kopitiam & Sarapan Pagi',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Udang Bakar & Grill',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Bakmi Karet Ahong Boulevard',
    tagline: {
      id: 'Racikan bakmi karet telur bebek kenyal dengan minyak bawang putih harum sejak 1988.',
      en: 'Handmade springy duck-egg noodles tossed in fragrant roasted garlic oil since 1988.',
    },
    neighborhood: 'Kelapa Gading',
    subArea: 'Jl. Boulevard Raya, Kelapa Gading',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 38.000 – Rp 65.000',
    minPriceIdr: 38000,
    rating: 4.9,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Seporsi Bakmi Karet Ayam Kampung lengkap dengan taburan bawang putih goreng renyah.',
          en: 'Signature handmade springy noodles topped with free-range chicken and crispy fried garlic.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Pangsit rebus lembut dalam kuah kaldu tulang ayam yang gurih dan hangat.',
          en: 'Silky boiled wontons served in slow-simmered chicken bone broth.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Proses perebusan mie segar setiap pagi di dapur terbuka Boulevard Raya.',
          en: 'Freshly kneaded noodles boiled to order each morning.',
        },
      },
    ],
    editorialSummary: {
      id: 'Tradisi sarapan dan makan siang yang tak tergantikan di Kelapa Gading. Ahong menghadirkan tekstur bakmi karet yang kenyal alami tanpa bahan pengenyal buatan, berpadu sempurna dengan potongan ayam kampung rebus yang lembut.',
      en: 'An essential dining ritual in Kelapa Gading. Ahong crafts naturally springy handmade egg noodles tossed in aromatic shallot-garlic oil and topped with tender poached free-range chicken.',
    },
    editorialReview: {
      verdict: {
        id: 'Salah satu semangkuk bakmi paling jujur dan memuaskan di Kelapa Gading. Setiap helai mienya memiliki gigitan kenyal yang pas dengan balutan minyak kaldu ayam yang gurih.',
        en: 'One of the most comforting and honest noodle bowls in Kelapa Gading. Every strand delivers a satisfying bite coated in savory poultry glaze.',
      },
      atmosphere: {
        id: 'Suasana kedai keluarga klasik yang bersih, terang, dan selalu ramai oleh pelanggan tetap sejak pagi hari.',
        en: 'A bright, welcoming family shophouse bustling with regulars starting early in the morning.',
      },
      insiderTip: {
        id: 'Datanglah sebelum pukul 09.30 pagi di akhir pekan agar tidak kehabisan bakso goreng hangat kloter pertama.',
        en: 'Arrive before 9:30 AM on weekends to catch the first batch of freshly fried prawn-chicken meatballs.',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Bakmi Karet Ayam Kampung Spesial',
        priceIdr: 'Rp 48.000',
        description: {
          id: 'Mie karet tebal dengan irisan ayam kampung rebus, jamur kecap, dan kuah kaldu bening.',
          en: 'Thick springy egg noodles with poached free-range chicken, braised mushrooms, and clear bone broth.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Bakso Goreng Udang Ayam (Isi 3)',
        priceIdr: 'Rp 36.000',
        description: {
          id: 'Bakso goreng renyah di luar dan lembut di dalam, disajikan dengan saus sambal asam manis.',
          en: 'Golden, crisp fried prawn and chicken meatballs served with tangy house chili dip.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Suikiaw Udang Kuah Kaldu',
        priceIdr: 'Rp 42.000',
        description: {
          id: 'Lima buah pangsit udang utuh berpadu bengkuang renyah dan minyak wijen.',
          en: 'Five plump whole-shrimp dumplings with crunchy water chestnuts and sesame oil.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 06.30 – 15.30 WIB',
      en: 'Daily • 6:30 AM – 3:30 PM',
    },
    address: 'Jl. Boulevard Raya Blok QA3 No. 14, Kelapa Gading, Jakarta',
    nearbyLandmark: {
      id: 'Sekitar 300 meter dari La Piazza & Mall Kelapa Gading',
      en: '300 meters from La Piazza & Mall Kelapa Gading',
    },
    vibeTags: [
      { id: 'Sarapan Favorit', en: 'Morning Favorite' },
      { id: 'Resep Warisan', en: 'Heritage Recipe' },
      { id: 'Ramah Keluarga', en: 'Family Friendly' },
    ],
  },
  {
    id: 'rest-2',
    name: 'Mie Hokkien & Kopi Saring Koh Atek Sunter',
    tagline: {
      id: 'Mie Hokkien kuah kental kaldu udang yang dimasak satu per satu di atas anglo arang.',
      en: 'Rich prawn-broth Hokkien noodles cooked one portion at a time over a charcoal brazier.',
    },
    neighborhood: 'Sunter',
    subArea: 'Jl. Danau Sunter Utara, Sunter Agung',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 35.000 – Rp 55.000',
    minPriceIdr: 35000,
    rating: 4.8,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Belum Ada Sertifikasi',
    heroImage:
      'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Mie Hokkien hangat dengan kuah kaldu udang kental dan aroma asap wajan arang.',
          en: 'Charcoal-braised Hokkien noodles glossy with reduced prawn stock.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Seduhan Es Kopi Susu Saring tradisional yang menyegarkan.',
          en: 'Refreshing traditional cloth-filtered iced milk coffee.',
        },
      },
    ],
    editorialSummary: {
      id: 'Kedai favorit warga di kawasan Sunter di mana setiap porsi mie masih dimasak menggunakan wajan besi di atas bara arang bakau, menghasilkan aroma smokey yang khas.',
      en: 'A beloved Sunter neighborhood stall where every plate of Hokkien noodles is braised over glowing mangrove charcoal embers.',
    },
    editorialReview: {
      verdict: {
        id: 'Kesabaran menunggu setiap porsi dimasak di atas anglo arang terbayar lunas begitu mencicipi kuah kentalnya yang kaya kaldu udang.',
        en: 'Each portion takes a few extra minutes on the charcoal brazier, rewarding you with unmatched smoky depth.',
      },
      atmosphere: {
        id: 'Kedai santai di tepi jalan Danau Sunter dengan embusan angin sore dan malam yang sejuk.',
        en: 'Relaxed open-air seating cooled by the evening breeze off Danau Sunter.',
      },
      insiderTip: {
        id: 'Sambil menunggu mie dimasak, pesanlah Es Kopi Susu Saring dan roti panggang srikaya terlebih dahulu.',
        en: 'Order a glass of iced sock-filtered milk coffee while waiting for your noodles to come off the charcoal wok.',
      },
      author: 'Raka Wijaya',
      authorRole: {
        id: 'Kontributor Komunitas',
        en: 'Community Contributor',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Mie Hokkien Arang Spesial Udang & Ayam',
        priceIdr: 'Rp 45.000',
        description: {
          id: 'Mie kuning tebal dimasak dalam kaldu udang, kecap hitam, telur, dan kucai segar.',
          en: 'Thick yellow noodles simmered in prawn-shell broth, dark soy, egg ribbons, and garlic chives.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
        isPopular: true,
      },
      {
        name: 'Es Kopi Susu Saring Tradisional',
        priceIdr: 'Rp 22.000',
        description: {
          id: 'Racikan kopi Robusta dan Arabika yang diseduh dengan saringan kain tradisional dan susu kental manis.',
          en: 'Traditional cloth-filtered coffee poured over chilled sweetened milk.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
        isPopular: true,
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 11.30 – 23.00 WIB',
      en: 'Daily • 11:30 AM – 11:00 PM',
    },
    address: 'Jl. Danau Sunter Utara Blok G7 No. 19, Sunter Agung, Jakarta',
    nearbyLandmark: {
      id: 'Seberang area Taman Danau Sunter',
      en: 'Across from Danau Sunter Park',
    },
    vibeTags: [
      { id: 'Masak Arang', en: 'Charcoal Wok' },
      { id: 'Harga Bersahabat', en: 'Pocket Friendly' },
      { id: 'Favorit Warga', en: 'Local Gem' },
    ],
  },
  {
    id: 'rest-3',
    name: 'Kemala Roastery & Sourdough Sunter',
    tagline: {
      id: 'Ruang ngopi nyaman dengan biji kopi Nusantara pilihan dan roti sourdough hangat setiap hari.',
      en: 'Cozy coffee roastery serving specialty Indonesian beans and warm stone-baked sourdough daily.',
    },
    neighborhood: 'Sunter',
    subArea: 'Jl. Sunter Indah Raya, Sunter',
    cuisine: 'Kopitiam & Roastery',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 45.000 – Rp 95.000',
    minPriceIdr: 45000,
    rating: 4.9,
    isVerified: true,
    isSponsored: true,
    isFeatured: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Interior hangat bermandikan cahaya matahari pagi dengan meja kayu panjang yang nyaman.',
          en: 'Sunlit dining room crafted with warm teak tables ideal for reading or discussions.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Roti sourdough fermentasi 48 jam yang baru dipanggang setiap pagi.',
          en: '48-hour fermented country sourdough loaves fresh from the deck oven.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Sajian kopi manual brew dari biji pilihan Flores Bajawa dan Aceh Gayo.',
          en: 'Single-origin Flores Bajawa and Aceh Gayo pour-over coffee.',
        },
      },
    ],
    editorialSummary: {
      id: 'Berada di kawasan tenang Sunter Indah, Kemala memadukan suasana ruang yang cerah dan tenang dengan kurasi biji kopi lokal terbaik serta pastry berlapis mentega yang dipanggang segar.',
      en: 'Located in quiet Sunter Indah, Kemala pairs sunlit design with Indonesian specialty coffee and flaky palm-sugar pastries.',
    },
    editorialReview: {
      verdict: {
        id: 'Kemala unggul berkat konsistensi rasa: ekstraksi espresso yang seimbang dan lapisan pastry Kouign-Amann gula aren yang renyah berkaramel.',
        en: 'Kemala stands out for technical craft: balanced espresso extraction and palm-sugar Kouign-Amann with caramelized flaky layers.',
      },
      atmosphere: {
        id: 'Ruang berlangit-langit tinggi dengan tanaman hijau segar, koneksi internet cepat, dan aroma roti panggang hangat.',
        en: 'High sunlit ceilings, lush indoor planters, fast Wi-Fi, and the aroma of fresh baking.',
      },
      insiderTip: {
        id: 'Pesan paket sarapan pukul 08.00 – 11.00 pagi untuk mendapatkan harga khusus kopi susu gula aren dan croissant.',
        en: 'Order the morning set between 8:00 AM and 11:00 AM for a special pairing of palm-sugar latte and butter croissant.',
      },
      author: 'Dimas Pramudya',
      authorRole: {
        id: 'Kritikus Kopi & Gaya Hidup',
        en: 'Coffee & Dining Critic',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Gula Aren Kouign-Amann & Sea Salt Butter',
        priceIdr: 'Rp 38.000',
        description: {
          id: 'Pastry renyah berlapis mentega dengan karamel gula aren organik dan garam laut Bali.',
          en: 'Caramelized laminated pastry infused with organic palm sugar and Bali sea salt.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Smoked Beef Sourdough Toast',
        priceIdr: 'Rp 68.000',
        description: {
          id: 'Roti sourdough panggang dengan irisan daging sapi asap, keju leleh, dan telur orak-arik lembut.',
          en: 'Toasted country sourdough topped with smoked beef brisket, melted cheese, and soft scrambled eggs.',
        },
        halalStatus: 'Halal',
      },
      {
        name: 'Es Kopi Susu Gula Aren Kemala',
        priceIdr: 'Rp 32.000',
        description: {
          id: 'Double ristretto biji kopi Gayo berpadu susu segar dingin dan gula aren organik.',
          en: 'Double ristretto of Aceh Gayo espresso over chilled fresh milk and organic palm sugar.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 07.00 – 22.00 WIB',
      en: 'Daily • 7:00 AM – 10:00 PM',
    },
    address: 'Jl. Sunter Indah Raya Blok KA1 No. 12, Sunter, Jakarta',
    nearbyLandmark: {
      id: 'Dekat kawasan kuliner Sunter Indah & Danau Sunter',
      en: 'Near Sunter Indah Culinary Corridor',
    },
    vibeTags: [
      { id: 'Nyaman Belajar & Kerja', en: 'Study & Work Friendly' },
      { id: 'Roastery Pilihan', en: 'Specialty Roastery' },
      { id: 'Roti Sourdough Segar', en: 'Fresh Sourdough' },
    ],
  },
  {
    id: 'rest-4',
    name: 'Soto Betawi & Ketan Susu Garuda Kemayoran',
    tagline: {
      id: 'Soto Betawi kuah susu minyak samin gurih dan ketan susu hangat legendaris di jantung Kemayoran.',
      en: 'Rich ghee-scented milk Soto Betawi and warm sweet milk sticky rice in the heart of Kemayoran.',
    },
    neighborhood: 'Kemayoran',
    subArea: 'Jl. Garuda, Kemayoran',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 35.000 – Rp 65.000',
    minPriceIdr: 35000,
    rating: 4.8,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Soto Betawi daging sapi empuk dengan kuah susu rempah hangat dan emping renyah.',
          en: 'Tender beef Soto Betawi in spiced milk broth topped with crispy melinjo crackers.',
        },
      },
    ],
    editorialSummary: {
      id: 'Kemayoran dikenal dengan tradisi kuliner Betawi yang kuat. Rumah makan ini memadukan Soto Betawi kuah susu segar tanpa santan berlebih dengan sajian ketan susu kelapa parut hangat.',
      en: 'Kemayoran is celebrated for its Betawi culinary roots. This spot pairs rich milk-broth Soto Betawi with warm coconut-topped sweet sticky rice.',
    },
    editorialReview: {
      verdict: {
        id: 'Kuah sotonya kaya rempah cengkeh, kayu manis, dan pala namun tetap ringan di tenggorokan berkat penggunaan susu sapi segar.',
        en: 'The broth is deeply aromatic with clove, cinnamon, and nutmeg while remaining light and velvety.',
      },
      atmosphere: {
        id: 'Kedai makan yang bersih dan ramah keluarga di sepanjang Jalan Garuda Kemayoran.',
        en: 'A clean, welcoming family eatery along Jalan Garuda in Kemayoran.',
      },
      insiderTip: {
        id: 'Mintalah potongan daging sengkel dan paru goreng garing secara terpisah agar teksturnya tetap renyah.',
        en: 'Ask for the crispy fried beef lung on a separate side plate so it stays crunchy until the last bite.',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Soto Betawi Daging Sengkel Kuah Susu',
        priceIdr: 'Rp 45.000',
        description: {
          id: 'Potongan daging sengkel sapi empuk dalam kuah susu rempah dan minyak samin harum.',
          en: 'Tender beef shank simmered in spiced fresh milk broth with aromatic ghee.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Ketan Susu Kelapa Parut & Pisang Raja',
        priceIdr: 'Rp 18.000',
        description: {
          id: 'Ketan putih pulen kukus ditaburi kelapa parut gurih, susu kental manis, dan pisang goreng hangat.',
          en: 'Steamed glutinous rice topped with savory grated coconut, sweet condensed milk, and fried banana.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 09.00 – 23.00 WIB',
      en: 'Daily • 9:00 AM – 11:00 PM',
    },
    address: 'Jl. Garuda No. 78, Kemayoran, Jakarta',
    nearbyLandmark: {
      id: 'Sekitar 400 meter dari Stasiun Kemayoran & Jl. Benyamin Sueb',
      en: '400 meters from Kemayoran Station & Jl. Benyamin Sueb',
    },
    vibeTags: [
      { id: 'Kuliner Khas Betawi', en: 'Betawi Heritage' },
      { id: 'Buka Hingga Malam', en: 'Open Late' },
      { id: 'Ramah Keluarga', en: 'Family Friendly' },
    ],
  },
  {
    id: 'rest-5',
    name: 'Kwetiau Sapi & Bakmi Arang Mangga Besar 78',
    tagline: {
      id: 'Kwetiau siram sapi urat dan bakmi goreng wajan arang legendaris di koridor kuliner malam Mangga Besar.',
      en: 'Wok-seared beef tendon flat noodles and charcoal-fried noodles along Mangga Besar’s night food street.',
    },
    neighborhood: 'Mangga Besar',
    subArea: 'Jl. Raya Mangga Besar, Taman Sari',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 55.000 – Rp 95.000',
    minPriceIdr: 55000,
    rating: 4.8,
    isVerified: true,
    halalStatus: 'Non-Halal',
    heroImage:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Kwetiau goreng wajan panas dengan aroma asap wok hei yang kuat.',
          en: 'High-flame wok-fried flat rice noodles with unmistakable smoky wok hei.',
        },
      },
    ],
    editorialSummary: {
      id: 'Mangga Besar tidak pernah kehabisan pesona saat malam tiba. Kedai 78 terkenal dengan teknik memasak api besar yang menghasilkan kwetiau beras beraroma panggang wajan yang khas.',
      en: 'Mangga Besar comes alive after dark, and Stall 78 is famed for high-flame wok mastery that imparts deep smoky flavor into delicate rice noodles.',
    },
    editorialReview: {
      verdict: {
        id: 'Kwetiau Siram Sapi dan Bakmi Spesialnya menyajikan perpaduan tekstur lembut dan gurih yang menjadi tolok ukur kuliner malam Mangga Besar.',
        en: 'Their beef gravy flat noodles and house special noodles set the benchmark for late-night Mangga Besar dining.',
      },
      atmosphere: {
        id: 'Ramai, hangat, dan penuh energi kuliner malam khas Jalan Raya Mangga Besar.',
        en: 'Bustling, energetic late-night shophouse dining along Jalan Raya Mangga Besar.',
      },
      insiderTip: {
        id: 'Tambahkan acar cabai rawit hijau dan bawang putih cincang untuk menyeimbangkan gurihnya kuah kental.',
        en: 'Add pickled green bird’s-eye chilies and minced garlic to balance the rich savory gravy.',
      },
      author: 'Dimas Pramudya',
      authorRole: {
        id: 'Kritikus Kopi & Gaya Hidup',
        en: 'Coffee & Dining Critic',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Kwetiau Goreng Spesial Komplit',
        priceIdr: 'Rp 62.000',
        description: {
          id: 'Kwetiau beras tipis digoreng api besar dengan telur bebek, udang, dan irisan daging panggang.',
          en: 'Thin flat rice noodles wok-fried over high heat with duck egg, prawns, and roast meat.',
        },
        halalStatus: 'Non-Halal',
        isPopular: true,
      },
      {
        name: 'Kwetiau Siram Sapi Urat',
        priceIdr: 'Rp 58.000',
        description: {
          id: 'Kwetiau hangat disiram kuah kental daging sapi iris, urat empuk, dan sayuran caisim.',
          en: 'Flat rice noodles drenched in thick savory beef and tender tendon gravy with greens.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 17.00 – 01.30 WIB',
      en: 'Daily • 5:00 PM – 1:30 AM',
    },
    address: 'Jl. Raya Mangga Besar No. 78B, Mangga Besar, Jakarta',
    nearbyLandmark: {
      id: 'Dekat persimpangan Lokasari & Jl. Kartini',
      en: 'Near Lokasari intersection & Jl. Kartini',
    },
    vibeTags: [
      { id: 'Kuliner Malam Legendaris', en: 'Late-Night Legend' },
      { id: 'Aroma Wok Hei', en: 'Wok Hei Mastery' },
    ],
  },
  {
    id: 'rest-6',
    name: 'Nasi Kapau & Kue Tradisional Sabana Senen',
    tagline: {
      id: 'Hidangan Nasi Kapau asli Bukittinggi dengan gulai tambusu, dendeng batokok, dan aneka kue pasar tradisional.',
      en: 'Authentic Bukittinggi Nasi Kapau featuring gulai tambusu, smoky dendeng batokok, and traditional market pastries.',
    },
    neighborhood: 'Senen',
    subArea: 'Jl. Kramat Raya, Senen',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 32.000 – Rp 60.000',
    minPriceIdr: 32000,
    rating: 4.9,
    isVerified: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Susunan panci bertingkat khas Nasi Kapau dengan kuah gulai kuning yang kaya rempah.',
          en: 'Tiered brass pots of authentic Nasi Kapau brimming with fragrant turmeric and coconut curries.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Aneka jajanan pasar dan es tebak segar khas Sumatera Barat.',
          en: 'Traditional Minang market sweets and refreshing iced dessert.',
        },
      },
    ],
    editorialSummary: {
      id: 'Kawasan Senen dan Kramat Raya adalah rumah kedua bagi pecinta Nasi Kapau di Jakarta. Sabana menghadirkan racikan bumbu Minang asli dengan centong tempurung kelapa panjang yang ikonik.',
      en: 'Senen and Kramat Raya are famous across Jakarta for authentic Nasi Kapau. Sabana serves traditional Minang curries ladled from tiered pots using long coconut-shell spoons.',
    },
    editorialReview: {
      verdict: {
        id: 'Gulai Tambusu (usus sapi isi tahu dan telur) serta Ayam Bakar Bumbunya memiliki kekayaan rempah yang sulit ditandingi.',
        en: 'Their Gulai Tambusu and spiced charcoal-grilled chicken deliver extraordinary Minang spice depth.',
      },
      atmosphere: {
        id: 'Hidangan disajikan hangat dari susunan panci bertingkat dalam ruang makan ber-AC yang bersih dan terang.',
        en: 'Dishes are ladled warm from tiered display pots inside a bright, air-conditioned dining hall.',
      },
      insiderTip: {
        id: 'Jangan lupa meminta siraman kuah gulai cubadak (nangka muda) dan sambal lado merah tumbuk.',
        en: 'Always ask for a generous ladle of young jackfruit curry gravy and coarse-ground red chili sambal.',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Edisi Kurasi Utama',
        en: 'Featured Curation Issue',
      },
    },
    signatureDishes: [
      {
        name: 'Nasi Kapau Gulai Tambusu & Dendeng Batokok',
        priceIdr: 'Rp 48.000',
        description: {
          id: 'Nasi hangat dengan gulai tambusu lembut, dendeng sapi bakar cabai hijau, dan sayur nangka.',
          en: 'Steamed rice served with egg-stuffed tambusu curry, smoky pounded beef dendeng, and jackfruit.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Bubur Kampiun & Kue Tradisional Senen',
        priceIdr: 'Rp 22.000',
        description: {
          id: 'Perpaduan bubur sumsum, ketan hitam, kolak pisang, dan srikaya manis.',
          en: 'Warm Minang sweet porridge medley with coconut marrow, black glutinous rice, and banana compote.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 08.00 – 23.00 WIB',
      en: 'Daily • 8:00 AM – 11:00 PM',
    },
    address: 'Jl. Kramat Raya No. 15, Senen, Jakarta',
    nearbyLandmark: {
      id: 'Sekitar 250 meter dari Pasar Senen',
      en: '250 meters from Pasar Senen',
    },
    vibeTags: [
      { id: 'Nasi Kapau Asli', en: 'Authentic Nasi Kapau' },
      { id: 'Kue Tradisional', en: 'Traditional Pastries' },
      { id: 'Porsi Mengenyangkan', en: 'Hearty Portions' },
    ],
  },
  {
    id: 'rest-7',
    name: 'Seafood Ayu Boulevard Barat',
    tagline: {
      id: 'Hidden gem warung tenda boga bahari malam hari dengan ikan kuwe bakar kecap dan cumi goreng tepung renyah.',
      en: 'Legendary late-night open-air seafood stall famous for charcoal-grilled trevally and crispy calamari.',
    },
    neighborhood: 'Kelapa Gading',
    subArea: 'Jl. Boulevard Barat Raya, Kelapa Gading Barat',
    cuisine: 'Seafood Pesisir Segar',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 65.000 – Rp 140.000',
    minPriceIdr: 65000,
    rating: 4.9,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Ikan Kuwe Bakar arang dengan olesan bumbu kecap rempah dan sambal kecap cabai rawit.',
          en: 'Charcoal-grilled trevally glazed with sweet spiced soy and bird’s-eye chili dip.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Udang saus Padang dan kepiting telur hangat yang selalu ramai diburu saat makan malam.',
          en: 'Padang-style chili prawns and roe crab served piping hot for dinner crowds.',
        },
      },
    ],
    editorialSummary: {
      id: 'Berada di lahan terbuka antara Gedung Gading Marina dan NJIS di jalur penghubung Kelapa Gading–Sunter, Seafood Ayu selalu dipadati pecinta boga bahari setiap sore hingga tengah malam berkat kesegaran lautannya.',
      en: 'Tucked in an open lot between Gading Marina and NJIS near the Sunter–Kelapa Gading border, Seafood Ayu draws nightly crowds for its ultra-fresh catch and smoky grill.',
    },
    editorialReview: {
      verdict: {
        id: 'Salah satu seafood tenda terbaik di Jakarta Utara: daging ikan kuwenya manis alami, cuminya empuk tidak alot, dan cah kangkung terasinya wangi wajan panas.',
        en: 'One of North Jakarta’s finest open-air seafood gems: sweet grilled fish, tender calamari, and wok-charred morning glory.',
      },
      atmosphere: {
        id: 'Suasana tenda malam terbuka yang hidup dan semarak dengan kepulan asap bakaran ikan.',
        en: 'Lively open-air evening stall atmosphere perfumed with charcoal smoke.',
      },
      insiderTip: {
        id: 'Datanglah sekitar pukul 17.00 – 18.00 WIB agar langsung mendapat meja dan pilihan ukuran ikan kuwe yang paling besar.',
        en: 'Arrive between 5:00 PM and 6:00 PM to secure a table without waiting and pick the largest fish.',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Ikan Kuwe Bakar Kecap Rempah',
        priceIdr: 'Rp 95.000',
        description: {
          id: 'Ikan kuwe segar dibakar di atas arang batok dengan bumbu kecap manis pedas meresap.',
          en: 'Fresh trevally grilled over coconut-shell charcoal with sweet spiced soy glaze.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Cumi Goreng Tepung Crispy & Udang Saus Padang',
        priceIdr: 'Rp 68.000',
        description: {
          id: 'Cumi segar berbalut tepung renyah keemasan serta udang laut dalam kuah saus Padang pedas gurih.',
          en: 'Golden crispy battered squid rings alongside sea prawns in spicy Padang sauce.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Cah Kangkung Terasi Belacan',
        priceIdr: 'Rp 28.000',
        description: {
          id: 'Kangkung muda ditumis cepat di atas api besar dengan bawang putih dan terasi udang pilihan.',
          en: 'Young water spinach flash-stir-fried over high flame with garlic and shrimp paste.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 17.00 – 24.00 WIB',
      en: 'Daily • 5:00 PM – 12:00 AM',
    },
    address:
      'Jl. Boulevard Barat Raya No. 15, RT.18/RW.3, Kelapa Gading Barat, Jakarta Utara',
    nearbyLandmark: {
      id: 'Di antara Gedung Gading Marina & sekolah NJIS (perbatasan Sunter)',
      en: 'Between Gading Marina Building & NJIS near Sunter border',
    },
    vibeTags: [
      { id: 'Hidden Gem Malam', en: 'Night Hidden Gem' },
      { id: 'Seafood Segar', en: 'Fresh Catch' },
      { id: 'Ramah di Kantong', en: 'Great Value' },
    ],
  },
  {
    id: 'rest-8',
    name: 'Maison Weiner Cake Shop 1936',
    tagline: {
      id: 'Toko roti dan kue klasik tertua di Jakarta sejak 1936 dengan resep warisan Belanda tanpa bahan pengawet.',
      en: 'Jakarta’s oldest heritage bakery operating since 1936, crafting Dutch-Indie pastries and sourdough.',
    },
    neighborhood: 'Senen',
    subArea: 'Jl. Kramat II, Kwitang, Senen',
    cuisine: 'Pastry & Hidangan Penutup',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 35.000 – Rp 85.000',
    minPriceIdr: 35000,
    rating: 4.9,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Deretan roti sourdough dan kue klasik Belanda yang dipanggang segar sejak pagi di Kwitang.',
          en: 'Freshly baked heritage sourdough loaves and classic Dutch-Indie cakes in Kwitang.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Ontbijtkoek rempah kayu manis, Kue Soes fla vanila, dan Poffertjes tabur gula halus.',
          en: 'Spiced Ontbijtkoek, vanilla cream puffs, and powdered Dutch Poffertjes.',
        },
      },
    ],
    editorialSummary: {
      id: 'Didirikan oleh Nyonya Gem (Lee Liang Mey) pada tahun 1936 dan kini dikelola generasi ketiga di Jalan Kramat II Kwitang, Maison Weiner menjaga keaslian bangunan kolonial serta resep pastry klasik tempo dulu.',
      en: 'Founded by Madam Gem in 1936 on Jalan Kramat II Kwitang and now run by the third generation, Maison Weiner preserves Jakarta’s pre-war bakery heritage.',
    },
    editorialReview: {
      verdict: {
        id: 'Sepotong sejarah hidup kuliner Jakarta. Ontbijtkoek-nya harum rempah kayu manis dan cengkeh, sementara kue soes klasiknya lembut lumer di mulut.',
        en: 'A living slice of Jakarta culinary history. Their spiced Ontbijtkoek and classic cream puffs taste timeless.',
      },
      atmosphere: {
        id: 'Bangunan heritage tahun 1930-an dengan taplak meja kotak-kotak vintage dan etalase kaca klasik yang hangat.',
        en: 'Charming 1930s shopfront with vintage checkered tablecloths and classic glass pastry counters.',
      },
      insiderTip: {
        id: 'Kunjungi pada pagi hari (Senin–Sabtu) saat roti sourdough dan Kue Soes baru keluar dari oven pemanggang.',
        en: 'Visit in the morning Monday through Saturday when the sourdough loaves and cream puffs come warm from the oven.',
      },
      author: 'Dimas Pramudya',
      authorRole: {
        id: 'Kritikus Kopi & Gaya Hidup',
        en: 'Coffee & Dining Critic',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Ontbijtkoek Rempah Klasik Belanda',
        priceIdr: 'Rp 55.000',
        description: {
          id: 'Kue rempah tradisional Belanda bertekstur lembut dengan aroma kayu manis, pala, dan gula aren.',
          en: 'Traditional Dutch spiced cake infused with cinnamon, nutmeg, clove, and palm sugar.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Kue Soes Klasik & Poffertjes Belanda',
        priceIdr: 'Rp 32.000',
        description: {
          id: 'Kue sus lembut dengan isian fla vanila melimpah serta panekuk mini Belanda bertabur gula halus.',
          en: 'Choux pastry filled with silky vanilla custard alongside powdered Dutch mini pancakes.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Roti Sourdough Ragi Alami 1936',
        priceIdr: 'Rp 48.000',
        description: {
          id: 'Roti sehat fermentasi ragi alami tanpa bahan pengawet dengan kulit renyah dan bagian dalam lembut.',
          en: 'Naturally leavened preservative-free sourdough bread with crisp crust and tender crumb.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Senin – Sabtu • 07.00 – 18.00 WIB (Minggu Tutup)',
      en: 'Mon – Sat • 7:00 AM – 6:00 PM (Closed Sunday)',
    },
    address:
      'Jl. Kramat II No. 2, RT.6/RW.7, Kwitang, Kec. Senen, Jakarta Pusat 10420',
    nearbyLandmark: {
      id: 'Dekat kawasan buku Kwitang & Simpang Lima Senen',
      en: 'Near Kwitang Book Market & Simpang Lima Senen',
    },
    vibeTags: [
      { id: 'Berdiri Sejak 1936', en: 'Est. 1936' },
      { id: 'Toko Roti Tertua', en: 'Oldest Bakery' },
      { id: 'Nostalgia Tempo Dulu', en: 'Vintage Nostalgia' },
    ],
  },
  {
    id: 'rest-9',
    name: 'Ippeke Komachi Japanese Dining',
    tagline: {
      id: 'Hidden gem restoran Jepang autentik di Kelapa Gading dengan Tori Karaage legendaris dan Yakiniku Set.',
      en: 'Beloved one-of-a-kind authentic Japanese dining gem in Kelapa Gading famed for Tori Karaage and Yakiniku.',
    },
    neighborhood: 'Kelapa Gading',
    subArea: 'Jl. Boulevard Kelapa Gading, MKG 3',
    cuisine: 'Jepang & Grill Modern',
    priceTier: '$$$',
    estimatedPriceIdr: 'Rp 95.000 – Rp 195.000',
    minPriceIdr: 95000,
    rating: 4.9,
    isVerified: true,
    isFeatured: true,
    halalStatus: 'Belum Ada Sertifikasi',
    heroImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Set menu autentik Jepang lengkap dengan Tori Karaage renyah, nasi Jepang pulen, dan sup miso.',
          en: 'Authentic Japanese teishoku set featuring juicy Tori Karaage, steamed rice, and miso soup.',
        },
      },
      {
        url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Sajian Yakiniku dan Beef Hamburger Steak di ruang makan bergaya izakaya Jepang.',
          en: 'Sizzling Yakiniku and Japanese Beef Hamburger Steak in a classic wood-paneled dining room.',
        },
      },
    ],
    editorialSummary: {
      id: 'Terkenal karena tidak membuka cabang di tempat lain selama puluhan tahun, Ippeke Komachi menjadi destinasi wajib pecinta masakan rumahan Jepang autentik di Kelapa Gading.',
      en: 'Famous for never opening another branch for decades, Ippeke Komachi is a cherished Kelapa Gading institution for authentic Japanese comfort food.',
    },
    editorialReview: {
      verdict: {
        id: 'Tori Karaage dan Beef Hamburger Steak-nya konsisten luar biasa: garing di luar namun sangat juicy di dalam dengan saus khas Jepang.',
        en: 'Their Tori Karaage and Beef Hamburger Steak are remarkably consistent: crisp outside, intensely juicy inside.',
      },
      atmosphere: {
        id: 'Interior kayu hangat bergaya kedai makan tradisional Tokyo dengan bilik tatami yang tenang.',
        en: 'Warm wood-lined interior evoking a classic Tokyo neighborhood eatery with cozy booth seating.',
      },
      insiderTip: {
        id: 'Pesan paket Set Menu saat jam makan siang untuk mendapatkan Chawanmushi lembut dan hidangan penutup buah segar.',
        en: 'Order the complete lunch Teishoku set which includes silky steamed Chawanmushi egg custard.',
      },
      author: 'Raka Wijaya',
      authorRole: {
        id: 'Kontributor Komunitas',
        en: 'Community Contributor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Tori Karaage Teishoku Set',
        priceIdr: 'Rp 98.000',
        description: {
          id: 'Ayam goreng tepung bumbu jahe-bawang khas Jepang yang super juicy, disajikan dengan salad, nasi, dan miso soup.',
          en: 'Signature ginger-soy marinated Japanese fried chicken served with salad, rice, and miso soup.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
        isPopular: true,
      },
      {
        name: 'Japanese Beef Hamburger Steak & Yakiniku Set',
        priceIdr: 'Rp 145.000',
        description: {
          id: 'Steak daging sapi cincang Jepang di atas hotplate dengan saus demi-glace gurih dan irisan beef yakiniku.',
          en: 'Sizzling Japanese-style minced beef steak in rich demi-glace paired with grilled yakiniku beef.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
        isPopular: true,
      },
      {
        name: 'Chawanmushi Telur Kukus Kaldu Dashi',
        priceIdr: 'Rp 38.000',
        description: {
          id: 'Puding telur kukus gurih bertekstur selembut sutra dengan kaldu dashi, jamur shiitake, dan udang.',
          en: 'Silky savory steamed egg custard infused with dashi broth, shiitake mushroom, and shrimp.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 11.00 – 21.30 WIB',
      en: 'Daily • 11:00 AM – 9:30 PM',
    },
    address:
      'Mal Kelapa Gading 3, Lantai Dasar, Jl. Boulevard Kelapa Gading, Jakarta Utara',
    nearbyLandmark: {
      id: 'Area Gourmet Walk Lantai Dasar Mal Kelapa Gading 3',
      en: 'Ground Floor Gourmet Walk at Mal Kelapa Gading 3',
    },
    vibeTags: [
      { id: 'Tidak Buka Cabang', en: 'Single-Outlet Gem' },
      { id: 'Jepang Autentik', en: 'Authentic Japanese' },
      { id: 'Karaage Legendaris', en: 'Legendary Karaage' },
    ],
  },
  {
    id: 'rest-10',
    name: 'Pallubasa Serigala Boulevard',
    tagline: {
      id: 'Sajian Pallubasa khas Makassar dengan kuah kaldu sapi kental kelapa parut sangrai dan kuning telur ayam kampung.',
      en: 'Authentic Makassar Pallubasa beef stew enriched with toasted grated coconut and free-range egg yolk.',
    },
    neighborhood: 'Kelapa Gading',
    subArea: 'Jl. Boulevard Raya Blok I4, Kelapa Gading',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 48.000 – Rp 85.000',
    minPriceIdr: 48000,
    rating: 4.8,
    isVerified: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Semangkuk Pallubasa hangat dengan taburan kelapa parut sangrai dan telur ayam kampung setengah matang (alas).',
          en: 'Steaming bowl of Makassar Pallubasa topped with toasted coconut serundeng and raw egg yolk.',
        },
      },
    ],
    editorialSummary: {
      id: 'Membawa cita rasa asli Jalan Serigala Makassar ke Boulevard Kelapa Gading, hidangan ini berbeda dari Coto Makassar karena kuah rempahnya diperkaya kelapa parut sangrai yang gurih.',
      en: 'Bringing the famed flavors of Makassar’s Jalan Serigala to Kelapa Gading, Pallubasa is distinguished by its rich broth thickened with toasted coconut.',
    },
    editorialReview: {
      verdict: {
        id: 'Saat kuning telur ayam kampung diaduk ke dalam kuah panas berempah kelapa sangrai, teksturnya menjadi sangat creamy dan kaya rasa.',
        en: 'Stirring a free-range egg yolk into the piping-hot toasted-coconut beef broth creates an unforgettable velvety depth.',
      },
      atmosphere: {
        id: 'Ruko bersih dua lantai di Boulevard Raya yang nyaman untuk makan siang maupun makan malam keluarga.',
        en: 'Clean two-story shophouse along Boulevard Raya ideal for hearty lunches and dinners.',
      },
      insiderTip: {
        id: 'Pesan Pallubasa pakai "Alas" (tambahan kuning telur ayam kampung mentah yang langsung matang terkena kuah mendidih).',
        en: 'Always order your bowl "pakai Alas" (with a fresh free-range egg yolk dropped into the boiling broth).',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Pallubasa Daging Sapi & Pipi Spesial + Alas',
        priceIdr: 'Rp 52.000',
        description: {
          id: 'Potongan daging sapi dan pipi empuk dalam kuah rempah kelapa sangrai dengan kuning telur ayam kampung.',
          en: 'Tender braised beef and cheek in toasted-coconut spice broth crowned with free-range egg yolk.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Es Pisang Ijo & Barongko Khas Makassar',
        priceIdr: 'Rp 32.000',
        description: {
          id: 'Pisang raja balut adonan pandan hijau dengan bubur sumsum lembut dan sirup merah DHT asli Makassar.',
          en: 'Pandan-wrapped plantain served over creamy rice-flour custard and authentic Makassar red syrup.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 09.30 – 22.00 WIB',
      en: 'Daily • 9:30 AM – 10:00 PM',
    },
    address:
      'Jl. Boulevard Raya Blok I4 No. 6, Kelapa Gading Timur, Jakarta Utara',
    nearbyLandmark: {
      id: 'Deretan ruko kuliner Jl. Boulevard Raya Kelapa Gading',
      en: 'Along the main Boulevard Raya shophouse row in Kelapa Gading',
    },
    vibeTags: [
      { id: 'Khas Makassar Asli', en: 'Authentic Makassar' },
      { id: 'Kuah Kelapa Sangrai', en: 'Toasted Coconut Broth' },
    ],
  },
  {
    id: 'rest-11',
    name: 'Shantung 77 Kuotie & Mie Mangga Besar',
    tagline: {
      id: 'Hidden gem kuotie panggang garing dan sekba/mie tradisional gaya Shandong di Jalan Mangga Besar I.',
      en: 'Crispy pan-seared Shandong-style potstickers (kuotie) and traditional noodles on Jalan Mangga Besar I.',
    },
    neighborhood: 'Mangga Besar',
    subArea: 'Jl. Mangga Besar I, Taman Sari',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 45.000 – Rp 80.000',
    minPriceIdr: 45000,
    rating: 4.8,
    isVerified: true,
    halalStatus: 'Non-Halal',
    heroImage:
      'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Sepiring Kuotie Panggang keemasan yang garing di bagian bawah dan lembut berkaldu di bagian atas.',
          en: 'Golden pan-fried kuotie dumplings crisp on the bottom and juicy inside.',
        },
      },
    ],
    editorialSummary: {
      id: 'Tersembunyi di Jalan Mangga Besar I No. 20, kedai sederhana ini terkenal dengan kuotie buatan tangan yang dipanggang di atas wajan datar hingga kulit bawahnya renyah kecokelatan.',
      en: 'Tucked along Jalan Mangga Besar I No. 20, this unassuming spot is famous for handmade Shandong potstickers seared on flat iron griddles.',
    },
    editorialReview: {
      verdict: {
        id: 'Kulit kuotienya tipis lentur dengan isian daging cincang dan kucai yang melimpah, makin sempurna saat dicocol saus bawang putih cabai dan minyak wijen.',
        en: 'Delicate wrappers packed with savory minced meat and garlic chives, best dipped in chili-garlic vinegar and sesame oil.',
      },
      atmosphere: {
        id: 'Kedai klasik tanpa basa-basi di koridor Jalan Mangga Besar I yang selalu harum aroma panggangan kuotie.',
        en: 'No-frills heritage eatery along Jalan Mangga Besar I filled with the aroma of sizzling dumplings.',
      },
      insiderTip: {
        id: 'Pesan kombinasi Kuotie Panggang (10 pcs) bersama semangkuk Sup Asam Pedas hangat.',
        en: 'Pair an order of 10 pan-seared kuotie with a bowl of piping-hot sour and spicy soup.',
      },
      author: 'Raka Wijaya',
      authorRole: {
        id: 'Kontributor Komunitas',
        en: 'Community Contributor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Kuotie Panggang Spesial Shantung (Isi 10)',
        priceIdr: 'Rp 58.000',
        description: {
          id: 'Sepuluh buah pangsit kuotie panggang garing berisi daging cincang, udang, dan daun kucai segar.',
          en: 'Ten crispy-bottomed pan-fried dumplings stuffed with minced meat, prawn, and fresh garlic chives.',
        },
        halalStatus: 'Non-Halal',
        isPopular: true,
      },
      {
        name: 'Bakmi Jamur & Swekiau Kuah Kaldu',
        priceIdr: 'Rp 48.000',
        description: {
          id: 'Mie telur lembut dengan topping daging cincang jamur dan pangsit rebus swekiau yang padat.',
          en: 'Silky egg noodles topped with braised mushroom mince and plump boiled swekiau dumplings.',
        },
        halalStatus: 'Non-Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 10.00 – 22.00 WIB',
      en: 'Daily • 10:00 AM – 10:00 PM',
    },
    address:
      'Jl. Mangga Besar I No. 20, RT.2/RW.5, Mangga Besar, Kec. Taman Sari, Jakarta Barat',
    nearbyLandmark: {
      id: 'Sekitar 150 meter dari simpang Jl. Raya Mangga Besar & Mangga Besar I',
      en: '150 meters from the Jalan Raya Mangga Besar intersection',
    },
    vibeTags: [
      { id: 'Kuotie Legendaris', en: 'Legendary Potstickers' },
      { id: 'Buatan Tangan', en: 'Handmade Daily' },
    ],
  },
  {
    id: 'rest-12',
    name: 'Bubur Ayam Mangga Besar 1',
    tagline: {
      id: 'Bubur beras kental bergaya Tionghoa klasik dengan irisan ayam rebus kampung, ayam panggang, dan telur pitan.',
      en: 'Velvety Chinese-style rice congee topped with poached free-range chicken, roast poultry, and century egg.',
    },
    neighborhood: 'Mangga Besar',
    subArea: 'Jl. Mangga Besar I No. 46, Taman Sari',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 42.000 – Rp 75.000',
    minPriceIdr: 42000,
    rating: 4.8,
    isVerified: true,
    halalStatus: 'Non-Halal',
    heroImage:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Semangkuk bubur hangat bertekstur halus dengan minyak wijen harum dan cakwe goreng renyah.',
          en: 'Silky slow-cooked congee drizzled with fragrant sesame oil and crispy fried dough sticks.',
        },
      },
    ],
    editorialSummary: {
      id: 'Salah satu institusi kuliner malam dan sarapan paling tua di Jalan Mangga Besar I. Buburnya dimasak berjam-jam dengan kaldu ayam kampung hingga bulir berasnya menyatu lembut.',
      en: 'A longstanding culinary institution on Jalan Mangga Besar I, simmering rice congee for hours in free-range poultry stock until velvety smooth.',
    },
    editorialReview: {
      verdict: {
        id: 'Tanpa tambahan kecap pun buburnya sudah sangat gurih. Potongan ayam rebus pekchamke-nya lembut dan berpadu pas dengan telur pitan.',
        en: 'Naturally savory even without soy sauce; the poached free-range chicken and century egg pairing is classic comfort.',
      },
      atmosphere: {
        id: 'Ruang makan ruko terang yang tak pernah sepi dari sore hingga larut malam.',
        en: 'Brightly lit shophouse dining room bustling from early evening until late night.',
      },
      insiderTip: {
        id: 'Tambahkan seporsi Cakwe Goreng hangat dan Telur Ayam Kampung mentah di dasar mangkuk sebelum disiram bubur panas.',
        en: 'Order a side of crispy fried cakwe and a raw free-range egg cracked into the bottom of the hot congee bowl.',
      },
      author: 'Dimas Pramudya',
      authorRole: {
        id: 'Kritikus Kopi & Gaya Hidup',
        en: 'Coffee & Dining Critic',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Bubur Ayam Spesial Pekchamke & Telur Pitan',
        priceIdr: 'Rp 52.000',
        description: {
          id: 'Bubur kaldu kental dengan irisan ayam kampung rebus minyak wijen, telur pitan, dan daun bawang.',
          en: 'Thick stock-simmered congee topped with sesame-oil poached chicken, century egg, and scallions.',
        },
        halalStatus: 'Belum Ada Sertifikasi',
        isPopular: true,
      },
      {
        name: 'Cakwe Goreng & Ayam Panggang Spesial',
        priceIdr: 'Rp 45.000',
        description: {
          id: 'Potongan ayam panggang berbumbu gurih manis dengan cakwe renyah pendamping bubur.',
          en: 'Savory-sweet roast chicken slices served alongside crispy fried dough sticks.',
        },
        halalStatus: 'Non-Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 16.30 – 24.00 WIB',
      en: 'Daily • 4:30 PM – 12:00 AM',
    },
    address:
      'Jl. Mangga Besar I No. 46, RT.2/RW.5, Mangga Besar, Kec. Taman Sari, Jakarta Barat',
    nearbyLandmark: {
      id: 'Koridor kuliner Jl. Mangga Besar I dekat Stasiun Mangga Besar',
      en: 'Along Jalan Mangga Besar I culinary street near Mangga Besar Station',
    },
    vibeTags: [
      { id: 'Bubur Legendaris', en: 'Legendary Congee' },
      { id: 'Hangat & Nyaman', en: 'Ultimate Comfort Food' },
    ],
  },
  {
    id: 'rest-13',
    name: 'RM Sop Sapi Bu Rum Garuda',
    tagline: {
      id: 'Hidden gem warung sop daging sapi berkuah kaldu bening rempah segar yang berdiri puluhan tahun di Jalan Garuda Kemayoran.',
      en: 'Decades-old Kemayoran hidden gem serving crystal-clear spiced beef soup along Jalan Garuda.',
    },
    neighborhood: 'Kemayoran',
    subArea: 'Jl. Garuda No. 37, Kemayoran',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 32.000 – Rp 55.000',
    minPriceIdr: 32000,
    rating: 4.8,
    isVerified: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Sop daging sapi kuah kaldu bening dengan taburan bawang goreng, seledri, dan perasan jeruk nipis.',
          en: 'Clear beef bone broth soup generously filled with tender beef chunks, fried shallots, and lime.',
        },
      },
    ],
    editorialSummary: {
      id: 'Di tengah ramainya Jalan Garuda Kemayoran, RM Sop Sapi Bu Rum menjadi langganan warga lokal selama puluhan tahun berkat kuah sop sapinya yang bening, segar, tidak berlemak berlebihan, dan porsi dagingnya yang royal.',
      en: 'Along bustling Jalan Garuda in Kemayoran, RM Sop Sapi Bu Rum has been a local secret for decades thanks to its clean, deeply flavorful beef bone broth and generous meat portions.',
    },
    editorialReview: {
      verdict: {
        id: 'Hidangan rumahan yang jujur dan menghangatkan perut. Daging sapinya empuk meresap kaldu pala dan merica, sangat pas disantap bersama sambal rawit rebus dan perkedel kentang.',
        en: 'Honest, heartwarming comfort food. Tender beef simmered with nutmeg and white pepper, best enjoyed with boiled chili sambal and potato perkedel.',
      },
      atmosphere: {
        id: 'Warung makan sederhana yang bersih dan selalu ramai saat jam makan siang di Jalan Garuda.',
        en: 'Simple, spotless neighborhood eatery packed with regulars during lunch hours on Jalan Garuda.',
      },
      insiderTip: {
        id: 'Jangan lewatkan tambahan Perkedel Kentang Daging dan Tempe Goreng Tepung hangat sebagai pendamping nasi sop.',
        en: 'Add warm beef-potato perkedel fritters and crispy battered tempeh alongside your soup and rice.',
      },
      author: 'Nadia Kusuma',
      authorRole: {
        id: 'Editor Kuliner Senior',
        en: 'Senior Culinary Editor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Sop Daging Sapi & Iga Kuah Bening Spesial',
        priceIdr: 'Rp 42.000',
        description: {
          id: 'Potongan daging sandung lamur dan iga sapi empuk dalam kuah kaldu bening wortel, kentang, dan tomat segar.',
          en: 'Tender beef brisket and short ribs in clear spiced bone broth with carrots, potatoes, and fresh tomatoes.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Perkedel Kentang Daging & Ayam Goreng Lengkuas',
        priceIdr: 'Rp 28.000',
        description: {
          id: 'Perkedel kentang tumbuk lembut serta ayam goreng kremes serundeng lengkuas gurih.',
          en: 'Hand-mashed potato fritters and crispy fried chicken topped with savory galangal flakes.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 08.30 – 20.30 WIB',
      en: 'Daily • 8:30 AM – 8:30 PM',
    },
    address:
      'Jl. Garuda No. 37, RT.10/RW.4, Gunung Sahari Selatan, Kec. Kemayoran, Jakarta Pusat',
    nearbyLandmark: {
      id: 'Koridor utama Jl. Garuda dekat Gang H. Ten Kemayoran',
      en: 'Main Jalan Garuda corridor near Gang H. Ten Kemayoran',
    },
    vibeTags: [
      { id: 'Hidden Gem Warga', en: 'Neighborhood Gem' },
      { id: 'Kuah Segar Bening', en: 'Clear Savory Broth' },
    ],
  },
  {
    id: 'rest-14',
    name: 'Sop Buntut & Iga Bakar Sunter Paradise',
    tagline: {
      id: 'Buntut sapi bakar bumbu kecap rempah karamel dan sop kuah pala cengkeh di kawasan Ruko Sunter Paradise.',
      en: 'Caramelized spiced soy grilled oxtail and aromatic nutmeg-clove oxtail soup in Ruko Sunter Paradise.',
    },
    neighborhood: 'Sunter',
    subArea: 'Ruko Sunter Paradise, Jl. Danau Sunter Barat',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$$',
    estimatedPriceIdr: 'Rp 65.000 – Rp 120.000',
    minPriceIdr: 65000,
    rating: 4.9,
    isVerified: true,
    halalStatus: 'Halal',
    heroImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        caption: {
          id: 'Sop Buntut Bakar dengan olesan bumbu kecap rempah yang terkaramelisasi di atas arang.',
          en: 'Charcoal-grilled oxtail glazed in caramelized sweet soy and spices, served with clear broth on the side.',
        },
      },
    ],
    editorialSummary: {
      id: 'Terletak di deretan Ruko Sunter Paradise Jalan Danau Sunter Barat, rumah makan ini menyajikan buntut sapi pilihan yang direbus perlahan selama 4 jam sebelum dibakar di atas bara arang.',
      en: 'Located in Ruko Sunter Paradise on Jalan Danau Sunter Barat, this spot slow-simmers center-cut oxtail for four hours before finishing it over glowing charcoal.',
    },
    editorialReview: {
      verdict: {
        id: 'Daging buntutnya langsung lepas dari tulang hanya dengan sentuhan sendok, dan sambal ijo terasinya memberikan tendangan rasa segar.',
        en: 'The oxtail meat falls effortlessly off the bone at the touch of a spoon, paired with vibrant green chili sambal.',
      },
      atmosphere: {
        id: 'Ruang makan keluarga yang tenang dan sejuk di komplek Ruko Sunter Paradise dengan parkir leluasa.',
        en: 'Calm, air-conditioned family dining room in the Sunter Paradise shophouse complex with easy parking.',
      },
      insiderTip: {
        id: 'Pilih menu Sop Buntut Bakar agar Anda mendapatkan daging bakar karamel sekaligus semangkuk kuah sop kaldu hangat.',
        en: 'Order the Grilled Oxtail (Buntut Bakar) so you get both caramelized grilled meat and a bowl of hot spiced broth.',
      },
      author: 'Raka Wijaya',
      authorRole: {
        id: 'Kontributor Komunitas',
        en: 'Community Contributor',
      },
      publishedPeriod: {
        id: 'Riset Hidden Gem',
        en: 'Hidden Gem Research',
      },
    },
    signatureDishes: [
      {
        name: 'Sop Buntut Bakar Kecap Rempah Spesial',
        priceIdr: 'Rp 92.000',
        description: {
          id: 'Buntut sapi tengah empuk dibakar dengan bumbu kecap mentega pala, disajikan bersama kuah sop bening dan emping.',
          en: 'Tender center-cut oxtail grilled with nutmeg-butter soy glaze, served with clear soup and melinjo crackers.',
        },
        halalStatus: 'Halal',
        isPopular: true,
      },
      {
        name: 'Soto Betawi Susu & Sate Maranggi Sapi',
        priceIdr: 'Rp 68.000',
        description: {
          id: 'Soto Betawi kuah susu gurih dilengkapi 5 tusuk sate sapi maranggi bakar arang.',
          en: 'Creamy milk-broth Soto Betawi paired with five skewers of charcoal-grilled Maranggi beef satay.',
        },
        halalStatus: 'Halal',
      },
    ],
    openingHours: {
      id: 'Setiap Hari • 10.00 – 21.30 WIB',
      en: 'Daily • 10:00 AM – 9:30 PM',
    },
    address:
      'Ruko Sunter Paradise Blok R No. 21, Jl. Danau Sunter Barat, Sunter Agung, Jakarta Utara',
    nearbyLandmark: {
      id: 'Komplek Ruko Sunter Paradise dekat RS Royal Progress Sunter',
      en: 'Sunter Paradise Shophouse Complex near Royal Progress Hospital',
    },
    vibeTags: [
      { id: 'Buntut Bakar Empuk', en: 'Fall-Off-The-Bone Oxtail' },
      { id: 'Favorit Keluarga', en: 'Family Favorite' },
    ],
  },
];

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'col-1',
    title: {
      id: 'Kuliner Favorit Sunter & Kelapa Gading',
      en: 'Sunter & Kelapa Gading Daily Favorites',
    },
    subtitle: {
      id: 'Mulai dari bakmi karet pagi hari, kopi sourdough nyaman, hingga mie Hokkien tepi danau.',
      en: 'From morning handmade noodles and cozy sourdough coffee spots to lakeside Hokkien noodles.',
    },
    curator: 'Nadia Kusuma',
    coverImage:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=85',
    tag: { id: 'Sunter & Gading', en: 'Sunter & Gading' },
    filterNeighborhood: 'Sunter',
  },
  {
    id: 'col-2',
    title: {
      id: 'Jejak Kuliner Malam Kemayoran & Mangga Besar',
      en: 'Night Food Trail: Kemayoran & Mangga Besar',
    },
    subtitle: {
      id: 'Menikmati soto Betawi hangat, ketan susu, dan kwetiau goreng api besar selepas senja.',
      en: 'Savoring warm Soto Betawi, sweet milk sticky rice, and high-flame wok flat noodles after dusk.',
    },
    curator: 'Dimas Pramudya',
    coverImage:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85',
    tag: { id: 'Kuliner Malam', en: 'Evening Guide' },
    filterNeighborhood: 'Kemayoran',
  },
  {
    id: 'col-3',
    title: {
      id: 'Warisan Rasa Nusantara di Senen & Kemayoran',
      en: 'Indonesian Heritage Flavors in Senen & Kemayoran',
    },
    subtitle: {
      id: 'Kelezatan Nasi Kapau Bukittinggi dan hidangan berkuah rempah yang autentik.',
      en: 'Authentic Bukittinggi Nasi Kapau and richly spiced traditional broths.',
    },
    curator: 'Redaksi Food Album',
    coverImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
    tag: { id: 'Khas Nusantara', en: 'Heritage Flavors' },
    filterNeighborhood: 'Senen',
  },
  {
    id: 'col-4',
    title: {
      id: 'Ruang Kopi & Diskusi Nyaman di Sunter',
      en: 'Cozy Coffee Roasteries & Study Spots in Sunter',
    },
    subtitle: {
      id: 'Rekomendasi tempat ngopi tenang dengan roti sourdough segar dan koneksi internet cepat.',
      en: 'Top picks for sunlit coffee roasteries serving fresh sourdough and specialty pour-overs.',
    },
    curator: 'Dimas Pramudya',
    coverImage:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85',
    tag: { id: 'Kopi & Roti', en: 'Coffee & Bakery' },
    filterCuisine: 'Kopitiam & Roastery',
  },
];

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: 'art-1',
    title: {
      id: 'Dari Danau Sunter ke Boulevard Kelapa Gading: Peta Kuliner Harian yang Selalu Dirindukan',
      en: 'From Danau Sunter to Boulevard Kelapa Gading: An Everyday Culinary Map Worth Savoring',
    },
    subtitle: {
      id: 'Menelusuri kedai mie tradisional, roastery kopi yang tenang, hingga deretan ruko kuliner legendaris.',
      en: 'Exploring traditional noodle stalls, sunlit coffee roasteries, and legendary neighborhood shophouses.',
    },
    category: { id: 'Liputan Wilayah', en: 'Neighborhood Chronicle' },
    isSponsored: true,
    sponsorName: 'Pesona Kuliner Jakarta',
    publishedDate: { id: '21 Oktober 2026', en: 'October 21, 2026' },
    readTime: { id: '6 Menit Baca', en: '6 Min Read' },
    heroImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85',
    heroCaption: {
      id: 'Suasana hangat deretan kuliner di koridor Sunter dan Kelapa Gading.',
      en: 'Warm dining atmosphere across the Sunter and Kelapa Gading culinary corridor.',
    },
    author: {
      name: 'Nadia Kusuma',
      role: { id: 'Editor Kuliner Senior', en: 'Senior Culinary Editor' },
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: {
        id: 'Nadia telah mendokumentasikan kedai kopi tradisional, pasar segar, dan dapur keluarga di Jakarta selama lebih dari sepuluh tahun.',
        en: 'Nadia has spent a decade documenting heritage shophouses, wet markets, and family kitchens across Jakarta.',
      },
    },
    neighborhoodFocus: ['Sunter', 'Kelapa Gading'],
    sections: [
      {
        id: 'sec-morning-noodles',
        heading: {
          id: '01. Tradisi Pagi: Kenyalnya Bakmi Karet Racikan Tangan di Kelapa Gading',
          en: '01. Morning Rituals: Handmade Springy Bakmi Karet in Kelapa Gading',
        },
        paragraphs: [
          {
            id: 'Sejak pukul enam pagi, aroma bawang putih goreng dan minyak ayam kampung menyeruak dari ruko-ruko keluarga di sepanjang Boulevard Raya Kelapa Gading. Ciri khas utama kawasan ini adalah Bakmi Karet—mie telur tebal yang diuleni hingga menghasilkan tekstur kenyal alami.',
            en: 'Starting at 6:00 AM, the aroma of crispy garlic and rendered chicken oil drifts from family shophouses along Boulevard Raya. The signature style is Bakmi Karet—thick egg noodles kneaded for a naturally springy bite.',
          },
        ],
        embeddedRestaurantId: 'rest-1',
      },
      {
        id: 'sec-sunter-coffee',
        heading: {
          id: '02. Siang yang Tenang: Kopi Nusantara & Sourdough di Sunter',
          en: '02. Midday Pause: Indonesian Specialty Coffee & Sourdough in Sunter',
        },
        paragraphs: [
          {
            id: 'Bergeser sedikit ke arah Sunter Indah, ritme jalanan melambat. Di sini, kedai kopi roastery modern menjadi tempat favorit untuk berdiskusi, mengerjakan tugas, atau sekadar menikmati pastry gula aren hangat bersama segelas es kopi susu.',
            en: 'Just a short drive over in Sunter Indah, sunlit coffee roasteries offer a calm oasis for discussions, reading, or enjoying warm palm-sugar pastries with iced milk coffee.',
          },
        ],
        pullQuote: {
          quote: {
            id: 'Kawasan Sunter dan Kelapa Gading saling melengkapi—satu memberi ketenangan ruang ngopi, satunya lagi menyuguhkan ratusan pilihan makan yang tak pernah habis.',
            en: 'Sunter and Kelapa Gading complement each other effortlessly—pairing cozy neighborhood coffee houses with an endless boulevard of classic eateries.',
          },
          attribution: 'Dimas Pramudya, Kritikus Kopi & Gaya Hidup',
        },
        embeddedRestaurantId: 'rest-3',
      },
      {
        id: 'sec-sunter-charcoal',
        heading: {
          id: '03. Sore di Tepi Danau Sunter: Kelezatan Mie Hokkien Anglo Arang',
          en: '03. Evening by Danau Sunter: Charcoal-Braised Hokkien Noodles',
        },
        paragraphs: [
          {
            id: 'Saat sore tiba di tepi Danau Sunter, Anda masih dapat menemukan tradisi memasak mie Hokkien satu per satu di atas anglo arang yang memberikan sentuhan rasa asap lembut pada kuah kaldu udangnya.',
            en: 'As afternoon turns to evening by Danau Sunter, Hokkien noodles braised over clay charcoal braziers deliver comforting smoky depth.',
          },
        ],
        embeddedRestaurantId: 'rest-2',
      },
    ],
  },
  {
    id: 'art-2',
    title: {
      id: 'Menjelajahi Kemayoran, Senen & Mangga Besar: Tiga Kawasan Legendaris yang Kaya Cerita Rasa',
      en: 'Exploring Kemayoran, Senen & Mangga Besar: Three Historic Neighborhoods Rich in Flavor',
    },
    subtitle: {
      id: 'Dari Nasi Kapau Bukittinggi di Kramat Senen, Soto Betawi di Kemayoran, hingga gemerlap kuliner malam Mangga Besar.',
      en: 'From authentic Nasi Kapau in Senen and rich Soto Betawi in Kemayoran to late-night wok mastery in Mangga Besar.',
    },
    category: { id: 'Warisan Kuliner', en: 'Culinary Heritage' },
    isSponsored: false,
    publishedDate: { id: '15 Oktober 2026', en: 'October 15, 2026' },
    readTime: { id: '5 Menit Baca', en: '5 Min Read' },
    heroImage:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
    heroCaption: {
      id: 'Hidangan berempah hangat yang selalu menggugah selera di Kemayoran dan Senen.',
      en: 'Richly spiced heritage dishes across Kemayoran and Senen.',
    },
    author: {
      name: 'Dimas Pramudya',
      role: { id: 'Kritikus Kopi & Gaya Hidup', en: 'Coffee & Dining Critic' },
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: {
        id: 'Dimas aktif mengulas perkembangan kopi spesialti Nusantara, kuliner jalanan legendaris, dan ruang makan di Jakarta.',
        en: 'Dimas covers Indonesian specialty coffee, heritage street food, and dining spaces across Jakarta.',
      },
    },
    neighborhoodFocus: ['Kemayoran', 'Senen', 'Mangga Besar'],
    sections: [
      {
        id: 'sec-kemayoran-soto',
        heading: {
          id: '01. Hangatnya Soto Betawi & Ketan Susu di Kemayoran',
          en: '01. Warm Soto Betawi & Sweet Sticky Rice in Kemayoran',
        },
        paragraphs: [
          {
            id: 'Kemayoran selalu punya cara ramah untuk menyambut siapa saja yang lapar. Semangkuk Soto Betawi kuah susu minyak samin di Jalan Garuda menjadi hidangan yang tak pernah gagal menghangatkan suasana.',
            en: 'Kemayoran always offers a warm welcome to hungry explorers, anchored by bowls of ghee-scented milk Soto Betawi along Jalan Garuda.',
          },
        ],
        embeddedRestaurantId: 'rest-4',
      },
      {
        id: 'sec-senen-kapau',
        heading: {
          id: '02. Tradisi Nasi Kapau & Kue Pasar di Senen',
          en: '02. Tiered Pots of Nasi Kapau in Senen',
        },
        paragraphs: [
          {
            id: 'Bergerak ke arah selatan menuju Senen, deretan penjual Nasi Kapau menyuguhkan pemandangan panci bertingkat berisi gulai tambusu, tunjang, dan ayam bakar bumbu rempah.',
            en: 'Southward in Senen, iconic rows of Nasi Kapau stalls display tiered pots of rich Minang curries and spiced grilled chicken.',
          },
        ],
        embeddedRestaurantId: 'rest-6',
      },
    ],
  },
];

export const INITIAL_USER_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    restaurantId: 'rest-1',
    restaurantName: 'Bakmi Karet Ahong Boulevard',
    reviewerName: 'Clarissa Tan',
    rating: 5,
    favoriteDish: 'Bakmi Karet Ayam Kampung Spesial',
    comment:
      'Tekstur bakmi karetnya benar-benar juara dan konsisten dari dulu! Ayam kampungnya empuk, ditambah bakso goreng hangat makin lengkap.',
    createdAt: '20 Oktober 2026',
  },
  {
    id: 'rev-2',
    restaurantId: 'rest-3',
    restaurantName: 'Kemala Roastery & Sourdough Sunter',
    reviewerName: 'Kevin Pratama',
    rating: 5,
    favoriteDish: 'Gula Aren Kouign-Amann',
    comment:
      'Tempatnya terang, adem, dan nyaman banget buat ngopi atau diskusi di Sunter. Kouign-Amann gula arennya wajib dicoba!',
    createdAt: '19 Oktober 2026',
  },
  {
    id: 'rev-3',
    restaurantId: 'rest-4',
    restaurantName: 'Soto Betawi & Ketan Susu Garuda Kemayoran',
    reviewerName: 'Promo Cepat Kaya 99',
    rating: 1,
    favoriteDish: '-',
    comment:
      'Kunjungi website pinjaman instan kami di www.spam-promo-palsu.test untuk bonus saldo langsung cair hari ini!!',
    createdAt: '18 Oktober 2026',
    isFlagged: true,
  },
  {
    id: 'rev-4',
    restaurantId: 'rest-6',
    restaurantName: 'Nasi Kapau & Kue Tradisional Sabana Senen',
    reviewerName: 'Dewi Sartika',
    rating: 5,
    favoriteDish: 'Nasi Kapau Gulai Tambusu',
    comment:
      'Bumbu gulai tambusunya meresap banget dan sambal ijonya segar. Porsinya juga sangat mengenyangkan.',
    createdAt: '17 Oktober 2026',
  },
  {
    id: 'rev-5',
    restaurantId: 'rest-1',
    restaurantName: 'Bakmi Karet Ahong Boulevard',
    reviewerName: 'Akun Bot Komentar',
    rating: 2,
    favoriteDish: 'Tidak tahu',
    comment:
      'Saya belum pernah ke tempat ini dan cuma asal kasih bintang 2 saja. Jual peninggi badan murah hubungi nomor kami.',
    createdAt: '16 Oktober 2026',
    isFlagged: true,
  },
  {
    id: 'rev-6',
    restaurantId: 'rest-7',
    restaurantName: 'Seafood Ayu Boulevard Barat',
    reviewerName: 'Hendra Wijaya',
    rating: 5,
    favoriteDish: 'Ikan Kuwe Bakar Kecap Rempah',
    comment:
      'Seafood tenda malam paling juara di perbatasan Kelapa Gading–Sunter! Ikan kuwe bakarnya segar banget dan cumi goreng tepungnya garing empuk.',
    createdAt: '25 Oktober 2026',
  },
  {
    id: 'rev-7',
    restaurantId: 'rest-8',
    restaurantName: 'Maison Weiner Cake Shop 1936',
    reviewerName: 'Astrid Prameswari',
    rating: 5,
    favoriteDish: 'Ontbijtkoek Rempah Klasik Belanda',
    comment:
      'Suasana toko rotinya sangat autentik sejak 1936 di Kwitang Senen. Ontbijtkoek dan kue soes klasiknya wajib dibeli setiap lewat Senen!',
    createdAt: '25 Oktober 2026',
  },
  {
    id: 'rev-8',
    restaurantId: 'rest-9',
    restaurantName: 'Ippeke Komachi Japanese Dining',
    reviewerName: 'Raymond Santoso',
    rating: 5,
    favoriteDish: 'Tori Karaage Teishoku Set',
    comment:
      'Restoran Jepang hidden gem di Kelapa Gading yang rasanya tidak pernah berubah dari dulu. Tori Karaage dan Chawanmushi-nya terbaik.',
    createdAt: '24 Oktober 2026',
  },
  {
    id: 'rev-9',
    restaurantId: 'rest-11',
    restaurantName: 'Shantung 77 Kuotie & Mie Mangga Besar',
    reviewerName: 'フェリシア (Felicia Tan)',
    rating: 5,
    favoriteDish: 'Kuotie Panggang Spesial Shantung (Isi 10)',
    comment:
      'Kuotie panggangnya garing di bawah dan juicy banget di dalam, dicocol minyak wijen + bawang putih cincang makin mantap.',
    createdAt: '24 Oktober 2026',
  },
];

export const INITIAL_PENDING_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: 'sub-1',
    restaurantName: 'Sate Kuah Pontianak & Es Jeruk Bang Toni',
    neighborhood: 'Sunter',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 35.000 – Rp 55.000',
    halalStatus: 'Halal',
    address: 'Jl. Sunter Karya Utara Blok G, Sunter Agung, Jakarta',
    signatureDish: 'Sate Ayam Bumbu Kacang dengan Kuah Kaldu Hangat',
    reason:
      'Potongan daging satenya besar dan empuk, disajikan unik dengan semangkuk kaldu bening beraroma bawang putih dan perasan jeruk kunci.',
    submittedBy: 'Melisa Wijaya',
    submitterEmail: 'melisa.w@email.id',
    submittedAt: '22 Oktober 2026',
    photoUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'sub-2',
    restaurantName: 'Ayam Panggang & Sambal Cobek Kemayoran Jaya',
    neighborhood: 'Kemayoran',
    cuisine: 'Nusantara & Bakar Arang',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 30.000 – Rp 50.000',
    halalStatus: 'Halal',
    address: 'Jl. Utan Panjang Timur No. 14, Kemayoran, Jakarta',
    signatureDish: 'Ayam Panggang Kecap Rempah & Sambal Terasi Segar',
    reason:
      'Ayam panggangnya diungkep bumbu rempah selama 3 jam sebelum dibakar di atas arang, harganya sangat terjangkau dan sambalnya diulek dadakan.',
    submittedBy: 'Hendra Kusnadi',
    submitterEmail: 'hendra.k@email.id',
    submittedAt: '21 Oktober 2026',
    photoUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'sub-3',
    restaurantName: 'Bubur Ayam & Cakwe Hangat Mangga Besar 42',
    neighborhood: 'Mangga Besar',
    cuisine: 'Bakmi & Mie Tradisional',
    priceTier: '$',
    estimatedPriceIdr: 'Rp 28.000 – Rp 45.000',
    halalStatus: 'Belum Ada Sertifikasi',
    address: 'Jl. Mangga Besar Raya No. 42, Taman Sari, Jakarta',
    signatureDish: 'Bubur Ayam Kampung Telur Setengah Matang & Cakwe Garing',
    reason:
      'Buburnya kental dan wangi minyak wijen, disajikan dengan potongan ayam kampung suwir dan cakwe goreng yang baru diangkat dari wajan.',
    submittedBy: 'Daniel Halim',
    submitterEmail: 'daniel.halim@email.id',
    submittedAt: '20 Oktober 2026',
    photoUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85',
  },
];
