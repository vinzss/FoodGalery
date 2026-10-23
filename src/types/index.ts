export type Language = 'id' | 'en';

export interface LocalizedText {
  id: string;
  en: string;
}

export type PageRoute =
  | 'home'
  | 'directory'
  | 'restaurant-detail'
  | 'editorial'
  | 'submit-recommendation'
  | 'admin';

export type NeighborhoodName =
  | 'Kemayoran'
  | 'Sunter'
  | 'Kelapa Gading'
  | 'Mangga Besar'
  | 'Senen';

export type CuisineType =
  | 'Bakmi & Mie Tradisional'
  | 'Seafood Pesisir Segar'
  | 'Kopitiam & Roastery'
  | 'Jepang & Grill Modern'
  | 'Nusantara & Bakar Arang'
  | 'Pastry & Hidangan Penutup';

export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export type HalalStatus = 'Halal' | 'Non-Halal' | 'Belum Ada Sertifikasi';

export interface SignatureDish {
  name: string;
  priceIdr: string;
  description: LocalizedText;
  halalStatus: HalalStatus;
  isPopular?: boolean;
}

export interface GalleryImage {
  url: string;
  caption: LocalizedText;
}

export interface EditorialReview {
  verdict: LocalizedText;
  atmosphere: LocalizedText;
  insiderTip: LocalizedText;
  author: string;
  authorRole: LocalizedText;
  publishedPeriod: LocalizedText;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: LocalizedText;
  neighborhood: NeighborhoodName;
  subArea: string;
  cuisine: CuisineType;
  priceTier: PriceTier;
  estimatedPriceIdr: string;
  minPriceIdr: number;
  rating: number;
  isVerified: boolean;
  isSponsored?: boolean;
  isFeatured?: boolean;
  halalStatus: HalalStatus;
  heroImage: string;
  gallery: GalleryImage[];
  editorialSummary: LocalizedText;
  editorialReview: EditorialReview;
  signatureDishes: SignatureDish[];
  openingHours: LocalizedText;
  address: string;
  nearbyLandmark: LocalizedText;
  vibeTags: LocalizedText[];
}

export interface NeighborhoodInfo {
  name: NeighborhoodName;
  tagline: LocalizedText;
  description: LocalizedText;
  signatureCravings: LocalizedText[];
  heroImage: string;
}

export interface CuratedCollection {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  curator: string;
  coverImage: string;
  tag: LocalizedText;
  filterNeighborhood?: NeighborhoodName | 'All';
  filterCuisine?: CuisineType | 'All';
}

export interface ArticleSection {
  id: string;
  heading: LocalizedText;
  paragraphs: LocalizedText[];
  pullQuote?: {
    quote: LocalizedText;
    attribution: string;
  };
  embeddedRestaurantId?: string;
}

export interface EditorialArticle {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: LocalizedText;
  isSponsored: boolean;
  sponsorName?: string;
  publishedDate: LocalizedText;
  readTime: LocalizedText;
  heroImage: string;
  heroCaption: LocalizedText;
  author: {
    name: string;
    role: LocalizedText;
    avatar: string;
    bio: LocalizedText;
  };
  neighborhoodFocus: NeighborhoodName[];
  sections: ArticleSection[];
}

export interface UserReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  reviewerName: string;
  rating: number;
  favoriteDish: string;
  comment: string;
  createdAt: string;
  isFlagged?: boolean;
}

export interface CommunitySubmission {
  id: string;
  restaurantName: string;
  neighborhood: NeighborhoodName;
  cuisine: CuisineType;
  priceTier: PriceTier;
  estimatedPriceIdr: string;
  halalStatus: HalalStatus;
  address: string;
  signatureDish: string;
  reason: string;
  submittedBy: string;
  submitterEmail: string;
  submittedAt: string;
  photoUrl: string;
}
