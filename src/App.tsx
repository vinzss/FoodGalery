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
import { UmkmFormPayload } from './admin/UmkmManager';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { useAuthText } from './auth/authText';
import { contentApi } from './auth/api';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { Shield } from 'lucide-react';

const STORAGE_KEYS = {
  RESTAURANTS: 'fa_jakarta_restaurants_v2',
  REVIEWS: 'fa_jakarta_reviews_v2',
  SUBMISSIONS: 'fa_jakarta_submissions_v2',
};

function getInitialRouteFromLocation(): PageRoute {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  // Rute statis /admin dihapus sepenuhnya: kembalikan URL ke '/'
  if (path.startsWith('/admin') || hash.includes('admin')) {
    window.history.replaceState({}, '', '/');
    return 'home';
  }
  if (path.startsWith('/login') || hash.includes('login')) {
    return 'login';
  }
  if (path.startsWith('/signup') || hash.includes('signup')) {
    return 'signup';
  }
  if (path.startsWith('/forgot') || hash.includes('forgot')) {
    return 'forgot-password';
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
  const [returnPage, setReturnPage] = useState<PageRoute>('home');
  const [loginNotice, setLoginNotice] = useState<string | undefined>(undefined);

  // Backend Session & RBAC State
  const { user: authUser, isAdmin, logout, refresh } = useAuth();
  const a = useAuthText();

  // Dynamic Admin Mode: otomatis aktif saat user dengan role admin / main_admin login (tanpa URL /admin)
  const [adminViewMode, setAdminViewMode] = useState<'admin' | 'public'>('admin');

  // Platform State (Dimuat & disimpan langsung ke MySQL XAMPP / foodalbum_db)
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_USER_REVIEWS);
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>(
    INITIAL_PENDING_SUBMISSIONS
  );

  // Saved Favorites (Tersimpan per akun di tabel user_favorites MySQL)
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function syncFromMysql() {
      try {
        // Jika masih ada data lama di localStorage browser, migrasikan sekali ke MySQL lalu hapus localStorage
        const legacyRestRaw = window.localStorage.getItem(
          STORAGE_KEYS.RESTAURANTS
        );
        const legacyRevRaw = window.localStorage.getItem(STORAGE_KEYS.REVIEWS);
        const legacySubRaw = window.localStorage.getItem(
          STORAGE_KEYS.SUBMISSIONS
        );
        if (legacyRestRaw || legacyRevRaw || legacySubRaw) {
          await contentApi.migrateLocal({
            restaurants: loadFromStorage(STORAGE_KEYS.RESTAURANTS, []),
            reviews: loadFromStorage(STORAGE_KEYS.REVIEWS, []),
            submissions: loadFromStorage(STORAGE_KEYS.SUBMISSIONS, []),
          });
          window.localStorage.removeItem(STORAGE_KEYS.RESTAURANTS);
          window.localStorage.removeItem(STORAGE_KEYS.REVIEWS);
          window.localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
        }

        const data = await contentApi.bootstrap();
        if (cancelled) return;
        if (data.restaurants.length > 0) setRestaurants(data.restaurants);
        setReviews(data.reviews);
        setSubmissions(data.submissions);
        setSavedIds(data.savedIds);
      } catch (err) {
        console.warn('[db] Gagal memuat data dari MySQL XAMPP:', err);
      }
    }
    syncFromMysql();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    restaurants[0]?.id || INITIAL_RESTAURANTS[0].id
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    EDITORIAL_ARTICLES[0].id
  );
  const [preselectedReviewRestId, setPreselectedReviewRestId] = useState<
    string | undefined
  >(undefined);

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

  // Sync URL with routes (tanpa rute /admin)
  const handleNavigate = (page: PageRoute) => {
    if (page !== 'login') setLoginNotice(undefined);
    setCurrentPage(page);
    const pathMap: Partial<Record<PageRoute, string>> = {
      login: '/login',
      signup: '/signup',
      'forgot-password': '/forgot-password',
    };
    const targetPath = pathMap[page] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleRequireAuth = (mode: 'login' | 'signup' = 'login') => {
    if (
      currentPage !== 'login' &&
      currentPage !== 'signup' &&
      currentPage !== 'forgot-password'
    ) {
      setReturnPage(currentPage);
    }
    handleNavigate(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(getInitialRouteFromLocation());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAdminViewMode('admin');
    handleNavigate('home');
  };

  const handleToggleSave = async (
    restaurantId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!authUser) {
      handleRequireAuth('login');
      return;
    }
    setSavedIds((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
    try {
      const { savedIds: updated } =
        await contentApi.toggleFavorite(restaurantId);
      setSavedIds(updated);
    } catch (err) {
      console.error('[db] Gagal menyimpan favorit:', err);
    }
  };

  const handleRemoveSaved = async (restaurantId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== restaurantId));
    try {
      const { savedIds: updated } =
        await contentApi.removeFavorite(restaurantId);
      setSavedIds(updated);
    } catch (err) {
      console.error('[db] Gagal menghapus favorit:', err);
    }
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

  // Community Submission Handler (Disimpan ke tabel submissions di MySQL XAMPP)
  const handleAddSubmission = async (
    newSub: Omit<CommunitySubmission, 'id' | 'submittedAt'>
  ) => {
    try {
      const { submission } = await contentApi.addSubmission(newSub);
      setSubmissions((prev) => [submission, ...prev]);
    } catch (err) {
      console.error('[db] Gagal menyimpan rekomendasi ke MySQL:', err);
    }
  };

  // Community Review Handler (Disimpan ke tabel reviews di MySQL XAMPP)
  const handleAddReview = async (
    newRev: Omit<UserReview, 'id' | 'createdAt'>
  ) => {
    try {
      const { review } = await contentApi.addReview(newRev);
      setReviews((prev) => [review, ...prev]);
    } catch (err) {
      console.error('[db] Gagal menyimpan ulasan ke MySQL:', err);
    }
  };

  // Admin: Approve Community Submission -> Publish to Live Restaurants in MySQL XAMPP
  const handleApproveSubmission = async (submissionId: string) => {
    try {
      const { restaurant } = await contentApi.approveSubmission(submissionId);
      setRestaurants((prev) => [restaurant, ...prev]);
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (err) {
      console.error('[db] Gagal menyetujui rekomendasi di MySQL:', err);
    }
  };

  // Admin: Reject Community Submission in MySQL XAMPP
  const handleRejectSubmission = async (submissionId: string) => {
    try {
      await contentApi.rejectSubmission(submissionId);
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (err) {
      console.error('[db] Gagal menolak rekomendasi di MySQL:', err);
    }
  };

  // Admin: Create or Update UMKM in MySQL XAMPP
  const handleSaveRestaurant = async (payload: UmkmFormPayload) => {
    try {
      const { restaurant } = await contentApi.saveRestaurant(payload);
      if (payload.editingId) {
        setRestaurants((prev) =>
          prev.map((existing) =>
            existing.id === payload.editingId ? restaurant : existing
          )
        );
      } else {
        setRestaurants((prev) => [restaurant, ...prev]);
      }
    } catch (err) {
      console.error('[db] Gagal menyimpan UMKM ke MySQL:', err);
    }
  };

  // Admin: Delete Existing UMKM in MySQL XAMPP
  const handleDeleteRestaurant = async (restaurantId: string) => {
    try {
      await contentApi.deleteRestaurant(restaurantId);
      setRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
      setSavedIds((prev) => prev.filter((id) => id !== restaurantId));
    } catch (err) {
      console.error('[db] Gagal menghapus UMKM di MySQL:', err);
    }
  };

  // Admin: Delete Review in MySQL XAMPP
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await contentApi.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('[db] Gagal menghapus ulasan di MySQL:', err);
    }
  };

  const activeRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];
  const activeArticle =
    EDITORIAL_ARTICLES.find((a) => a.id === selectedArticleId) ||
    EDITORIAL_ARTICLES[0];

  // Conditional Rendering Dinamis: Jika user adalah admin / main_admin dan sedang di mode admin,
  // langsung render Admin Command Center penuh tanpa URL /admin dan tanpa layout user biasa.
  if (authUser && isAdmin && adminViewMode === 'admin') {
    return (
      <AdminDashboard
        restaurants={restaurants}
        reviews={reviews}
        submissions={submissions}
        onApproveSubmission={handleApproveSubmission}
        onRejectSubmission={handleRejectSubmission}
        onSaveRestaurant={handleSaveRestaurant}
        onDeleteRestaurant={handleDeleteRestaurant}
        onDeleteReview={handleDeleteReview}
        onLogout={handleLogout}
        adminUsername={authUser.username}
        adminRole={authUser.role}
        onAuthLost={() => {
          refresh();
        }}
        onSwitchToUserView={() => {
          setAdminViewMode('public');
          handleNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-terracotta selection:text-white">
      <GlassHeader
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedIds={savedIds}
        restaurants={restaurants}
        onSelectRestaurant={handleSelectRestaurant}
        onRemoveSaved={handleRemoveSaved}
        authUser={authUser}
        onLogout={handleLogout}
        onEnterAdminMode={() => {
          setAdminViewMode('admin');
          handleNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Tombol Mengambang Cepat untuk kembali ke Admin Command Center saat Admin sedang mempratinjau situs publik */}
      {authUser && isAdmin && adminViewMode === 'public' && (
        <div className="fixed bottom-20 xl:bottom-6 right-4 z-50">
          <button
            type="button"
            onClick={() => {
              setAdminViewMode('admin');
              handleNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-charcoal-900 hover:bg-terracotta text-white px-4 py-3 text-xs font-bold shadow-warm-lg border border-white/15 transition"
          >
            <Shield className="h-4 w-4 text-amber-400" />
            <span>Kembali ke Admin Mode</span>
          </button>
        </div>
      )}

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
            isGuest={!authUser}
            onRequireLogin={(mode) => handleRequireAuth(mode)}
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
            isGuest={!authUser}
          />
        )}

        {currentPage === 'submit-recommendation' && (
          <SubmitRecommendationPage
            restaurants={restaurants}
            preselectedRestaurantId={preselectedReviewRestId}
            onAddSubmission={handleAddSubmission}
            onAddReview={handleAddReview}
            authUser={authUser}
            onRequireLogin={(mode) => handleRequireAuth(mode)}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            notice={loginNotice}
            onSuccess={(loggedInUser) => {
              if (
                loggedInUser.role === 'admin' ||
                loggedInUser.role === 'main_admin'
              ) {
                setAdminViewMode('admin');
                handleNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              const target =
                returnPage === 'login' ||
                returnPage === 'signup' ||
                returnPage === 'forgot-password'
                  ? 'home'
                  : returnPage;
              handleNavigate(target);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSignup={() => handleNavigate('signup')}
            onNavigateForgot={() => handleNavigate('forgot-password')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'signup' && (
          <SignUpPage
            onSuccess={() => {
              const target =
                returnPage === 'login' ||
                returnPage === 'signup' ||
                returnPage === 'forgot-password'
                  ? 'home'
                  : returnPage;
              handleNavigate(target);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateLogin={() => handleNavigate('login')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'forgot-password' && (
          <ForgotPasswordPage
            onResetSuccess={() => {
              setLoginNotice(a.forgot.successReset);
              handleNavigate('login');
            }}
            onNavigateLogin={() => handleNavigate('login')}
          />
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
