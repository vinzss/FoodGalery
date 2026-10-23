import React from 'react';
import {
  MapPin,
  Star,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Users,
} from 'lucide-react';
import { Restaurant } from '../types';
import { FloatingCard } from './FloatingCard';
import { HalalBadge } from './HalalBadge';
import { useLanguage } from '../i18n/LanguageContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurantId: string) => void;
  isSaved?: boolean;
  onToggleSave?: (restaurantId: string, e: React.MouseEvent) => void;
  compact?: boolean;
  delay?: number;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isSaved = false,
  onToggleSave,
  compact = false,
  delay = 0,
}) => {
  const { t, localize, translateCuisine } = useLanguage();

  return (
    <FloatingCard
      as="article"
      delay={delay}
      glowVariant={restaurant.isVerified ? 'terracotta' : 'olive'}
      onClick={() => onSelect(restaurant.id)}
      className="group relative flex flex-col overflow-hidden h-full bg-white"
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${
          compact ? 'h-48' : 'h-56 sm:h-60'
        } w-full bg-cream-100`}
      >
        <img
          src={restaurant.heroImage}
          alt={restaurant.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/65 via-charcoal-900/10 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-charcoal-900 shadow-sm flex items-center gap-1">
              <MapPin className="h-3 w-3 text-terracotta" />
              {restaurant.neighborhood}
            </span>

            {restaurant.isSponsored && (
              <span className="rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white flex items-center gap-1 shadow-sm">
                <Sparkles className="h-2.5 w-2.5" />
                {t.card.sponsoredBadge}
              </span>
            )}
          </div>

          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => onToggleSave(restaurant.id, e)}
              aria-label={isSaved ? 'Remove from saved' : 'Save restaurant'}
              className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                isSaved
                  ? 'bg-terracotta text-white'
                  : 'bg-white/90 text-charcoal-700 hover:bg-white hover:text-terracotta'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Bottom Image Overlay: Halal Certification Badge & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <HalalBadge status={restaurant.halalStatus} size="sm" />

          <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-charcoal-900 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-olive-dark truncate">
              {translateCuisine(restaurant.cuisine)}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                  restaurant.isVerified
                    ? 'bg-olive-50 text-olive-dark'
                    : 'bg-cream-100 text-charcoal-700'
                }`}
              >
                {restaurant.isVerified ? (
                  <ShieldCheck className="h-3 w-3 text-olive" />
                ) : (
                  <Users className="h-3 w-3 text-terracotta" />
                )}
                {restaurant.isVerified
                  ? t.card.verifiedBadge
                  : t.card.communityBadge}
              </span>
              <span className="rounded-md bg-cream-100 px-2 py-0.5 text-charcoal-800 font-semibold">
                {restaurant.priceTier}
              </span>
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-terracotta transition-colors leading-snug">
            {restaurant.name}
          </h3>

          <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-2 leading-relaxed">
            {localize(restaurant.tagline)}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-cream-200 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-charcoal-500 font-medium">
              {t.card.estPrice}
            </span>
            <span className="text-xs sm:text-sm font-bold text-charcoal-900">
              {restaurant.estimatedPriceIdr}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-xl bg-cream-100 group-hover:bg-terracotta px-3.5 py-2 text-xs font-semibold text-charcoal-800 group-hover:text-white transition-all duration-200">
            <span>{t.card.exploreBtn}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </FloatingCard>
  );
};
