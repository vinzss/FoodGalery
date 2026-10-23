import React, { useState, useEffect } from 'react';
import {
  PageRoute,
  NeighborhoodName,
  CuisineType,
  PriceTier,
  Restaurant,
  UserReview,
  CommunitySubmission,
} from './types';
import {
  NEIGHBORHOODS,
  INITIAL_RESTAURANTS,
  CURATED_COLLECTIONS,
  EDITORIAL_ARTICLES,
  INITIAL_USER_REVIEWS,
  INITIAL_PENDING_SUBMISSIONS,
} from './data/mockData';
import { LanguageProvider } from './i18n/LanguageContext';
import { GlassHeader } from './components/GlassHeader';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import {
  DirectoryPage,
  SortOption,
  VerificationFilter,
} from './pages/DirectoryPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { EditorialArticlePage } from './pages/EditorialArticlePage';
import { SubmitRecommendationPage } from './pages/SubmitRecommendationPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { UmkmFormPayload } from './admin/UmkmManager';

const STORAGE_KEYS = {
  RESTAURANTS: 'fa_jakarta_restaurants_v2',
  REVIEWS: 'fa_jakarta_reviews_v2',
  SUBMISSIONS: 'fa_jakarta_submissions_v2',
  ADMIN_AUTH: 'fa_jakarta_admin_auth_v2',
};

function getInitialRouteFromLocation(): PageRoute {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.startsWith('/admin') || hash.includes('admin')) {
    return 'admin';
  }
  if (path.startsWith('/submit') || hash.includes('submit')) {
    return 'submit-recommendation';
  }
  if (path.startsWith('/directory') || hash.includes('directory')) {
    return 'directory';
  }
  return 'home';
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(
    getInitialRouteFromLocation
  );

  // Admin Authentication State (Protected Route for /admin)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => {
      try {
        return (
          window.sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true'
        );
      } catch {
        return false;
      }
    }
  );

  // Dynamic Platform State (Persisted in localStorage so /admin URL navigation & gallery uploads persist)
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() =>
    loadFromStorage(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS)
  );
  const [reviews, setReviews] = useState<UserReview[]>(() =>
    loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_USER_REVIEWS)
  );
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>(() =>
    loadFromStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_PENDING_SUBMISSIONS)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.RESTAURANTS,
        JSON.stringify(restaurants)
      );
    } catch {
      // Ignore quota errors if very large base64 images are uploaded
    }
  }, [restaurants]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.REVIEWS,
        JSON.stringify(reviews)
      );
    } catch {
      // Ignore storage errors
    }
  }, [reviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SUBMISSIONS,
        JSON.stringify(submissions)
      );
    } catch {
      // Ignore storage errors
    }
  }, [submissions]);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    restaurants[0]?.id || INITIAL_RESTAURANTS[0].id
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    EDITORIAL_ARTICLES[0].id
  );
  const [preselectedReviewRestId, setPreselectedReviewRestId] = useState<
    string | undefined
  >(undefined);

  // Saved Favorites
  const [savedIds, setSavedIds] = useState<string[]>(['rest-1', 'rest-3']);

  // Directory Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    NeighborhoodName | 'All'
  >('All');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | 'All'>(
    'All'
  );
  const [selectedPrice, setSelectedPrice] = useState<PriceTier | 'All'>('All');
  const [selectedVerification, setSelectedVerification] =
    useState<VerificationFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Sync URL with `/admin` vs public routes
  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    const targetPath = page === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(getInitialRouteFromLocation());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } catch {
      // Ignore storage errors
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // Ignore storage errors
    }
  };

  const handleToggleSave = (restaurantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleRemoveSaved = (restaurantId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== restaurantId));
  };

  const handleSelectRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    handleNavigate('restaurant-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    handleNavigate('editorial');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDirectory = (filters?: {
    search?: string;
    neighborhood?: NeighborhoodName | 'All';
    cuisine?: CuisineType | 'All';
  }) => {
    if (filters) {
      if (filters.search !== undefined) setSearchQuery(filters.search);
      if (filters.neighborhood !== undefined)
        setSelectedNeighborhood(filters.neighborhood);
      if (filters.cuisine !== undefined) setSelectedCuisine(filters.cuisine);
    }
    handleNavigate('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedNeighborhood('All');
    setSelectedCuisine('All');
    setSelectedPrice('All');
    setSelectedVerification('All');
    setSortBy('featured');
  };

  // Community Submission Handler (Goes to Admin Queue, NOT instant publish)
  const handleAddSubmission = (
    newSub: Omit<CommunitySubmission, 'id' | 'submittedAt'>
  ) => {
    const created: CommunitySubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      submittedAt: '23 Oktober 2026',
    };
    setSubmissions((prev) => [created, ...prev]);
  };

  // Community Review Handler
  const handleAddReview = (newRev: Omit<UserReview, 'id' | 'createdAt'>) => {
    const created: UserReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      createdAt: '23 Oktober 2026',
    };
    setReviews((prev) => [created, ...prev]);
  };

  // Admin: Approve Community Submission -> Publish to Live Restaurants
  const handleApproveSubmission = (submissionId: string) => {
    const target = submissions.find((s) => s.id === submissionId);
    if (!target) return;

    const minPriceMap: Record<PriceTier, number> = {
      $: 35000,
      $$: 75000,
      $$$: 180000,
      $$$$: 360000,
    };

    const newlyApprovedRestaurant: Restaurant = {
      id: `rest-${Date.now()}`,
      name: target.restaurantName,
      tagline: {
        id: target.reason,
        en: target.reason,
      },
      neighborhood: target.neighborhood,
      subArea: target.address,
      cuisine: target.cuisine,
      priceTier: target.priceTier,
      estimatedPriceIdr: target.estimatedPriceIdr,
      minPriceIdr: minPriceMap[target.priceTier],
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
      editorialSummary: {
        id: target.reason,
        en: target.reason,
      },
      editorialReview: {
        verdict: {
          id: target.reason,
          en: target.reason,
        },
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
          description: {
            id: target.reason,
            en: target.reason,
          },
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

    setRestaurants((prev) => [newlyApprovedRestaurant, ...prev]);
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
  };

  // Admin: Reject Community Submission
  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
  };

  // Admin: Create or Update UMKM (with up to 10 Gallery Photos, Dynamic Menus & Halal Status)
  const handleSaveRestaurant = (payload: UmkmFormPayload) => {
    const minPriceMap: Record<PriceTier, number> = {
      $: 35000,
      $$: 75000,
      $$$: 180000,
      $$$$: 360000,
    };

    if (payload.editingId) {
      setRestaurants((prev) =>
        prev.map((existing) => {
          if (existing.id !== payload.editingId) return existing;
          return {
            ...existing,
            name: payload.name,
            tagline: {
              id: payload.description,
              en: payload.description,
            },
            neighborhood: payload.neighborhood,
            subArea: payload.address,
            address: payload.address,
            cuisine: payload.cuisine,
            priceTier: payload.priceTier,
            estimatedPriceIdr: payload.estimatedPriceIdr,
            minPriceIdr: minPriceMap[payload.priceTier],
            halalStatus: payload.halalStatus,
            heroImage: payload.heroImage,
            gallery: payload.gallery.slice(0, 10),
            signatureDishes: payload.signatureDishes,
            editorialSummary: {
              id: payload.description,
              en: payload.description,
            },
            editorialReview: {
              ...existing.editorialReview,
              verdict: {
                id: payload.description,
                en: payload.description,
              },
            },
          };
        })
      );
      return;
    }

    const firstDishName =
      payload.signatureDishes[0]?.name || payload.name;

    const created: Restaurant = {
      id: `rest-${Date.now()}`,
      name: payload.name,
      tagline: {
        id: payload.description,
        en: payload.description,
      },
      neighborhood: payload.neighborhood,
      subArea: payload.address,
      cuisine: payload.cuisine,
      priceTier: payload.priceTier,
      estimatedPriceIdr: payload.estimatedPriceIdr,
      minPriceIdr: minPriceMap[payload.priceTier],
      rating: 4.8,
      isVerified: true,
      isFeatured: true,
      halalStatus: payload.halalStatus,
      heroImage: payload.heroImage,
      gallery: payload.gallery.slice(0, 10),
      editorialSummary: {
        id: payload.description,
        en: payload.description,
      },
      editorialReview: {
        verdict: {
          id: payload.description,
          en: payload.description,
        },
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
      signatureDishes: payload.signatureDishes,
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

    setRestaurants((prev) => [created, ...prev]);
  };

  // Admin: Delete Existing UMKM
  const handleDeleteRestaurant = (restaurantId: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    setSavedIds((prev) => prev.filter((id) => id !== restaurantId));
  };

  // Admin: Delete Review
  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const activeRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];
  const activeArticle =
    EDITORIAL_ARTICLES.find((a) => a.id === selectedArticleId) ||
    EDITORIAL_ARTICLES[0];

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-terracotta selection:text-white">
      <GlassHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedIds={savedIds}
        restaurants={restaurants}
        onSelectRestaurant={handleSelectRestaurant}
        onRemoveSaved={handleRemoveSaved}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            neighborhoods={NEIGHBORHOODS}
            restaurants={restaurants}
            collections={CURATED_COLLECTIONS}
            articles={EDITORIAL_ARTICLES}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectRestaurant={handleSelectRestaurant}
            onSelectArticle={handleSelectArticle}
            onNavigateDirectory={handleNavigateDirectory}
            onNavigateSubmit={() => {
              setPreselectedReviewRestId(undefined);
              handleNavigate('submit-recommendation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'directory' && (
          <DirectoryPage
            restaurants={restaurants}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            selectedPrice={selectedPrice}
            onPriceChange={setSelectedPrice}
            selectedVerification={selectedVerification}
            onVerificationChange={setSelectedVerification}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            onSelectRestaurant={handleSelectRestaurant}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onNavigateSubmit={() => {
              setPreselectedReviewRestId(undefined);
              handleNavigate('submit-recommendation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'restaurant-detail' && activeRestaurant && (
          <RestaurantDetailPage
            restaurant={activeRestaurant}
            allRestaurants={restaurants}
            reviews={reviews}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectRestaurant={handleSelectRestaurant}
            onBackToDirectory={(neighborhood) => {
              if (neighborhood) {
                setSelectedNeighborhood(neighborhood);
              }
              handleNavigate('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSubmit={(restId) => {
              setPreselectedReviewRestId(restId);
              handleNavigate('submit-recommendation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'editorial' && (
          <EditorialArticlePage
            article={activeArticle}
            allArticles={EDITORIAL_ARTICLES}
            restaurants={restaurants}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectArticle={handleSelectArticle}
            onSelectRestaurant={handleSelectRestaurant}
            onNavigateDirectory={(neighborhood) =>
              handleNavigateDirectory({
                neighborhood: neighborhood || 'All',
              })
            }
            onNavigateSubmit={() => {
              setPreselectedReviewRestId(undefined);
              handleNavigate('submit-recommendation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'submit-recommendation' && (
          <SubmitRecommendationPage
            restaurants={restaurants}
            preselectedRestaurantId={preselectedReviewRestId}
            onAddSubmission={handleAddSubmission}
            onAddReview={handleAddReview}
          />
        )}

        {currentPage === 'admin' && (
          <>
            {!isAdminAuthenticated ? (
              <AdminLogin
                onLoginSuccess={handleAdminLoginSuccess}
                onBackToPublicSite={() => {
                  handleNavigate('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <AdminDashboard
                restaurants={restaurants}
                reviews={reviews}
                submissions={submissions}
                onApproveSubmission={handleApproveSubmission}
                onRejectSubmission={handleRejectSubmission}
                onSaveRestaurant={handleSaveRestaurant}
                onDeleteRestaurant={handleDeleteRestaurant}
                onDeleteReview={handleDeleteReview}
                onLogout={handleAdminLogout}
                onBackToSite={() => {
                  handleNavigate('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onSelectNeighborhood={(nb) => {
          handleResetFilters();
          handleNavigateDirectory({ neighborhood: nb });
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
