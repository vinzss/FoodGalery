import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Bookmark,
  Clock,
  Sparkles,
  Quote,
  Compass,
  Copy,
  Check,
  ExternalLink,
  Utensils,
  Users,
  MessageSquarePlus,
  Images,
} from 'lucide-react';
import { Restaurant, NeighborhoodName, UserReview } from '../types';
import { FloatingCard } from '../components/FloatingCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { HalalBadge } from '../components/HalalBadge';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { useLanguage } from '../i18n/LanguageContext';

interface RestaurantDetailPageProps {
  restaurant: Restaurant;
  allRestaurants: Restaurant[];
  reviews: UserReview[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectRestaurant: (id: string) => void;
  onBackToDirectory: (neighborhood?: NeighborhoodName) => void;
  onNavigateSubmit: (preselectedRestaurantId?: string) => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  restaurant,
  allRestaurants,
  reviews,
  savedIds,
  onToggleSave,
  onSelectRestaurant,
  onBackToDirectory,
  onNavigateSubmit,
}) => {
  const { t, localize, translateCuisine } = useLanguage();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [restaurant.id]);

  const isSaved = savedIds.includes(restaurant.id);
  const spotReviews = reviews.filter((r) => r.restaurantId === restaurant.id);

  const gallery =
    restaurant.gallery.length > 0
      ? restaurant.gallery
      : [
          {
            url: restaurant.heroImage,
            caption: restaurant.tagline,
          },
        ];

  const currentPhoto = gallery[activePhotoIndex] || gallery[0];

  const relatedRestaurants = allRestaurants
    .filter(
      (r) =>
        r.id !== restaurant.id &&
        (r.neighborhood === restaurant.neighborhood ||
          r.cuisine === restaurant.cuisine)
    )
    .slice(0, 3);

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(restaurant.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-12">
      {/* Top Breadcrumb & Quick Spot Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onBackToDirectory()}
            className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-cream-100 border border-cream-200 px-4 py-2 text-xs font-semibold text-charcoal-800 shadow-sm transition"
          >
            <ArrowLeft className="h-4 w-4 text-terracotta" />
            <span>{t.detail.backToDirectory}</span>
          </button>

          <button
            type="button"
            onClick={() => onBackToDirectory(restaurant.neighborhood)}
            className="text-xs font-bold text-olive-dark hover:text-terracotta transition flex items-center gap-1"
          >
            <MapPin className="h-3.5 w-3.5 text-terracotta" />
            <span>{restaurant.neighborhood}</span>
          </button>
        </div>

        {/* Quick Restaurant Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-charcoal-600 hidden sm:inline">
            {t.detail.switchSpot}
          </span>
          <select
            aria-label="Switch restaurant"
            value={restaurant.id}
            onChange={(e) => onSelectRestaurant(e.target.value)}
            className="rounded-xl bg-white border border-cream-200 px-3.5 py-2 text-xs font-semibold text-charcoal-800 shadow-sm focus:outline-none focus:border-terracotta cursor-pointer"
          >
            {allRestaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.neighborhood})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Title, Halal Certification Badge & Price Summary */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Prominent Halal / Non-Halal / Belum Ada Sertifikasi Badge */}
              <HalalBadge status={restaurant.halalStatus} size="md" />

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${
                  restaurant.isVerified
                    ? 'bg-olive text-white'
                    : 'bg-terracotta-50 border border-terracotta/30 text-terracotta-dark'
                }`}
              >
                {restaurant.isVerified ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <Users className="h-3.5 w-3.5" />
                )}
                {restaurant.isVerified
                  ? t.card.verifiedBadge
                  : t.card.communityBadge}
              </span>

              <span className="rounded-full bg-cream-100 border border-cream-200 px-3.5 py-1 text-xs font-semibold text-charcoal-700">
                {translateCuisine(restaurant.cuisine)}
              </span>

              {restaurant.isSponsored && (
                <span className="rounded-full bg-terracotta px-3 py-1 text-xs font-semibold text-white flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {t.card.sponsoredBadge}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 leading-tight">
              {restaurant.name}
            </h1>

            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
              {localize(restaurant.tagline)}
            </p>
          </div>

          {/* Price & Save Summary Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 warm-card rounded-2xl p-4 bg-white shrink-0">
            <div className="pr-4 border-r border-cream-200">
              <span className="block text-[11px] uppercase tracking-wider text-charcoal-500 font-semibold">
                {t.detail.estPriceLabel}
              </span>
              <span className="text-base sm:text-lg font-bold text-terracotta-dark">
                {restaurant.estimatedPriceIdr}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-2">
                <div className="flex items-center gap-1 text-lg font-bold text-charcoal-900">
                  <Star className="h-4 w-4 fill-terracotta text-terracotta" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => onToggleSave(restaurant.id, e)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all border ${
                  isSaved
                    ? 'bg-terracotta text-white border-terracotta shadow-sm'
                    : 'bg-cream-50 hover:bg-cream-100 text-charcoal-800 border-cream-200'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>
                  {isSaved ? t.detail.savedSpot : t.detail.saveSpot}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY (Supports up to 10 Uploaded Gallery Photos!) */}
        <div className="space-y-4">
          <FloatingCard
            glowVariant="terracotta"
            className="overflow-hidden p-3 bg-white"
          >
            <div className="relative h-80 sm:h-[440px] w-full rounded-xl overflow-hidden bg-cream-100">
              <img
                src={currentPhoto.url}
                alt={localize(currentPhoto.caption)}
                className="h-full w-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-charcoal-800 shadow-sm flex items-center gap-1.5">
                <Images className="h-3.5 w-3.5 text-terracotta" />
                <span>
                  {activePhotoIndex + 1} / {gallery.length}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur-md p-3.5 shadow-sm">
                <p className="text-xs sm:text-sm text-charcoal-900 font-medium">
                  {localize(currentPhoto.caption)}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip for up to 10 Gallery Photos */}
            {gallery.length > 1 && (
              <div className="mt-3 pt-3 border-t border-cream-200">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
                    {t.detail.galleryTitle} ({gallery.length})
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
                  {gallery.slice(0, 10).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activePhotoIndex === idx
                          ? 'border-terracotta shadow-sm scale-[1.03]'
                          : 'border-cream-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={localize(img.caption)}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </FloatingCard>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols): Menu & Prices, Editorial Review, Diner Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* Dynamic Food Menu & Prices Section with Halal Status per Menu Item */}
          <FloatingCard glowVariant="terracotta" className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-dark flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5" />
                  {t.detail.signatureDishesTag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
                  {t.detail.signatureDishesTitle} ({restaurant.signatureDishes.length})
                </h2>
              </div>
              <HalalBadge status={restaurant.halalStatus} size="sm" />
            </div>

            <div className="space-y-3.5">
              {restaurant.signatureDishes.map((dish, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-cream-50 border border-cream-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-terracotta/40 transition"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-charcoal-900">
                        {dish.name}
                      </h3>
                      <HalalBadge
                        status={dish.halalStatus || restaurant.halalStatus}
                        size="sm"
                      />
                      {dish.isPopular && (
                        <span className="rounded-full bg-terracotta-100 px-2.5 py-0.5 text-[11px] font-semibold text-terracotta-dark">
                          {t.detail.popularDish}
                        </span>
                      )}
                    </div>
                    {localize(dish.description) && (
                      <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                        {localize(dish.description)}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 sm:text-right border-t sm:border-t-0 border-cream-200 pt-2 sm:pt-0">
                    <span className="text-base sm:text-lg font-bold text-terracotta-dark block">
                      {dish.priceIdr}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      {t.detail.estDishPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FloatingCard>

          {/* Editorial Review Card */}
          <FloatingCard glowVariant="olive" className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-olive-dark block">
                  {t.detail.editorialReviewTag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
                  {t.detail.editorialReviewTitle}
                </h2>
              </div>
              <div className="text-right text-xs text-charcoal-500">
                <span className="block text-charcoal-900 font-bold">
                  {t.detail.byAuthor} {restaurant.editorialReview.author}
                </span>
                <span>{localize(restaurant.editorialReview.authorRole)}</span>
              </div>
            </div>

            <div className="relative rounded-2xl bg-terracotta-50/80 border border-terracotta/25 p-5 sm:p-6">
              <Quote className="h-7 w-7 text-terracotta/50 mb-2" />
              <p className="font-serif text-lg sm:text-xl italic text-charcoal-900 leading-relaxed">
                “{localize(restaurant.editorialReview.verdict)}”
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-charcoal-700 leading-relaxed">
              <p>{localize(restaurant.editorialSummary)}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 space-y-1.5">
                  <span className="text-xs uppercase tracking-wider text-terracotta-dark font-bold">
                    {t.detail.atmosphereTitle}
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {localize(restaurant.editorialReview.atmosphere)}
                  </p>
                </div>

                <div className="rounded-2xl bg-olive-50 border border-olive/25 p-4 space-y-1.5">
                  <span className="text-xs uppercase tracking-wider text-olive-dark font-bold">
                    {t.detail.insiderTipTitle}
                  </span>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {localize(restaurant.editorialReview.insiderTip)}
                  </p>
                </div>
              </div>
            </div>
          </FloatingCard>

          {/* Diner Reviews Section */}
          <FloatingCard glowVariant="neutral" className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  {t.detail.userReviewsTitle} ({spotReviews.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateSubmit(restaurant.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 text-xs font-semibold transition shadow-sm self-start sm:self-auto"
              >
                <MessageSquarePlus className="h-4 w-4" />
                <span>{t.detail.writeReviewBtn}</span>
              </button>
            </div>

            {spotReviews.length === 0 ? (
              <p className="text-sm text-charcoal-500 py-4">
                {t.detail.noReviewsYet}
              </p>
            ) : (
              <div className="space-y-4">
                {spotReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl bg-cream-50 border border-cream-200 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-charcoal-900">
                          {rev.reviewerName}
                        </span>
                        <span className="text-xs text-charcoal-500">
                          • {rev.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 border border-cream-200 text-xs font-bold text-charcoal-900">
                        <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {rev.favoriteDish && rev.favoriteDish !== '-' && (
                      <p className="text-xs font-semibold text-olive-dark">
                        {t.detail.favoriteDishLabel} {rev.favoriteDish}
                      </p>
                    )}

                    <p className="text-sm text-charcoal-700 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </FloatingCard>
        </div>

        {/* Right Column (4 Cols): Location Card, Vibe Tags & Partner Spotlight */}
        <div className="lg:col-span-4 space-y-6">
          <FloatingCard glowVariant="terracotta" className="overflow-hidden p-6 space-y-5 bg-white">
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <Compass className="h-4 w-4 text-terracotta" />
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                {t.detail.locationTitle}
              </span>
            </div>

            {/* Clean Visual Map Card */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 flex flex-col justify-between p-4">
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                viewBox="0 0 400 220"
                fill="none"
              >
                <path
                  d="M0 45 Q 130 70, 240 40 T 400 55"
                  stroke="#637048"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <path
                  d="M35 220 L 150 55 L 360 115"
                  stroke="#D96C45"
                  strokeWidth="2.5"
                />
                <circle cx="200" cy="110" r="42" stroke="#D96C45" strokeOpacity="0.35" />
              </svg>

              <div className="relative z-10">
                <span className="inline-block rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-olive-dark shadow-sm">
                  {restaurant.neighborhood}
                </span>
              </div>

              <div className="relative z-10 my-auto mx-auto flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-terracotta text-white flex items-center justify-center shadow-md border-2 border-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="mt-2 rounded-lg bg-white px-3 py-1 font-serif text-xs font-bold text-charcoal-900 shadow-sm">
                  {restaurant.name}
                </span>
              </div>

              <div className="relative z-10 text-center">
                <span className="text-[11px] font-medium text-charcoal-700 bg-white/90 px-2.5 py-0.5 rounded">
                  {localize(restaurant.nearbyLandmark)}
                </span>
              </div>
            </div>

            {/* Practical Address & Hours */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[11px] uppercase text-charcoal-500 font-semibold block">
                    {t.detail.streetAddress}
                  </span>
                  <p className="text-charcoal-800 font-medium leading-relaxed">
                    {restaurant.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-olive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[11px] uppercase text-charcoal-500 font-semibold block">
                    {t.detail.openingHours}
                  </span>
                  <p className="text-charcoal-800 font-medium">
                    {localize(restaurant.openingHours)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-800 transition"
              >
                {copiedAddress ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-olive" />
                    <span>{t.detail.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-charcoal-600" />
                    <span>{t.detail.copyAddress}</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${restaurant.name} ${restaurant.neighborhood} Jakarta`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark px-3 py-2.5 text-xs font-semibold text-white transition shadow-sm"
              >
                <span>{t.detail.openGoogleMaps}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </FloatingCard>

          <div className="warm-card rounded-2xl p-5 space-y-3 bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-olive-dark block">
              {t.detail.vibeTagsTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.vibeTags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-cream-100 px-3 py-1 text-xs font-medium text-charcoal-700"
                >
                  {localize(tag)}
                </span>
              ))}
            </div>
          </div>

          <AdPlaceholder
            variant="rectangle"
            onPartnerClick={() => onNavigateSubmit()}
          />
        </div>
      </div>

      {/* Related Restaurants */}
      <section className="space-y-6 pt-8 border-t border-cream-200">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            {t.detail.relatedTitle}
          </h3>
          <button
            type="button"
            onClick={() => onBackToDirectory(restaurant.neighborhood)}
            className="text-xs font-bold text-terracotta hover:underline"
          >
            {t.detail.seeAllNeighborhood} {restaurant.neighborhood} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedRestaurants.map((rel, idx) => (
            <RestaurantCard
              key={rel.id}
              restaurant={rel}
              delay={idx * 0.06}
              onSelect={onSelectRestaurant}
              isSaved={savedIds.includes(rel.id)}
              onToggleSave={onToggleSave}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  );
};
