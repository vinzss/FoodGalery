import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  Trash2,
  MapPin,
  Star,
  Store,
  ShieldCheck,
  Upload,
  X,
  Utensils,
  Edit3,
  Images,
  AlertCircle,
} from 'lucide-react';
import {
  Restaurant,
  NeighborhoodName,
  CuisineType,
  PriceTier,
  HalalStatus,
  SignatureDish,
  GalleryImage,
} from '../types';
import {
  NEIGHBORHOOD_NAMES,
  CUISINE_TYPES,
  PRICE_TIERS,
  HALAL_STATUS_OPTIONS,
  FOOD_PHOTO_PRESETS,
} from '../data/mockData';
import { HalalBadge } from '../components/HalalBadge';
import { useLanguage } from '../i18n/LanguageContext';

export interface UmkmFormPayload {
  editingId?: string;
  name: string;
  neighborhood: NeighborhoodName;
  cuisine: CuisineType;
  priceTier: PriceTier;
  estimatedPriceIdr: string;
  halalStatus: HalalStatus;
  address: string;
  description: string;
  heroImage: string;
  gallery: GalleryImage[];
  signatureDishes: SignatureDish[];
}

interface MenuInputRow {
  name: string;
  priceIdr: string;
  description: string;
  halalStatus: HalalStatus;
}

interface UmkmManagerProps {
  restaurants: Restaurant[];
  onSaveRestaurant: (payload: UmkmFormPayload) => void;
  onDeleteRestaurant: (restaurantId: string) => void;
}

const MAX_GALLERY_PHOTOS = 10;

export const UmkmManager: React.FC<UmkmManagerProps> = ({
  restaurants,
  onSaveRestaurant,
  onDeleteRestaurant,
}) => {
  const { lang, t, localize, translateCuisine, translateHalal } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState<NeighborhoodName>('Sunter');
  const [cuisine, setCuisine] = useState<CuisineType>(
    'Bakmi & Mie Tradisional'
  );
  const [priceTier, setPriceTier] = useState<PriceTier>('$');
  const [estimatedPriceIdr, setEstimatedPriceIdr] = useState(
    'Rp 35.000 – Rp 65.000'
  );
  const [halalStatus, setHalalStatus] = useState<HalalStatus>('Halal');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState(FOOD_PHOTO_PRESETS[0].url);

  // Gallery Photos State (Max 10 photos outside the main cover photo)
  const [galleryPhotos, setGalleryPhotos] = useState<
    { url: string; caption: string }[]
  >([]);
  const [galleryError, setGalleryError] = useState('');

  // Dynamic Food Menu & Prices State
  const [menuRows, setMenuRows] = useState<MenuInputRow[]>([
    {
      name: '',
      priceIdr: 'Rp 45.000',
      description: '',
      halalStatus: 'Halal',
    },
  ]);

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setNeighborhood('Sunter');
    setCuisine('Bakmi & Mie Tradisional');
    setPriceTier('$');
    setEstimatedPriceIdr('Rp 35.000 – Rp 65.000');
    setHalalStatus('Halal');
    setAddress('');
    setDescription('');
    setHeroImage(FOOD_PHOTO_PRESETS[0].url);
    setGalleryPhotos([]);
    setGalleryError('');
    setMenuRows([
      {
        name: '',
        priceIdr: 'Rp 45.000',
        description: '',
        halalStatus: 'Halal',
      },
    ]);
  };

  const handleStartEdit = (rest: Restaurant) => {
    setEditingId(rest.id);
    setName(rest.name);
    setNeighborhood(rest.neighborhood);
    setCuisine(rest.cuisine);
    setPriceTier(rest.priceTier);
    setEstimatedPriceIdr(rest.estimatedPriceIdr);
    setHalalStatus(rest.halalStatus);
    setAddress(rest.address);
    setDescription(localize(rest.editorialSummary));
    setHeroImage(rest.heroImage);
    setGalleryPhotos(
      rest.gallery.slice(0, MAX_GALLERY_PHOTOS).map((g) => ({
        url: g.url,
        caption: localize(g.caption),
      }))
    );
    setGalleryError('');
    setMenuRows(
      rest.signatureDishes.length > 0
        ? rest.signatureDishes.map((d) => ({
            name: d.name,
            priceIdr: d.priceIdr,
            description: localize(d.description),
            halalStatus: d.halalStatus || rest.halalStatus,
          }))
        : [
            {
              name: '',
              priceIdr: 'Rp 45.000',
              description: '',
              halalStatus: rest.halalStatus,
            },
          ]
    );
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  // Handle Multi-Image File Upload (Up to 10 Photos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryError('');
    const remainingSlots = MAX_GALLERY_PHOTOS - galleryPhotos.length;

    if (remainingSlots <= 0) {
      setGalleryError(t.admin.galleryLimitReached);
      e.target.value = '';
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setGalleryError(t.admin.galleryLimitReached);
    }

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGalleryPhotos((prev) => {
            if (prev.length >= MAX_GALLERY_PHOTOS) return prev;
            return [
              ...prev,
              {
                url: reader.result as string,
                caption: file.name.replace(/\.[^/.]+$/, ''),
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddSampleGalleryPhoto = () => {
    if (galleryPhotos.length >= MAX_GALLERY_PHOTOS) {
      setGalleryError(t.admin.galleryLimitReached);
      return;
    }
    setGalleryError('');
    const nextPreset =
      FOOD_PHOTO_PRESETS[galleryPhotos.length % FOOD_PHOTO_PRESETS.length];
    setGalleryPhotos((prev) => [
      ...prev,
      {
        url: nextPreset.url,
        caption: `${name || 'Galeri Kuliner'} — Foto #${prev.length + 1}`,
      },
    ]);
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGalleryError('');
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMenuRow = () => {
    setMenuRows((prev) => [
      ...prev,
      {
        name: '',
        priceIdr: 'Rp 35.000',
        description: '',
        halalStatus,
      },
    ]);
  };

  const handleRemoveMenuRow = (index: number) => {
    if (menuRows.length <= 1) return;
    setMenuRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuRowChange = (
    index: number,
    field: keyof MenuInputRow,
    value: string
  ) => {
    setMenuRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMenus = menuRows.filter((m) => m.name.trim() !== '');
    if (!name.trim() || !address.trim() || validMenus.length === 0) return;

    const formattedDishes: SignatureDish[] = validMenus.map((m, idx) => ({
      name: m.name.trim(),
      priceIdr: m.priceIdr.trim() || 'Rp 40.000',
      description: {
        id:
          m.description.trim() ||
          `Hidangan ${m.name.trim()} pilihan khas ${name.trim()}.`,
        en:
          m.description.trim() ||
          `Signature ${m.name.trim()} prepared fresh at ${name.trim()}.`,
      },
      halalStatus: m.halalStatus,
      isPopular: idx === 0,
    }));

    const formattedGallery: GalleryImage[] =
      galleryPhotos.length > 0
        ? galleryPhotos.slice(0, MAX_GALLERY_PHOTOS).map((g) => ({
            url: g.url,
            caption: {
              id: g.caption || name.trim(),
              en: g.caption || name.trim(),
            },
          }))
        : [
            {
              url: heroImage,
              caption: {
                id: `${formattedDishes[0].name} — ${name.trim()}`,
                en: `${formattedDishes[0].name} — ${name.trim()}`,
              },
            },
          ];

    onSaveRestaurant({
      editingId,
      name: name.trim(),
      neighborhood,
      cuisine,
      priceTier,
      estimatedPriceIdr: estimatedPriceIdr.trim() || 'Rp 40.000 – Rp 75.000',
      halalStatus,
      address: address.trim(),
      description:
        description.trim() ||
        (lang === 'id'
          ? 'Tempat makan pilihan dengan cita rasa autentik dan suasana nyaman.'
          : 'Curated local dining spot serving authentic flavors in a welcoming space.'),
      heroImage,
      gallery: formattedGallery,
      signatureDishes: formattedDishes,
    });

    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Add / Edit UMKM, Dynamic Menu & 10-Photo Gallery Upload (6 Cols) */}
      <div className="lg:col-span-6 warm-card rounded-2xl p-6 bg-white space-y-6">
        <div className="flex items-start justify-between gap-3 border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark">
              <Store className="h-4 w-4 text-terracotta" />
              <span>{editingId ? 'Edit Mode' : 'UMKM Onboarding'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
              {editingId ? t.admin.umkmEditTitle : t.admin.umkmAddTitle}
            </h2>
            <p className="text-xs text-charcoal-600 mt-1">
              {t.admin.umkmAddDesc}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-cream-100 hover:bg-cream-200 px-3 py-1.5 text-xs font-bold text-charcoal-700 transition shrink-0"
            >
              {t.admin.cancelEditBtn}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Restaurant Info */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800">
              {t.submit.spotNameLabel} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bakmi Karet & Pangsit Sunter Jaya"
              className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-charcoal-800">
                {t.submit.neighborhoodLabel}
              </label>
              <select
                value={neighborhood}
                onChange={(e) =>
                  setNeighborhood(e.target.value as NeighborhoodName)
                }
                className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
              >
                {NEIGHBORHOOD_NAMES.map((nb) => (
                  <option key={nb} value={nb}>
                    {nb}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-charcoal-800">
                {t.submit.halalStatusLabel}
              </label>
              <select
                value={halalStatus}
                onChange={(e) => setHalalStatus(e.target.value as HalalStatus)}
                className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
              >
                {HALAL_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {translateHalal(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-charcoal-800">
                {t.submit.priceTierLabel}
              </label>
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value as PriceTier)}
                className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
              >
                {PRICE_TIERS.map((p) => (
                  <option key={p.tier} value={p.tier}>
                    {p.tier} ({p.rangeIdr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-charcoal-800">
                {t.submit.cuisineLabel}
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value as CuisineType)}
                className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
              >
                {CUISINE_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {translateCuisine(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-charcoal-800">
                {t.submit.estPriceLabel}
              </label>
              <input
                type="text"
                value={estimatedPriceIdr}
                onChange={(e) => setEstimatedPriceIdr(e.target.value)}
                className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800">
              {t.submit.addressLabel} *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Danau Sunter Utara Blok G No. 12, Jakarta"
              className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3.5 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800">
              {t.admin.photoPresetLabel}
            </label>
            <select
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
            >
              {FOOD_PHOTO_PRESETS.map((preset) => (
                <option key={preset.url} value={preset.url}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800">
              Deskripsi Singkat Tempat Makan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan keunggulan rasa dan suasana tempat makan ini..."
              className="w-full rounded-xl bg-cream-50 border border-cream-200 p-3 text-sm text-charcoal-900 focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* SECTION: DYNAMIC FOOD MENU & PRICE MANAGEMENT */}
          <div className="rounded-2xl bg-cream-50 border border-cream-200 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-terracotta" />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  {t.admin.menuSectionTitle} ({menuRows.length})
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddMenuRow}
                className="inline-flex items-center gap-1 rounded-lg bg-terracotta hover:bg-terracotta-dark text-white px-3 py-1.5 text-xs font-bold transition shadow-sm"
              >
                <span>{t.admin.addMenuRowBtn}</span>
              </button>
            </div>

            <div className="space-y-3">
              {menuRows.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-cream-200 p-3 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-terracotta-dark">
                      Menu #{idx + 1}
                    </span>
                    {menuRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuRow(idx)}
                        className="text-charcoal-400 hover:text-red-600 p-0.5"
                        title="Hapus baris menu"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        required
                        value={row.name}
                        onChange={(e) =>
                          handleMenuRowChange(idx, 'name', e.target.value)
                        }
                        placeholder={t.admin.menuNamePlaceholder}
                        className="w-full rounded-lg bg-cream-50 border border-cream-200 px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        value={row.priceIdr}
                        onChange={(e) =>
                          handleMenuRowChange(idx, 'priceIdr', e.target.value)
                        }
                        placeholder={t.admin.menuPricePlaceholder}
                        className="w-full rounded-lg bg-cream-50 border border-cream-200 px-3 py-2 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={row.halalStatus}
                        onChange={(e) =>
                          handleMenuRowChange(
                            idx,
                            'halalStatus',
                            e.target.value as HalalStatus
                          )
                        }
                        className="w-full rounded-lg bg-cream-50 border border-cream-200 px-2.5 py-2 text-xs font-semibold text-charcoal-900 focus:outline-none focus:border-terracotta"
                      >
                        {HALAL_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {translateHalal(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) =>
                      handleMenuRowChange(idx, 'description', e.target.value)
                    }
                    placeholder={t.admin.menuDescPlaceholder}
                    className="w-full rounded-lg bg-cream-50 border border-cream-200 px-3 py-1.5 text-xs text-charcoal-700 focus:outline-none focus:border-terracotta"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: GALLERY IMAGE UPLOAD (MAX 10 PHOTOS) */}
          <div className="rounded-2xl bg-olive-50/70 border border-olive/25 p-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Images className="h-4 w-4 text-olive" />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  {t.admin.gallerySectionTitle}
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  galleryPhotos.length >= MAX_GALLERY_PHOTOS
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white text-olive-dark border border-olive/30'
                }`}
              >
                {galleryPhotos.length} / {MAX_GALLERY_PHOTOS} Foto
              </span>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              {t.admin.gallerySectionHint}
            </p>

            {galleryError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 flex items-center gap-2 text-xs font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{galleryError}</span>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={galleryPhotos.length >= MAX_GALLERY_PHOTOS}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-olive hover:bg-olive-dark disabled:opacity-50 text-white px-4 py-2 text-xs font-bold transition shadow-sm"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{t.admin.uploadGalleryBtn}</span>
              </button>

              <button
                type="button"
                disabled={galleryPhotos.length >= MAX_GALLERY_PHOTOS}
                onClick={handleAddSampleGalleryPhoto}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-cream-100 disabled:opacity-50 border border-cream-200 text-charcoal-800 px-3.5 py-2 text-xs font-bold transition"
              >
                <span>{t.admin.addSampleGalleryBtn}</span>
              </button>
            </div>

            {/* Thumbnail Grid of Uploaded Gallery Photos */}
            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 pt-2">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group h-16 rounded-xl overflow-hidden border border-cream-200 bg-white"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-charcoal-900/75 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryPhoto(idx)}
                      aria-label="Hapus foto galeri"
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white px-5 py-3.5 text-sm font-bold shadow-md transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>
              {editingId ? t.admin.updateUmkmBtn : t.admin.addUmkmBtn}
            </span>
          </button>
        </form>
      </div>

      {/* Right Column: Existing UMKM List with Edit & Delete Options (6 Cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="border-b border-cream-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            {t.admin.umkmListTitle} ({restaurants.length})
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-0.5">
            {t.admin.umkmListDesc}
          </p>
        </div>

        <div className="space-y-3">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className={`warm-card rounded-2xl p-4 bg-white flex flex-col gap-3 border-2 transition ${
                editingId === rest.id
                  ? 'border-terracotta bg-terracotta-50/20'
                  : 'border-cream-200'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={rest.heroImage}
                  alt={rest.name}
                  className="h-20 w-20 rounded-xl object-cover shrink-0 bg-cream-100"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-dark">
                      <MapPin className="h-3 w-3" />
                      {rest.neighborhood}
                    </span>
                    <HalalBadge status={rest.halalStatus} size="sm" />
                    {rest.isVerified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-olive-50 px-2 py-0.5 text-[10px] font-bold text-olive-dark">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-charcoal-900 truncate">
                    {rest.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600">
                    <span>{translateCuisine(rest.cuisine)}</span>
                    <span>•</span>
                    <span className="font-semibold text-charcoal-800">
                      {rest.signatureDishes.length} Menu
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-olive-dark">
                      {rest.gallery.length} Foto Galeri
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-cream-200 pt-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-bold text-charcoal-900">
                    <Star className="h-3.5 w-3.5 fill-terracotta text-terracotta" />
                    {rest.rating.toFixed(1)}
                  </span>
                  <span className="text-charcoal-400">|</span>
                  <span className="font-semibold text-charcoal-700">
                    {rest.estimatedPriceIdr}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(rest)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cream-100 hover:bg-terracotta hover:text-white text-charcoal-800 px-3 py-2 text-xs font-bold transition"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{t.admin.editUmkmBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRestaurant(rest.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.admin.deleteUmkmBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
