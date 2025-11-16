import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

import { i18n, type Lang } from '../i18n';
import { SITE_VERSION } from '../siteVersion';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SiteHeader from '../components/SiteHeader';
import CourseHighlightItem from '../components/CourseHighlightItem';

export default function CourseDetailsPage() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const [showTopics, setShowTopics] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const gallery = {
    main: {
      src: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80',
      alt: t.galleryLabels.main
    },
    thumbs: [
      {
        src: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80',
        alt: t.galleryLabels.dash
      },
      {
        src: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80',
        alt: t.galleryLabels.exterior
      },
      {
        src: 'https://images.unsplash.com/photo-1517940310602-0052c1d53016?auto=format&fit=crop&w=800&q=80',
        alt: t.galleryLabels.class
      }
    ]
  } as const;

  const galleryImages = [gallery.main, ...gallery.thumbs];

  const handleContact = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader
        lang={lang}
        navLabels={t.nav}
        brandLabel={t.brand}
        callLabel={t.call}
        mobileCtaLabel={t.contacts}
        activeSection={null}
        activeRoute={location.pathname}
        onLangChange={setLang}
        onSectionSelect={(section) => navigate('/', { state: { scrollTo: section } })}
        onMobileCtaClick={handleContact}
        onBrandClick={() => navigate('/')}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-red-600/80">
                  {t.galleryTitle}
                </span>
                <figure className="space-y-4">
                  <div className="relative overflow-hidden rounded-3xl shadow-lg">
                    <img
                      src={galleryImages[activeImageIndex].src}
                      alt={galleryImages[activeImageIndex].alt}
                      className="h-60 w-full object-cover sm:h-72 lg:h-[24rem]"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full items-center justify-between px-2">
                      <div className="h-full w-16 bg-gradient-to-r from-black/20 to-transparent" />
                      <div className="h-full w-16 bg-gradient-to-l from-black/20 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next image"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  <figcaption className="text-xs text-neutral-500">{t.galleryDescription}</figcaption>
                </figure>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                      activeImageIndex === index ? 'ring-2 ring-red-500' : ''
                    }`}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImageIndex === index}
                  >
                    <img src={image.src} alt={image.alt} className="h-24 w-full object-cover sm:h-20 lg:h-24" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{t.detailsTitle}</h1>
                  <p className="mt-2 text-sm text-neutral-600">{t.detailsIntro}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">{t.bStandard}</h2>
                  <p className="mt-2 text-sm text-neutral-600">{t.bStandardDesc}</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t.coursePriceLabel}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-neutral-900">{t.bStandardPrice}</div>
                </div>
              </div>
              <ul className="space-y-3">
                {t.bStandardHighlights.map((item) => (
                  <CourseHighlightItem key={item} text={item} />
                ))}
              </ul>
              <div className="flex flex-col gap-4 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-700">
                <div className="font-semibold uppercase tracking-wide text-neutral-500">{t.theory}</div>
                <button
                  type="button"
                  onClick={() => setShowTopics((prev) => !prev)}
                  className="inline-flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left font-medium hover:bg-white"
                >
                  <span>{showTopics ? t.hideContent : t.showContent}</span>
                  <ChevronDown className={`transition ${showTopics ? 'rotate-180' : ''}`} size={16} />
                </button>
                {showTopics && (
                  <ul className="space-y-1 text-xs text-neutral-600">
                    {t.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-neutral-500">{t.detailsIntro}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleContact}
                  className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                >
                  {t.enroll}
                </button>
                <a
                  href="tel:+3598977777430"
                  className="w-full inline-flex items-center justify-between gap-4 rounded-xl border px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone size={16} />
                    <span>{t.call}</span>
                  </span>
                  <span className="flex flex-col text-right text-xs leading-tight text-neutral-500">
                    <span>+359 8977</span>
                    <span>777 430</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ScrollToTopButton className="fixed bottom-6 right-6 z-50" />

      <footer className="border-t bg-neutral-50">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div>{t.footer(new Date().getFullYear())}</div>
          <div className="text-[11px] text-neutral-400">Hyundai imagery © respective owners.</div>
          <div className="text-[11px] text-neutral-400">Site version: {SITE_VERSION}</div>
        </div>
      </footer>
    </div>
  );
}
