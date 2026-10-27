import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  Store,
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  NeighborhoodName,
  CuisineType,
  PriceTier,
  HalalStatus,
  Restaurant,
  CommunitySubmission,
  UserReview,
  AuthUser,
} from '../types';
import {
  NEIGHBORHOOD_NAMES,
  CUISINE_TYPES,
  PRICE_TIERS,
  HALAL_STATUS_OPTIONS,
  FOOD_PHOTO_PRESETS,
} from '../data/mockData';
import { FloatingCard } from '../components/FloatingCard';
import { GuestLock } from '../components/GuestLock';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuthText } from '../auth/authText';

interface SubmitRecommendationPageProps {
  restaurants: Restaurant[];
  preselectedRestaurantId?: string;
  onAddSubmission: (
    submission: Omit<CommunitySubmission, 'id' | 'submittedAt'>
  ) => void;
  onAddReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void;
  authUser?: AuthUser | null;
  onRequireLogin?: (mode: 'login' | 'signup') => void;
}

export const SubmitRecommendationPage: React.FC<
  SubmitRecommendationPageProps
> = ({
  restaurants,
  preselectedRestaurantId,
  onAddSubmission,
  onAddReview,
  authUser = null,
  onRequireLogin,
}) => {
  const { lang, t, translateCuisine, translateHalal } = useLanguage();
  const a = useAuthText();

  const [activeTab, setActiveTab] = useState<'new-spot' | 'new-review'>(
    preselectedRestaurantId ? 'new-review' : 'new-spot'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New Spot Form State
  const [spotName, setSpotName] = useState('');
  const [neighborhood, setNeighborhood] = useState<NeighborhoodName>('Sunter');
  const [cuisine, setCuisine] = useState<CuisineType>(
    'Bakmi & Mie Tradisional'
  );
  const [halalStatus, setHalalStatus] = useState<HalalStatus>('Halal');
  const [priceTier, setPriceTier] = useState<PriceTier>('$');
  const [estimatedPriceIdr, setEstimatedPriceIdr] = useState(
    'Rp 35.000 – Rp 65.000'
  );
  const [address, setAddress] = useState('');
  const [signatureDish, setSignatureDish] = useState('');
  const [reason, setReason] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');

  // New Review Form State
  const [selectedRestId, setSelectedRestId] = useState<string>(
    preselectedRestaurantId || restaurants[0]?.id || ''
  );
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [favoriteDish, setFavoriteDish] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (preselectedRestaurantId) {
      setSelectedRestId(preselectedRestaurantId);
      setActiveTab('new-review');
    }
  }, [preselectedRestaurantId]);

  useEffect(() => {
    if (authUser) {
      setSubmittedBy((prev) => prev || authUser.username);
      setSubmitterEmail((prev) => prev || authUser.email);
      setReviewerName((prev) => prev || authUser.username);
    }
  }, [authUser]);

  const handleFillSampleSpot = () => {
    setSpotName('Soto Betawi & Sate Maranggi Haji Ridwan');
    setNeighborhood('Sunter');
    setCuisine('Nusantara & Bakar Arang');
    setHalalStatus('Halal');
    setPriceTier('$$');
    setEstimatedPriceIdr('Rp 45.000 – Rp 80.000');
    setAddress('Jl. Danau Sunter Utara Blok F No. 11, Sunter, Jakarta');
    setSignatureDish('Soto Betawi Kuah Susu & Sate Sapi Maranggi');
    setReason(
      lang === 'id'
        ? 'Kuah sotonya gurih lembut menggunakan susu segar dan minyak samin, daging sapinya empuk serta porsinya mengenyangkan.'
        : 'Rich, aromatic milk-broth Soto Betawi with tender braised beef and flame-grilled Maranggi satay skewers.'
    );
    setSubmittedBy('Clarissa Putri');
    setSubmitterEmail('clarissa.putri@email.com');
  };

  const handleSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !spotName.trim() ||
      !address.trim() ||
      !signatureDish.trim() ||
      !reason.trim() ||
      !submittedBy.trim()
    ) {
      return;
    }

    const matchingPhoto =
      FOOD_PHOTO_PRESETS.find((p) =>
        cuisine.toLowerCase().includes(p.label.split(' ')[0].toLowerCase())
      )?.url || FOOD_PHOTO_PRESETS[0].url;

    onAddSubmission({
      restaurantName: spotName.trim(),
      neighborhood,
      cuisine,
      priceTier,
      estimatedPriceIdr: estimatedPriceIdr.trim() || 'Rp 40.000 – Rp 80.000',
      halalStatus,
      address: address.trim(),
      signatureDish: signatureDish.trim(),
      reason: reason.trim(),
      submittedBy: submittedBy.trim(),
      submitterEmail: submitterEmail.trim() || 'komunitas@foodalbum.id',
      photoUrl: matchingPhoto,
    });

    setSubmittedSuccess(true);
    setSpotName('');
    setAddress('');
    setSignatureDish('');
    setReason('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim() || !selectedRestId) {
      return;
    }

    const targetRest = restaurants.find((r) => r.id === selectedRestId);
    onAddReview({
      restaurantId: selectedRestId,
      restaurantName: targetRest ? targetRest.name : 'Restoran Pilihan',
      reviewerName: reviewerName.trim(),
      rating,
      favoriteDish: favoriteDish.trim() || '-',
      comment: reviewComment.trim(),
    });

    setSubmittedSuccess(true);
    setReviewerName('');
    setFavoriteDish('');
    setReviewComment('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-12">
      {/* Header Banner */}
      <section className="warm-card rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-terracotta-50 via-white to-olive-50">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-terracotta/25 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-dark shadow-sm">
            <MessageSquarePlus className="h-4 w-4 text-terracotta" />
            <span>{t.submit.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 leading-tight">
            {t.submit.title}
          </h1>

          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
            {t.submit.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Switcher */}
          <div className="inline-flex rounded-2xl bg-cream-100 p-1.5 border border-cream-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('new-spot');
                setSubmittedSuccess(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'new-spot'
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              <Store className="h-4 w-4" />
              <span>{t.submit.tabNewSpot}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('new-review');
                setSubmittedSuccess(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'new-review'
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'text-charcoal-700 hover:text-charcoal-900'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>{t.submit.tabNewReview}</span>
            </button>
          </div>

          {/* Friendly Curation Confirmation Message */}
          <GuestLock
            locked={!authUser}
            message={a.guest.submitLocked}
            onLogin={() => onRequireLogin?.('login')}
            onSignup={() => onRequireLogin?.('signup')}
          >
          <AnimatePresence mode="wait">
            {submittedSuccess ? (
              <motion.div
                key="success-box"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="warm-card rounded-3xl p-8 sm:p-10 bg-white border-2 border-olive/40 text-center space-y-5"
              >
                <div className="mx-auto h-16 w-16 rounded-2xl bg-olive-50 border border-olive/30 flex items-center justify-center text-olive">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                    {t.submit.successBannerTitle}
                  </h2>
                  <p className="text-base text-charcoal-700 font-medium leading-relaxed">
                    {t.submit.successBannerMessage}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 text-sm font-semibold transition shadow-sm"
                  >
                    <span>{t.submit.submitAnotherBtn}</span>
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'new-spot' ? (
              <FloatingCard
                key="spot-form"
                glowVariant="terracotta"
                className="p-6 sm:p-8 bg-white space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                    {t.submit.tabNewSpot}
                  </h2>
                  <button
                    type="button"
                    onClick={handleFillSampleSpot}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-olive-50 hover:bg-olive-100 border border-olive/30 px-3.5 py-2 text-xs font-semibold text-olive-dark transition self-start sm:self-auto"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t.submit.fillDemoBtn}</span>
                  </button>
                </div>

                <form onSubmit={handleSpotSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.spotNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={spotName}
                        onChange={(e) => setSpotName(e.target.value)}
                        placeholder={t.submit.spotNamePlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.neighborhoodLabel}
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) =>
                          setNeighborhood(e.target.value as NeighborhoodName)
                        }
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm font-medium text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {NEIGHBORHOOD_NAMES.map((nb) => (
                          <option key={nb} value={nb}>
                            {nb}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.cuisineLabel}
                      </label>
                      <select
                        value={cuisine}
                        onChange={(e) =>
                          setCuisine(e.target.value as CuisineType)
                        }
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm font-medium text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {CUISINE_TYPES.map((c) => (
                          <option key={c} value={c}>
                            {translateCuisine(c)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.halalStatusLabel}
                      </label>
                      <select
                        value={halalStatus}
                        onChange={(e) =>
                          setHalalStatus(e.target.value as HalalStatus)
                        }
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm font-medium text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {HALAL_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {translateHalal(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.priceTierLabel}
                      </label>
                      <select
                        value={priceTier}
                        onChange={(e) =>
                          setPriceTier(e.target.value as PriceTier)
                        }
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm font-medium text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {PRICE_TIERS.map((p) => (
                          <option key={p.tier} value={p.tier}>
                            {p.tier} ({p.rangeIdr})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.estPriceLabel}
                      </label>
                      <input
                        type="text"
                        value={estimatedPriceIdr}
                        onChange={(e) => setEstimatedPriceIdr(e.target.value)}
                        placeholder={t.submit.estPricePlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.addressLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t.submit.addressPlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.signatureDishLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={signatureDish}
                        onChange={(e) => setSignatureDish(e.target.value)}
                        placeholder={t.submit.signatureDishPlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-charcoal-800">
                      {t.submit.reasonLabel} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={t.submit.reasonPlaceholder}
                      className="w-full rounded-xl bg-cream-50 border border-cream-200 p-4 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.submitterNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={submittedBy}
                        onChange={(e) => setSubmittedBy(e.target.value)}
                        placeholder={t.submit.submitterNamePlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.submitterEmailLabel}
                      </label>
                      <input
                        type="email"
                        value={submitterEmail}
                        onChange={(e) => setSubmitterEmail(e.target.value)}
                        placeholder={t.submit.submitterEmailPlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all"
                    >
                      <Send className="h-4 w-4" />
                      <span>{t.submit.submitSpotBtn}</span>
                    </button>
                  </div>
                </form>
              </FloatingCard>
            ) : (
              <FloatingCard
                key="review-form"
                glowVariant="olive"
                className="p-6 sm:p-8 bg-white space-y-6"
              >
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                    {t.submit.tabNewReview}
                  </h2>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.selectRestaurantLabel}
                      </label>
                      <select
                        value={selectedRestId}
                        onChange={(e) => setSelectedRestId(e.target.value)}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-3 text-sm font-medium text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {restaurants.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} ({r.neighborhood})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.reviewerNameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder={t.submit.submitterNamePlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.ratingLabel}
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`h-10 w-10 rounded-xl border flex items-center justify-center transition ${
                              star <= rating
                                ? 'bg-terracotta-50 border-terracotta text-terracotta'
                                : 'bg-cream-50 border-cream-200 text-charcoal-500'
                            }`}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= rating ? 'fill-terracotta' : ''
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-charcoal-800">
                        {t.submit.favDishLabel}
                      </label>
                      <input
                        type="text"
                        value={favoriteDish}
                        onChange={(e) => setFavoriteDish(e.target.value)}
                        placeholder={t.submit.favDishPlaceholder}
                        className="w-full rounded-xl bg-cream-50 border border-cream-200 px-4 py-3 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-charcoal-800">
                      {t.submit.reviewCommentLabel} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={t.submit.reviewCommentPlaceholder}
                      className="w-full rounded-xl bg-cream-50 border border-cream-200 p-4 text-sm text-charcoal-900 placeholder-charcoal-500 focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all"
                    >
                      <Send className="h-4 w-4" />
                      <span>{t.submit.submitReviewBtn}</span>
                    </button>
                  </div>
                </form>
              </FloatingCard>
            )}
          </AnimatePresence>
          </GuestLock>
        </div>

        {/* Right Sidebar: How Community Curation Works */}
        <aside className="lg:col-span-4 space-y-6">
          <FloatingCard glowVariant="olive" className="p-6 bg-white space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-olive-dark">
              <ShieldCheck className="h-4 w-4 text-olive" />
              <span>{t.submit.curationStepsTitle}</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  {t.submit.step1Title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {t.submit.step1Desc}
                </p>
              </div>

              <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  {t.submit.step2Title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {t.submit.step2Desc}
                </p>
              </div>

              <div className="rounded-2xl bg-olive-50 border border-olive/25 p-4 space-y-1">
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  {t.submit.step3Title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {t.submit.step3Desc}
                </p>
              </div>
            </div>
          </FloatingCard>
        </aside>
      </div>
    </div>
  );
};
