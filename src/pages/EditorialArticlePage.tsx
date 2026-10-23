import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Sparkles,
  Share2,
  Check,
  MapPin,
  Star,
  ArrowUpRight,
  Bookmark,
  Quote,
  ListOrdered,
  ShieldCheck,
} from 'lucide-react';
import {
  EditorialArticle,
  Restaurant,
  NeighborhoodName,
} from '../types';
import { FloatingCard } from '../components/FloatingCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { useLanguage } from '../i18n/LanguageContext';

interface EditorialArticlePageProps {
  article: EditorialArticle;
  allArticles: EditorialArticle[];
  restaurants: Restaurant[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectArticle: (id: string) => void;
  onSelectRestaurant: (id: string) => void;
  onNavigateDirectory: (neighborhood?: NeighborhoodName) => void;
  onNavigateSubmit: () => void;
}

export const EditorialArticlePage: React.FC<EditorialArticlePageProps> = ({
  article,
  allArticles,
  restaurants,
  savedIds,
  onToggleSave,
  onSelectArticle,
  onSelectRestaurant,
  onNavigateDirectory,
  onNavigateSubmit,
}) => {
  const { t, localize, translateCuisine } = useLanguage();
  const [activeTocId, setActiveTocId] = useState<string>(
    article.sections[0]?.id || ''
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    setActiveTocId(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-12">
      {/* Top Issue Switcher Bar */}
      <div className="warm-card rounded-2xl p-3 sm:p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive-dark">
          <BookOpen className="h-4 w-4 text-terracotta" />
          <span>{t.editorial.issueHeader}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allArticles.map((art, i) => {
            const isCurrent = art.id === article.id;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  onSelectArticle(art.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'bg-cream-50 text-charcoal-700 hover:bg-cream-100 border border-cream-200'
                }`}
              >
                <span className="opacity-75">0{i + 1}.</span>
                <span className="truncate max-w-[200px] sm:max-w-[240px]">
                  {localize(art.title).split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Magazine Hero Header */}
      <header className="space-y-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-cream-100 border border-cream-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-olive-dark">
              {localize(article.category)}
            </span>

            {article.isSponsored ? (
              <span className="rounded-full bg-terracotta px-3.5 py-1 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {t.editorial.sponsoredTag}
              </span>
            ) : (
              <span className="rounded-full bg-olive-50 border border-olive/30 px-3.5 py-1 text-xs font-semibold text-olive-dark flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t.editorial.independentTag}
              </span>
            )}

            {article.neighborhoodFocus.map((nb) => (
              <button
                key={nb}
                type="button"
                onClick={() => onNavigateDirectory(nb)}
                className="rounded-full bg-white hover:bg-terracotta-50 border border-cream-200 px-3 py-1 text-xs font-semibold text-charcoal-700 hover:text-terracotta-dark transition flex items-center gap-1"
              >
                <MapPin className="h-3 w-3 text-terracotta" />
                {nb}
              </button>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 leading-[1.12] tracking-tight">
            {localize(article.title)}
          </h1>

          <p className="text-base sm:text-xl text-charcoal-600 leading-relaxed max-w-3xl mx-auto">
            {localize(article.subtitle)}
          </p>

          {/* Author & Metadata Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-left border-t border-cream-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-terracotta/40"
              />
              <div>
                <span className="text-sm font-bold text-charcoal-900 block">
                  {article.author.name}
                </span>
                <span className="text-xs text-olive-dark font-medium">
                  {localize(article.author.role)}
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-cream-200 hidden sm:block" />

            <div className="text-xs text-charcoal-600 space-y-0.5">
              <span className="block">
                {t.editorial.publishedOn} {localize(article.publishedDate)}
              </span>
              <span className="flex items-center gap-1 font-semibold text-terracotta-dark">
                <Clock className="h-3 w-3" /> {localize(article.readTime)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-cream-100 border border-cream-200 px-3.5 py-2 text-xs font-semibold text-charcoal-800 shadow-sm transition"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-olive" />
                  <span>{t.editorial.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-terracotta" />
                  <span>{t.editorial.shareStory}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Feature Cover Image */}
        <FloatingCard glowVariant="terracotta" className="overflow-hidden p-3 bg-white">
          <figure className="relative">
            <div className="h-72 sm:h-[450px] w-full rounded-xl overflow-hidden bg-cream-100">
              <img
                src={article.heroImage}
                alt={localize(article.title)}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 px-2 text-xs text-charcoal-500">
              {localize(article.heroCaption)}
            </figcaption>
          </figure>
        </FloatingCard>
      </header>

      {/* Main Magazine 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Sticky Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <FloatingCard glowVariant="olive" className="p-5 sm:p-6 space-y-4 bg-white">
            <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
              <ListOrdered className="h-4 w-4 text-terracotta" />
              <h2 className="text-xs uppercase tracking-wider text-charcoal-900 font-bold">
                {t.editorial.tocTitle}
              </h2>
            </div>

            <nav aria-label="Table of Contents" className="space-y-2">
              {article.sections.map((sec) => {
                const active = activeTocId === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleScrollToSection(sec.id)}
                    className={`w-full text-left rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-terracotta-50 text-terracotta-dark border border-terracotta/30'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-50'
                    }`}
                  >
                    {localize(sec.heading)}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-cream-200 space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-terracotta-dark font-bold block">
                {t.editorial.disclosureTitle}
              </span>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {article.isSponsored
                  ? t.editorial.sponsoredDisclosure
                  : t.editorial.independentDisclosure}
              </p>
            </div>
          </FloatingCard>

          {/* Author Bio Card */}
          <div className="warm-card rounded-2xl p-5 bg-white space-y-2">
            <span className="text-xs uppercase tracking-wider text-olive-dark font-bold block">
              {t.editorial.aboutWriter}
            </span>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              {localize(article.author.bio)}
            </p>
          </div>

          <AdPlaceholder
            variant="rectangle"
            onPartnerClick={onNavigateSubmit}
          />
        </aside>

        {/* Right Editorial Narrative Body */}
        <div className="lg:col-span-8 space-y-12">
          {article.sections.map((section, idx) => {
            const embeddedRestaurant = section.embeddedRestaurantId
              ? restaurants.find((r) => r.id === section.embeddedRestaurantId)
              : undefined;

            const isSaved = embeddedRestaurant
              ? savedIds.includes(embeddedRestaurant.id)
              : false;

            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 space-y-6"
              >
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 leading-snug border-l-4 border-terracotta pl-4">
                  {localize(section.heading)}
                </h2>

                <div className="space-y-4 text-base sm:text-lg text-charcoal-700 leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className={
                        idx === 0 && pIdx === 0
                          ? 'first-letter:float-left first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-terracotta first-letter:mr-3 first-letter:leading-none'
                          : ''
                      }
                    >
                      {localize(p)}
                    </p>
                  ))}
                </div>

                {section.pullQuote && (
                  <blockquote className="my-8 rounded-3xl bg-terracotta-50 border border-terracotta/25 p-6 sm:p-8 shadow-warm">
                    <Quote className="h-8 w-8 text-terracotta mb-3" />
                    <p className="font-serif text-xl sm:text-2xl italic text-charcoal-900 leading-relaxed mb-3">
                      “{localize(section.pullQuote.quote)}”
                    </p>
                    <footer className="text-xs font-bold text-olive-dark">
                      — {section.pullQuote.attribution}
                    </footer>
                  </blockquote>
                )}

                {embeddedRestaurant && (
                  <FloatingCard
                    glowVariant="terracotta"
                    onClick={() => onSelectRestaurant(embeddedRestaurant.id)}
                    className="group my-6 overflow-hidden p-5 bg-white border border-terracotta/25"
                  >
                    <div className="flex items-center justify-between border-b border-cream-200 pb-3 mb-4">
                      <span className="rounded-md bg-terracotta-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-terracotta-dark">
                        {t.editorial.featuredInChapter}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => onToggleSave(embeddedRestaurant.id, e)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          isSaved
                            ? 'bg-terracotta text-white'
                            : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
                        }`}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        <span>
                          {isSaved ? t.detail.savedSpot : t.detail.saveSpot}
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                      <div className="relative h-44 sm:h-auto sm:w-48 rounded-xl overflow-hidden shrink-0 bg-cream-100">
                        <img
                          src={embeddedRestaurant.heroImage}
                          alt={embeddedRestaurant.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-charcoal-900 flex items-center gap-1 shadow-sm">
                          <Star className="h-3 w-3 fill-terracotta text-terracotta" />
                          <span>{embeddedRestaurant.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-600">
                            <MapPin className="h-3.5 w-3.5 text-terracotta" />
                            <span>{embeddedRestaurant.neighborhood}</span>
                            <span>•</span>
                            <span className="text-olive-dark">
                              {translateCuisine(embeddedRestaurant.cuisine)}
                            </span>
                          </div>

                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 group-hover:text-terracotta transition-colors">
                            {embeddedRestaurant.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-charcoal-600">
                            {localize(embeddedRestaurant.tagline)}
                          </p>
                        </div>

                        {embeddedRestaurant.signatureDishes[0] && (
                          <div className="rounded-xl bg-cream-50 border border-cream-200 p-3 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-olive-dark block">
                                {t.editorial.editorDishPick}
                              </span>
                              <span className="text-xs font-semibold text-charcoal-900">
                                {embeddedRestaurant.signatureDishes[0].name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-terracotta-dark shrink-0">
                              {embeddedRestaurant.signatureDishes[0].priceIdr}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-charcoal-900">
                            {embeddedRestaurant.estimatedPriceIdr}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-terracotta group-hover:translate-x-1 transition-transform">
                            <span>{t.editorial.openFullReview}</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </FloatingCard>
                )}

                {idx === 0 && (
                  <AdPlaceholder
                    variant="article-inline"
                    onPartnerClick={onNavigateSubmit}
                  />
                )}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
};
