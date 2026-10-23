import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Utensils,
  Bookmark,
  Menu,
  X,
  Trash2,
  ArrowRight,
  Home,
  MessageSquarePlus,
  Globe,
} from 'lucide-react';
import { PageRoute, Restaurant } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface GlassHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  savedIds: string[];
  restaurants: Restaurant[];
  onSelectRestaurant: (id: string) => void;
  onRemoveSaved: (id: string) => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  currentPage,
  onNavigate,
  savedIds,
  restaurants,
  onSelectRestaurant,
  onRemoveSaved,
}) => {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);

  const navItems: {
    id: PageRoute;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: t.nav.home,
      shortLabel: t.nav.home,
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: 'directory',
      label: t.nav.directory,
      shortLabel: t.nav.directory,
      icon: <Compass className="h-4 w-4" />,
    },
    {
      id: 'restaurant-detail',
      label: t.nav.featuredSpot,
      shortLabel: lang === 'id' ? 'Ulasan' : 'Review',
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      id: 'editorial',
      label: t.nav.editorial,
      shortLabel: lang === 'id' ? 'Cerita' : 'Stories',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'submit-recommendation',
      label: t.nav.submitRecommendation,
      shortLabel: lang === 'id' ? 'Kirim Saran' : 'Recommend',
      icon: <MessageSquarePlus className="h-4 w-4" />,
    },
  ];

  const savedRestaurants = restaurants.filter((r) => savedIds.includes(r.id));

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2">
        <div className="mx-auto max-w-7xl">
          <div className="warm-glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-warm">
            {/* Brand Identity */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white shadow-md group-hover:bg-terracotta-dark transition-colors">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-charcoal-900 group-hover:text-terracotta transition-colors block leading-none">
                  Food Album
                </span>
                <p className="text-[11px] text-charcoal-600 mt-1 hidden sm:block">
                  {t.nav.brandSubtitle}
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary Navigation"
              className="hidden xl:flex items-center gap-1 rounded-xl bg-cream-100/90 p-1 border border-cream-200"
            >
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-terracotta text-white shadow-sm'
                        : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-white/70'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Language Toggle (ID/EN), Saved Album, Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Bilingual Language Toggle Switch (ID / EN) */}
              <div
                role="group"
                aria-label="Language Switcher"
                className="inline-flex items-center rounded-xl bg-cream-100 p-1 border border-cream-200"
              >
                <Globe className="h-3.5 w-3.5 text-terracotta ml-1.5 mr-1 hidden sm:inline" />
                <button
                  type="button"
                  onClick={() => setLang('id')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    lang === 'id'
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    lang === 'en'
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Saved Favorites Button */}
              <button
                type="button"
                onClick={() => setSavedDrawerOpen(true)}
                className="relative inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-cream-100 border border-cream-200 px-3 py-2 text-xs font-semibold text-charcoal-800 transition shadow-sm"
                aria-label={t.nav.savedAlbum}
              >
                <Bookmark className="h-4 w-4 text-terracotta" />
                <span className="hidden md:inline">{t.nav.savedAlbum}</span>
                <span className="rounded-full bg-terracotta-50 border border-terracotta/30 px-1.5 py-0.2 text-[11px] font-bold text-terracotta-dark">
                  {savedIds.length}
                </span>
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu"
                aria-expanded={mobileMenuOpen}
                className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-cream-200 text-charcoal-800 hover:bg-cream-100 transition"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Slide-Down Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-2 warm-card rounded-2xl p-4 shadow-warm-lg">
              <div className="grid grid-cols-1 gap-1.5">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-terracotta text-white'
                          : 'text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-900'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      <ArrowRight className="h-4 w-4 opacity-70" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Saved Favorites Drawer */}
      {savedDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-charcoal-900/40 backdrop-blur-sm p-3 sm:p-6"
          onClick={() => setSavedDrawerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white h-full max-h-[88vh] w-full max-w-md rounded-3xl p-6 flex flex-col justify-between border border-cream-200 shadow-warm-lg"
          >
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  {t.nav.savedAlbum} ({savedRestaurants.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSavedDrawerOpen(false)}
                className="h-9 w-9 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-charcoal-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {savedRestaurants.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="h-12 w-12 rounded-2xl bg-terracotta-50 border border-terracotta/20 flex items-center justify-center text-terracotta mb-3">
                    <Bookmark className="h-6 w-6" />
                  </div>
                  <p className="font-serif text-lg font-semibold text-charcoal-900 mb-1">
                    {t.nav.savedAlbumEmpty}
                  </p>
                  <p className="text-xs text-charcoal-600">{t.nav.savedAlbumHint}</p>
                </div>
              ) : (
                savedRestaurants.map((rest) => (
                  <div
                    key={rest.id}
                    className="flex items-center gap-3 rounded-2xl bg-cream-50 border border-cream-200 p-3 hover:border-terracotta/40 transition"
                  >
                    <img
                      src={rest.heroImage}
                      alt={rest.name}
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-olive-dark block">
                        {rest.neighborhood} • {rest.priceTier}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRestaurant(rest.id);
                          setSavedDrawerOpen(false);
                        }}
                        className="font-serif text-sm font-bold text-charcoal-900 hover:text-terracotta truncate block text-left w-full"
                      >
                        {rest.name}
                      </button>
                      <span className="text-xs text-charcoal-600 block">
                        {rest.estimatedPriceIdr}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveSaved(rest.id)}
                      aria-label={`Remove ${rest.name}`}
                      className="p-2 text-charcoal-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-cream-200 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSavedDrawerOpen(false);
                  handleNavClick('directory');
                }}
                className="rounded-xl bg-terracotta hover:bg-terracotta-dark px-5 py-2.5 text-xs font-semibold text-white transition"
              >
                {t.nav.exploreDirectory}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="xl:hidden fixed bottom-3 left-3 right-3 z-40 warm-glass rounded-2xl px-2 py-1.5 shadow-warm-lg flex items-center justify-around"
      >
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
