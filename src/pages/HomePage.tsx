import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  Clock,
  ShieldCheck,
  Flame,
  Layers,
  ChevronRight,
  MessageSquarePlus,
} from 'lucide-react';
import {
  NeighborhoodInfo,
  NeighborhoodName,
  Restaurant,
  CuratedCollection,
  EditorialArticle,
  CuisineType,
} from '../types';
import { FloatingCard } from '../components/FloatingCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { HalalBadge } from '../components/HalalBadge';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { useLanguage } from '../i18n/LanguageContext';

interface HomePageProps {
  neighborhoods: NeighborhoodInfo[];
  restaurants: Restaurant[];
  collections: CuratedCollection[];
  articles: EditorialArticle[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectRestaurant: (id: string) => void;
  onSelectArticle: (id: string) => void;
  onNavigateDirectory: (filters?: {
    search?: string;
    neighborhood?: NeighborhoodName | 'All';
    cuisine?: CuisineType | 'All';
  }) => void;
  onNavigateSubmit: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  neighborhoods,
  restaurants,
  collections,
  articles,
  savedIds,
  onToggleSave,
  onSelectRestaurant,
  onSelectArticle,
  onNavigateDirectory,
  onNavigateSubmit,
}) => {
  const { lang, t, localize, translateCuisine } = useLanguage();
  const [heroSearch, setHeroSearch] = useState('');
  const [heroNeighborhood, setHeroNeighborhood] = useState<
    NeighborhoodName | 'All'
  >('All');

  const featuredRestaurants = restaurants.slice(0, 4);
  const coverRestaurant = restaurants[0];

  const quickSuggestions = heroSearch.trim()
    ? restaurants.filter(
        (r) =>
          (heroNeighborhood === 'All' || r.neighborhood === heroNeighborhood) &&
          (r.name.toLowerCase().includes(heroSearch.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(heroSearch.toLowerCase()) ||
            localize(r.tagline)
              .toLowerCase()
              .includes(heroSearch.toLowerCase()) ||
            r.neighborhood.toLowerCase().includes(heroSearch.toLowerCase()))
      )
    : [];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateDirectory({
      search: heroSearch,
      neighborhood: heroNeighborhood,
    });
  };

  const popularCravings: {
    label: string;
    query: string;
    neighborhood?: NeighborhoodName;
  }[] = [
    {
      label:
        lang === 'id'
          ? '🍜 Mie Hokkien & Kopi Sunter'
          : '🍜 Hokkien Noodles & Coffee Sunter',
      query: '',
      neighborhood: 'Sunter',
    },
    {
      label:
        lang === 'id'
          ? '🥢 Bakmi Karet Kelapa Gading'
          : '🥢 Handmade Noodles Kelapa Gading',
      query: 'Bakmi',
      neighborhood: 'Kelapa Gading',
    },
    {
      label:
        lang === 'id'
          ? '🍲 Soto Betawi Kemayoran'
          : '🍲 Soto Betawi Kemayoran',
      query: 'Soto',
      neighborhood: 'Kemayoran',
    },
    {
      label:
        lang === 'id'
          ? '🔥 Kwetiau Malam Mangga Besar'
          : '🔥 Night Flat Noodles Mangga Besar',
      query: 'Kwetiau',
      neighborhood: 'Mangga Besar',
    },
    {
      label:
        lang === 'id'
          ? '🍛 Nasi Kapau Senen'
          : '🍛 Nasi Kapau Senen',
      query: 'Kapau',
      neighborhood: 'Senen',
    },
  ];

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <div className="space-y-20 pb-12">
      {/* 1. WARM HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-terracotta/10 blur-[110px]" />
        <div className="pointer-events-none absolute top-24 right-1/4 h-96 w-96 rounded-full bg-olive/10 blur-[110px]" />

        <div className="mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Masthead & Search */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta-50 border border-terracotta/25 px-4 py-1.5"
              >
                <span className="flex h-2 w-2 rounded-full bg-terracotta" />
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-dark">
                  {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-[1.1]"
              >
                {t.hero.titleStart}{' '}
                <span className="italic font-normal text-gradient-terracotta">
                  {t.hero.titleHighlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-2xl"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* Warm Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="relative z-20 pt-1"
              >
                <form
                  onSubmit={handleHeroSubmit}
                  className="warm-card rounded-2xl p-2 sm:p-2.5 shadow-warm-lg hover:border-terracotta/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Neighborhood Dropdown */}
                    <div className="relative flex items-center gap-2 rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5 sm:w-48 shrink-0">
                      <MapPin className="h-4 w-4 text-terracotta shrink-0" />
                      <select
                        aria-label="Filter by neighborhood"
                        value={heroNeighborhood}
                        onChange={(e) =>
                          setHeroNeighborhood(
                            e.target.value as NeighborhoodName | 'All'
                          )
                        }
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-charcoal-800 focus:outline-none cursor-pointer"
                      >
                        <option value="All">{t.hero.allNeighborhoods}</option>
                        {neighborhoods.map((nb) => (
                          <option key={nb.name} value={nb.name}>
                            {nb.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 flex items-center px-3 py-2">
                      <Search className="h-4 w-4 text-charcoal-500 mr-2.5 shrink-0" />
                      <input
                        type="text"
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        placeholder={t.hero.searchPlaceholder}
                        className="w-full bg-transparent text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none"
                      />
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark px-6 py-3 text-sm font-semibold text-white shadow-md transition-all shrink-0"
                    >
                      <span>{t.hero.searchBtn}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Instant Search Preview Dropdown */}
                {quickSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 warm-card rounded-2xl p-3 shadow-warm-lg z-30 space-y-2">
                    <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                      {t.hero.instantMatches} ({quickSuggestions.length})
                    </div>
                    {quickSuggestions.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectRestaurant(item.id)}
                        className="w-full flex items-center justify-between gap-3 rounded-xl bg-cream-50 hover:bg-terracotta-50 p-2.5 text-left transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.heroImage}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-serif text-sm font-bold text-charcoal-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-olive-dark truncate">
                              {item.neighborhood} •{' '}
                              {translateCuisine(item.cuisine)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <HalalBadge status={item.halalStatus} size="sm" />
                          <span className="text-xs font-bold text-terracotta-dark">
                            {item.estimatedPriceIdr}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Quick Craving Pills */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-charcoal-600 block">
                  {t.hero.trendingLabel}
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularCravings.map((craving) => (
                    <button
                      key={craving.label}
                      type="button"
                      onClick={() =>
                        onNavigateDirectory({
                          search: craving.query,
                          neighborhood: craving.neighborhood || 'All',
                        })
                      }
                      className="rounded-full bg-white hover:bg-terracotta-50 border border-cream-200 hover:border-terracotta/40 px-3.5 py-1.5 text-xs font-medium text-charcoal-700 hover:text-terracotta-dark transition-all shadow-sm"
                    >
                      {craving.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Appetizing Food Showcase */}
            {coverRestaurant && (
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <FloatingCard
                    glowVariant="terracotta"
                    onClick={() => onSelectRestaurant(coverRestaurant.id)}
                    className="overflow-hidden p-3 bg-white"
                  >
                    <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden">
                      <img
                        src={coverRestaurant.heroImage}
                        alt={coverRestaurant.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-terracotta px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                          {t.hero.coverSpotlight}
                        </span>
                        <HalalBadge
                          status={coverRestaurant.halalStatus}
                          size="sm"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                        <span className="text-xs font-medium text-cream-100">
                          {coverRestaurant.neighborhood} •{' '}
                          {coverRestaurant.estimatedPriceIdr}
                        </span>
                        <h2 className="font-serif text-2xl font-bold">
                          {coverRestaurant.name}
                        </h2>
                        <p className="text-xs text-cream-100/90 line-clamp-2">
                          {localize(coverRestaurant.tagline)}
                        </p>
                      </div>
                    </div>
                  </FloatingCard>

                  {/* Floating Editorial Promise Badge */}
                  <div className="hidden sm:flex absolute -bottom-5 -left-4 warm-card rounded-2xl p-3.5 border border-olive/30 shadow-warm-lg items-center gap-3 max-w-[250px]">
                    <div className="h-10 w-10 rounded-xl bg-olive-50 border border-olive/30 flex items-center justify-center text-olive shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-olive-dark block">
                        {t.hero.editorialPromiseTitle}
                      </span>
                      <p className="text-[11px] text-charcoal-600 leading-tight">
                        {t.hero.editorialPromiseDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. NEIGHBORHOOD SELECTOR (5 TARGET AREAS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive-dark mb-2">
              <Compass className="h-4 w-4 text-terracotta" />
              <span>{t.home.neighborhoodTag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {t.home.neighborhoodTitle}
            </h2>
          </div>
          <p className="text-sm text-charcoal-600 max-w-md">
            {t.home.neighborhoodSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((nb, idx) => {
            const spotCount = restaurants.filter(
              (r) => r.neighborhood === nb.name
            ).length;
            return (
              <FloatingCard
                key={nb.name}
                delay={idx * 0.05}
                glowVariant="terracotta"
                onClick={() => onNavigateDirectory({ neighborhood: nb.name })}
                className="group relative overflow-hidden flex flex-col justify-between p-5 bg-white"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-terracotta transition-colors">
                    {nb.name}
                  </h3>
                  <span className="rounded-full bg-terracotta-50 border border-terracotta/25 px-3 py-1 text-xs font-semibold text-terracotta-dark">
                    {spotCount} {t.home.spotsAvailable}
                  </span>
                </div>

                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-cream-100">
                  <img
                    src={nb.heroImage}
                    alt={nb.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-charcoal-800">
                    {localize(nb.tagline)}
                  </p>
                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {localize(nb.description)}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {nb.signatureCravings.map((dish, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-charcoal-700"
                      >
                        {localize(dish)}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs font-bold text-terracotta">
                    <span>
                      {t.home.browseNeighborhood} {nb.name}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </FloatingCard>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED RESTAURANTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark mb-2">
              <Flame className="h-4 w-4 text-terracotta" />
              <span>{t.home.featuredTag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {t.home.featuredTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateDirectory({ neighborhood: 'All' })}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-terracotta text-charcoal-800 hover:text-white border border-cream-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
          >
            <span>
              {t.home.viewAllDirectory} ({restaurants.length})
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant, idx) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              delay={idx * 0.06}
              onSelect={onSelectRestaurant}
              isSaved={savedIds.includes(restaurant.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </section>

      {/* 4. SPONSORED PARTNER BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder variant="leaderboard" onPartnerClick={onNavigateSubmit} />
      </section>

      {/* 5. CURATED FOOD COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive-dark mb-2">
              <Layers className="h-4 w-4 text-olive" />
              <span>{t.home.collectionsTag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {t.home.collectionsTitle}
            </h2>
          </div>
          <p className="text-sm text-charcoal-600 max-w-md">
            {t.home.collectionsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col, idx) => (
            <FloatingCard
              key={col.id}
              delay={idx * 0.06}
              glowVariant="olive"
              onClick={() =>
                onNavigateDirectory({
                  neighborhood: col.filterNeighborhood || 'All',
                  cuisine: col.filterCuisine || 'All',
                })
              }
              className="group relative overflow-hidden p-5 sm:p-6 flex flex-col sm:flex-row items-stretch gap-5 bg-white"
            >
              <div className="relative h-48 sm:h-auto sm:w-44 rounded-xl overflow-hidden shrink-0 bg-cream-100">
                <img
                  src={col.coverImage}
                  alt={localize(col.title)}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-terracotta-dark bg-terracotta-50 px-2.5 py-0.5 rounded-md">
                    {localize(col.tag)}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 group-hover:text-terracotta transition-colors leading-snug">
                    {localize(col.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    {localize(col.subtitle)}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-xs text-charcoal-500">{col.curator}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-olive-dark group-hover:text-terracotta transition">
                    <span>{t.home.openCollection}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </FloatingCard>
          ))}
        </div>
      </section>

      {/* 6. LATEST EDITORIAL STORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-cream-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark mb-2">
              <BookOpen className="h-4 w-4 text-terracotta" />
              <span>{t.home.editorialTag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {t.home.editorialTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectArticle(leadArticle.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-olive text-charcoal-800 hover:text-white border border-cream-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
          >
            <span>{t.home.readMagazine}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lead Feature Article */}
          <div className="lg:col-span-7">
            <FloatingCard
              glowVariant="terracotta"
              onClick={() => onSelectArticle(leadArticle.id)}
              className="group overflow-hidden h-full flex flex-col justify-between bg-white"
            >
              <div className="relative h-72 sm:h-96 overflow-hidden bg-cream-100">
                <img
                  src={leadArticle.heroImage}
                  alt={localize(leadArticle.title)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-charcoal-900 shadow-sm">
                    {localize(leadArticle.category)}
                  </span>
                  {leadArticle.isSponsored && (
                    <span className="rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold text-white flex items-center gap-1 shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {t.editorial.sponsoredTag}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-charcoal-500 font-medium">
                    <span>{localize(leadArticle.publishedDate)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-olive-dark">
                      <Clock className="h-3.5 w-3.5" />
                      {localize(leadArticle.readTime)}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 group-hover:text-terracotta transition-colors leading-tight">
                    {localize(leadArticle.title)}
                  </h3>
                  <p className="text-sm text-charcoal-600 leading-relaxed">
                    {localize(leadArticle.subtitle)}
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={leadArticle.author.avatar}
                      alt={leadArticle.author.name}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-terracotta/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal-900 block">
                        {leadArticle.author.name}
                      </span>
                      <span className="text-[11px] text-charcoal-500">
                        {localize(leadArticle.author.role)}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta group-hover:translate-x-1 transition-transform">
                    <span>{t.home.readFullStory}</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </FloatingCard>
          </div>

          {/* Side Articles + Community Curation Callout */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {sideArticles.map((art, idx) => (
              <FloatingCard
                key={art.id}
                delay={idx * 0.08}
                glowVariant="olive"
                onClick={() => onSelectArticle(art.id)}
                className="group p-5 flex flex-col sm:flex-row gap-4 items-stretch bg-white"
              >
                <div className="relative h-40 sm:h-auto sm:w-36 rounded-xl overflow-hidden shrink-0 bg-cream-100">
                  <img
                    src={art.heroImage}
                    alt={localize(art.title)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-olive-dark block">
                      {localize(art.category)}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-terracotta transition-colors leading-snug">
                      {localize(art.title)}
                    </h4>
                    <p className="text-xs text-charcoal-600 line-clamp-2">
                      {localize(art.subtitle)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-xs text-charcoal-500">
                    <span>{art.author.name}</span>
                    <span className="font-semibold text-terracotta">
                      {localize(art.readTime)} →
                    </span>
                  </div>
                </div>
              </FloatingCard>
            ))}

            {/* Community Recommendation Invitation Card */}
            <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 via-white to-olive-50 border border-terracotta/30 p-6 shadow-warm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark">
                <MessageSquarePlus className="h-4 w-4 text-terracotta" />
                <span>{t.submit.badge}</span>
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal-900">
                {t.home.communityBannerTitle}
              </h4>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                {t.home.communityBannerDesc}
              </p>
              <button
                type="button"
                onClick={onNavigateSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 text-xs font-semibold transition shadow-sm"
              >
                <span>{t.home.communityBannerBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
