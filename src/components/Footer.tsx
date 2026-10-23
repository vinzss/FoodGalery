import React from 'react';
import {
  Utensils,
  MapPin,
  MessageSquarePlus,
  ArrowUpRight,
} from 'lucide-react';
import { NeighborhoodName, PageRoute } from '../types';
import { NEIGHBORHOOD_NAMES } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onSelectNeighborhood: (neighborhood: NeighborhoodName) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectNeighborhood,
}) => {
  const { t } = useLanguage();

  const handleJump = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-cream-200 bg-cream-100/80 pb-24 xl:pb-12 pt-14 text-charcoal-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-cream-200">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white shadow-sm">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-charcoal-900 tracking-tight block">
                  Food Album
                </span>
                <span className="text-xs font-medium text-olive-dark">
                  {t.nav.brandSubtitle}
                </span>
              </div>
            </div>

            <p className="text-sm text-charcoal-600 leading-relaxed max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Col 2: Jakarta Neighborhoods */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold">
              {t.footer.neighborhoodsTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              {NEIGHBORHOOD_NAMES.map((nb) => (
                <li key={nb}>
                  <button
                    type="button"
                    onClick={() => onSelectNeighborhood(nb)}
                    className="inline-flex items-center gap-2 text-charcoal-600 hover:text-terracotta transition font-medium"
                  >
                    <MapPin className="h-3.5 w-3.5 text-terracotta" />
                    <span>{nb}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Platform Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold">
              {t.footer.navigationTitle}
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleJump('home')}
                  className="text-charcoal-600 hover:text-terracotta transition"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleJump('directory')}
                  className="text-charcoal-600 hover:text-terracotta transition"
                >
                  {t.nav.directory}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleJump('restaurant-detail')}
                  className="text-charcoal-600 hover:text-terracotta transition"
                >
                  {t.nav.featuredSpot}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleJump('editorial')}
                  className="text-charcoal-600 hover:text-terracotta transition"
                >
                  {t.nav.editorial}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community Curation Callout */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold">
              {t.footer.communityTitle}
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {t.footer.communityText}
            </p>
            <button
              type="button"
              onClick={() => handleJump('submit-recommendation')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-4 py-2.5 text-xs font-semibold transition-all shadow-sm"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span>{t.nav.submitRecommendation}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
