import React, { useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  UtensilsCrossed,
  ShieldCheck,
  ArrowUpDown,
  X,
  MessageSquarePlus,
} from 'lucide-react';
import {
  Restaurant,
  NeighborhoodName,
  CuisineType,
  PriceTier,
  HalalStatus,
} from '../types';
import {
  NEIGHBORHOOD_NAMES,
  CUISINE_TYPES,
  PRICE_TIERS,
  HALAL_STATUS_OPTIONS,
} from '../data/mockData';
import { RestaurantCard } from '../components/RestaurantCard';
import { FloatingCard } from '../components/FloatingCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { useLanguage } from '../i18n/LanguageContext';

export type SortOption = 'featured' | 'rating' | 'price-asc' | 'price-desc';
export type VerificationFilter = 'All' | 'verified' | 'community';

interface DirectoryPageProps {
  restaurants: Restaurant[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedNeighborhood: NeighborhoodName | 'All';
  onNeighborhoodChange: (nb: NeighborhoodName | 'All') => void;
  selectedCuisine: CuisineType | 'All';
  onCuisineChange: (c: CuisineType | 'All') => void;
  selectedPrice: PriceTier | 'All';
  onPriceChange: (p: PriceTier | 'All') => void;
  selectedVerification: VerificationFilter;
  onVerificationChange: (v: VerificationFilter) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  onResetFilters: () => void;
  onSelectRestaurant: (id: string) => void;
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onNavigateSubmit: () => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  restaurants,
  searchQuery,
  onSearchChange,
  selectedNeighborhood,
  onNeighborhoodChange,
  selectedCuisine,
  onCuisineChange,
  selectedPrice,
  onPriceChange,
  selectedVerification,
  onVerificationChange,
  sortBy,
  onSortChange,
  onResetFilters,
  onSelectRestaurant,
  savedIds,
  onToggleSave,
  onNavigateSubmit,
}) => {
  const { t, localize, translateCuisine, translateHalal } = useLanguage();
  const [selectedHalal, setSelectedHalal] = useState<HalalStatus | 'All'>('All');

  const filteredRestaurants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = restaurants.filter((rest) => {
      const matchesNeighborhood =
        selectedNeighborhood === 'All' ||
        rest.neighborhood === selectedNeighborhood;
      const matchesCuisine =
        selectedCuisine === 'All' || rest.cuisine === selectedCuisine;
      const matchesPrice =
        selectedPrice === 'All' || rest.priceTier === selectedPrice;
      const matchesHalal =
        selectedHalal === 'All' || rest.halalStatus === selectedHalal;
      const matchesVerification =
        selectedVerification === 'All' ||
        (selectedVerification === 'verified' && rest.isVerified) ||
        (selectedVerification === 'community' && !rest.isVerified);

      const matchesSearch =
        !q ||
        rest.name.toLowerCase().includes(q) ||
        localize(rest.tagline).toLowerCase().includes(q) ||
        rest.neighborhood.toLowerCase().includes(q) ||
        rest.subArea.toLowerCase().includes(q) ||
        translateCuisine(rest.cuisine).toLowerCase().includes(q) ||
        rest.signatureDishes.some((d) => d.name.toLowerCase().includes(q));

      return (
        matchesNeighborhood &&
        matchesCuisine &&
        matchesPrice &&
        matchesHalal &&
        matchesVerification &&
        matchesSearch
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.minPriceIdr - b.minPriceIdr;
      if (sortBy === 'price-desc') return b.minPriceIdr - a.minPriceIdr;
      return (
        (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating
      );
    });
  }, [
    restaurants,
    searchQuery,
    selectedNeighborhood,
    selectedCuisine,
    selectedPrice,
    selectedHalal,
    selectedVerification,
    sortBy,
    localize,
    translateCuisine,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedNeighborhood !== 'All' ||
    selectedCuisine !== 'All' ||
    selectedPrice !== 'All' ||
    selectedHalal !== 'All' ||
    selectedVerification !== 'All';

  const handleFullReset = () => {
    setSelectedHalal('All');
    onResetFilters();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-10">
      {/* Directory Header & Filter Box */}
      <section className="warm-card rounded-3xl p-6 sm:p-10 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 border border-terracotta/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-terracotta-dark">
              <MapPin className="h-3.5 w-3.5 text-terracotta" />
              <span>{t.directory.badge}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 leading-tight">
              {t.directory.title}
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
              {t.directory.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-xl bg-cream-100 border border-cream-200 px-4 py-2.5 text-charcoal-800">
              {t.directory.showing}{' '}
              <strong className="text-terracotta-dark">
                {filteredRestaurants.length}
              </strong>{' '}
              {t.directory.of} {restaurants.length} {t.directory.spots}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleFullReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta-50 hover:bg-terracotta text-terracotta-dark hover:text-white border border-terracotta/30 px-4 py-2.5 font-semibold transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t.directory.clearAll}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Matrix */}
        <div className="mt-8 space-y-5 pt-6 border-t border-cream-200">
          {/* Row 1: Search + Halal Status + Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative flex items-center rounded-xl bg-cream-50 border border-cream-200 px-4 py-2.5 focus-within:border-terracotta transition">
              <Search className="h-4 w-4 text-charcoal-500 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.directory.searchPlaceholder}
                className="w-full bg-transparent text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="text-charcoal-500 hover:text-charcoal-900 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Halal Certification Filter */}
            <div className="md:col-span-3 flex items-center rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700 mr-2 shrink-0" />
              <select
                aria-label="Filter by halal certification"
                value={selectedHalal}
                onChange={(e) =>
                  setSelectedHalal(e.target.value as HalalStatus | 'All')
                }
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-charcoal-800 focus:outline-none cursor-pointer"
              >
                <option value="All">{t.directory.allHalal}</option>
                {HALAL_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {translateHalal(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="md:col-span-3 flex items-center rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5">
              <ArrowUpDown className="h-4 w-4 text-terracotta mr-2 shrink-0" />
              <select
                aria-label="Sort restaurants"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-charcoal-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">{t.directory.sortFeatured}</option>
                <option value="rating">{t.directory.sortRating}</option>
                <option value="price-asc">{t.directory.sortPriceLow}</option>
                <option value="price-desc">{t.directory.sortPriceHigh}</option>
              </select>
            </div>
          </div>

          {/* Row 2: 5 Target Jakarta Neighborhood Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-terracotta" />
              {t.directory.neighborhoodLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNeighborhoodChange('All')}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  selectedNeighborhood === 'All'
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                }`}
              >
                {t.directory.allSectors} ({restaurants.length})
              </button>
              {NEIGHBORHOOD_NAMES.map((nb) => {
                const count = restaurants.filter(
                  (r) => r.neighborhood === nb
                ).length;
                const active = selectedNeighborhood === nb;
                return (
                  <button
                    key={nb}
                    type="button"
                    onClick={() => onNeighborhoodChange(nb)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    <span>{nb}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        active
                          ? 'bg-white/25 text-white'
                          : 'bg-cream-200/70 text-charcoal-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Cuisine & Price Tier Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
            {/* Cuisine Pills */}
            <div className="lg:col-span-7 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-olive" />
                {t.directory.cuisineLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onCuisineChange('All')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCuisine === 'All'
                      ? 'bg-olive text-white shadow-sm'
                      : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  {t.directory.allCuisines}
                </button>
                {CUISINE_TYPES.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => onCuisineChange(cuisine)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedCuisine === cuisine
                        ? 'bg-olive text-white shadow-sm'
                        : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    {translateCuisine(cuisine)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier Pills */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600 block">
                {t.directory.priceLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onPriceChange('All')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedPrice === 'All'
                      ? 'bg-terracotta text-white'
                      : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  {t.directory.anyPrice}
                </button>
                {PRICE_TIERS.map((p) => (
                  <button
                    key={p.tier}
                    type="button"
                    onClick={() => onPriceChange(p.tier)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedPrice === p.tier
                        ? 'bg-terracotta text-white'
                        : 'bg-cream-50 text-charcoal-700 border border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    {p.tier} ({p.rangeIdr})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid OR Empty State */}
      {filteredRestaurants.length === 0 ? (
        <FloatingCard
          glowVariant="olive"
          className="py-16 px-6 text-center max-w-2xl mx-auto my-8 space-y-6 bg-white"
        >
          <div className="mx-auto h-20 w-20 rounded-3xl bg-terracotta-50 border border-terracotta/25 flex items-center justify-center text-terracotta">
            <UtensilsCrossed className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">
              {t.directory.emptyTitle}
            </h2>
            <p className="text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
              {t.directory.emptyDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleFullReset}
              className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark px-5 py-3 text-sm font-semibold text-white shadow-sm transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t.directory.resetBtn}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-cream-100 hover:bg-cream-200 px-5 py-3 text-sm font-semibold text-charcoal-800 transition"
            >
              <MessageSquarePlus className="h-4 w-4 text-terracotta" />
              <span>{t.directory.suggestBtn}</span>
            </button>
          </div>
        </FloatingCard>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant, idx) => (
              <React.Fragment key={restaurant.id}>
                <RestaurantCard
                  restaurant={restaurant}
                  delay={idx * 0.04}
                  onSelect={onSelectRestaurant}
                  isSaved={savedIds.includes(restaurant.id)}
                  onToggleSave={onToggleSave}
                />
                {idx === 2 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <AdPlaceholder
                      variant="leaderboard"
                      onPartnerClick={onNavigateSubmit}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
