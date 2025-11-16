import { forwardRef, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';

import { type Lang } from '../i18n';
import { NAV_ITEMS, type NavItem, type NavSection } from '../navigation';

const LANG_OPTIONS = ['bg', 'en', 'ru'] as const;
const PHONE_NUMBER = '+3598977777430';
const MOBILE_MENU_ID = 'site-mobile-menu';

interface SiteHeaderProps {
  lang: Lang;
  navLabels: readonly string[];
  brandLabel: string;
  callLabel: string;
  mobileCtaLabel: string;
  activeSection: NavSection | null;
  activeRoute?: string;
  isHomePage?: boolean;
  onLangChange: (lang: Lang) => void;
  onSectionSelect: (section: NavSection) => void;
  onRouteSelect?: (to: string) => void;
  onMobileCtaClick: () => void;
  onBrandClick?: () => void;
  brandHref?: string;
}

type NavEntry = { label: string; item: NavItem };

const SiteHeader = forwardRef<HTMLElement | null, SiteHeaderProps>(function SiteHeader(
  {
    lang,
    navLabels,
    brandLabel,
    callLabel,
    mobileCtaLabel,
    activeSection,
    activeRoute,
    isHomePage = false,
    onLangChange,
    onSectionSelect,
    onRouteSelect,
    onMobileCtaClick,
    onBrandClick,
    brandHref = '/'
  },
  ref
) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const setHeaderRef = (node: HTMLElement | null) => {
    headerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty('overflow');
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      setMenuVisible(false);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [menuOpen]);

  const navEntries = useMemo<NavEntry[]>(() => {
    return navLabels
      .map((label, index) => {
        const item = NAV_ITEMS[index];
        if (!item) {
          return null;
        }
        return { label, item } as const;
      })
      .filter((entry): entry is NavEntry => entry !== null);
  }, [navLabels]);

  const handleSection = (section: NavSection) => {
    onSectionSelect(section);
    setMenuOpen(false);
  };

  const handleRoute = (to: string) => {
    onRouteSelect?.(to);
    setMenuOpen(false);
  };

  const handleBrand = () => {
    setMenuOpen(false);
    onBrandClick?.();
  };

  const headerClasses = isHomePage
    ? 'sticky top-0 z-40 border-b bg-white/90 backdrop-blur'
    : 'border-b bg-white/95 backdrop-blur';
  const containerMaxWidth = 'max-w-6xl';
  const brandGap = isHomePage ? 'gap-8' : 'gap-6';
  const brandLines = useMemo(
    () => brandLabel.split('\n').map((line) => line.trim()).filter(Boolean),
    [brandLabel]
  );
  const brandAriaLabel = brandLines.join(' ');
  const brandContent = (
    <span className="flex flex-col leading-[1.05]">
      {brandLines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`${index === 0 ? 'text-lg' : 'text-base'} font-semibold whitespace-nowrap`}
        >
          {line}
        </span>
      ))}
    </span>
  );

  return (
    <header ref={setHeaderRef} className={headerClasses}>
      <div className={`mx-auto flex ${containerMaxWidth} items-center justify-between px-4 py-4`}>
        <div className={`flex items-center ${brandGap}`}>
          {isHomePage ? (
            <button
              type="button"
              onClick={handleBrand}
              aria-label={brandAriaLabel}
              className="border-0 bg-transparent p-0 text-left text-red-600 transition hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              {brandContent}
            </button>
          ) : (
            <Link
              to={brandHref}
              onClick={handleBrand}
              aria-label={brandAriaLabel}
              className="text-left text-red-600 transition hover:text-red-700"
            >
              {brandContent}
            </Link>
          )}
          <nav className="hidden gap-4 md:flex md:flex-nowrap">
            {navEntries.map(({ label, item }) => {
              const isSection = item.type === 'section';
              const isActive = isSection
                ? activeSection === item.section
                : activeRoute === item.to;
              const baseClasses = 'rounded-full px-3 py-2 text-sm transition whitespace-nowrap';
              const className = `${baseClasses} ${
                isActive ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
              }`;

              if (isSection) {
                return (
                  <button
                    key={`${item.type}-${label}`}
                    type="button"
                    onClick={() => handleSection(item.section)}
                    className={className}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <Link
                  key={`${item.type}-${label}`}
                  to={item.to}
                  className={className}
                  onClick={() => handleRoute(item.to)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {LANG_OPTIONS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onLangChange(code)}
                className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                  lang === code ? 'bg-red-600 text-white' : 'border'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 whitespace-nowrap md:inline-flex"
          >
            {callLabel}
            <Phone size={16} />
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border p-2 text-sm md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? 'Затвори навигацията' : 'Отвори навигацията'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuVisible && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-out md:hidden ${
              menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id={MOBILE_MENU_ID}
            className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            data-nav-panel
            role={menuOpen ? 'dialog' : undefined}
            aria-modal={menuOpen ? 'true' : undefined}
            aria-hidden={menuOpen ? undefined : 'true'}
          >
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-red-600">{brandLines[0]}</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-red-600 hover:bg-red-50"
                aria-label="Затвори менюто"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="mb-6 flex flex-wrap gap-2">
                {LANG_OPTIONS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onLangChange(code)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      lang === code ? 'bg-red-600 text-white' : 'border border-red-100 text-red-600'
                    }`}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
              <nav className="flex flex-col gap-4" aria-label="Мобилна навигация">
                {navEntries.map(({ label, item }) => {
                  const isSection = item.type === 'section';
                  const isActive = isSection
                    ? activeSection === item.section
                    : activeRoute === item.to;
                  const className = `block text-left text-lg font-semibold transition-colors ${
                    isActive ? 'text-red-700' : 'text-red-600 hover:text-red-700'
                  }`;

                  if (isSection) {
                    return (
                      <button
                        key={`${item.type}-${label}`}
                        type="button"
                        onClick={() => handleSection(item.section)}
                        className={`${className} w-full`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={`${item.type}-${label}`}
                      to={item.to}
                      className={className}
                      onClick={() => handleRoute(item.to)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t px-4 py-4">
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  onClick={() => setMenuOpen(false)}
                >
                  {callLabel}
                  <Phone size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onMobileCtaClick();
                  }}
                  className="w-full rounded-2xl border border-red-600 px-3 py-3 text-sm font-semibold text-red-600"
                >
                  {mobileCtaLabel}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
});

export default SiteHeader;
