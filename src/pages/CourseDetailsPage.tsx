import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronLeft, Phone } from 'lucide-react';

import { i18n, type Lang } from '../i18n';
import { NAV_ITEMS, type NavItem } from '../navigation';
import { SITE_VERSION } from '../siteVersion';

export default function CourseDetailsPage() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const [showTopics, setShowTopics] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navEntries = t.nav
    .map((label, index) => {
      const item = NAV_ITEMS[index];
      if (!item) {
        return null;
      }
      return { label, item } as const;
    })
    .filter((entry): entry is { label: string; item: NavItem } => entry !== null);

  const handleNavClick = (item: NavItem) => {
    setMenuOpen(false);
    if (item.type === 'section') {
      navigate('/', { state: { scrollTo: item.section } });
    } else {
      navigate('/courses/category-b');
    }
  };

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

  const handleContact = () => {
    setMenuOpen(false);
    navigate('/', { state: { scrollTo: 'contact' } });
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold text-red-600">
              {t.brand}
            </Link>
            <nav className="hidden gap-4 md:flex">
              {navEntries.map(({ label, item }) => {
                const active = item.type === 'route' && location.pathname === item.to;
                return (
                  <button
                    key={`${item.type}-${label}`}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      active ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {(['bg', 'en', 'ru'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                    lang === code ? 'bg-red-600 text-white' : 'border'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <a
              href="tel:+3598977777430"
              className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 md:inline-flex"
            >
              {t.call}
              <Phone size={16} />
            </a>
            <button
              type="button"
              className="rounded-full border px-3 py-2 text-sm md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="course-mobile-menu"
            >
              ☰
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="course-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-white md:hidden"
            >
              <div className="space-y-3 px-4 py-4" data-nav-panel>
                <div className="flex gap-2">
                  {(['bg', 'en', 'ru'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                        lang === code ? 'bg-red-600 text-white' : 'border'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
                {navEntries.map(({ label, item }) => {
                  const active = item.type === 'route' && location.pathname === item.to;
                  return (
                    <button
                      key={`${item.type}-${label}`}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        active ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label}
                    </button>
                  );
                })}
                <div className="flex gap-2">
                  <a
                    href="tel:+3598977777430"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    {t.call}
                    <Phone size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={handleContact}
                    className="w-full rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    {t.contacts}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 transition hover:bg-neutral-100"
          >
            <ChevronLeft size={16} />
            {t.coursesTitle}
          </button>
          <span aria-hidden className="hidden sm:inline">
            ·
          </span>
          <span className="hidden text-neutral-400 sm:inline">{t.bStandard}</span>
        </div>

        <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-red-600/80">
                  {t.galleryTitle}
                </span>
                <figure className="space-y-4">
                  <div className="overflow-hidden rounded-3xl shadow-lg">
                    <img
                      src={gallery.main.src}
                      alt={gallery.main.alt}
                      className="h-60 w-full object-cover sm:h-72 lg:h-[24rem]"
                    />
                  </div>
                  <figcaption className="text-xs text-neutral-500">{t.galleryDescription}</figcaption>
                </figure>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {gallery.thumbs.map((image) => (
                  <div key={image.src} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <img src={image.src} alt={image.alt} className="h-28 w-full object-cover sm:h-24 lg:h-28" />
                  </div>
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
              <ul className="space-y-2 text-sm text-neutral-700">
                {t.bStandardHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                >
                  <Phone size={16} />
                  <span>{t.call}</span>
                  <span className="hidden text-xs text-neutral-500 sm:inline">+359 8977 777 430</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

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
