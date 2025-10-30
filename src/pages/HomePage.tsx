import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  User
} from 'lucide-react';

import { i18n, type Lang, type Strings } from '../i18n';

type NavSection = 'process' | 'courses' | 'instructor' | 'faq' | 'contact';

type NavItem =
  | { type: 'section'; section: NavSection }
  | { type: 'route'; to: string };

const NAV_ITEMS: readonly NavItem[] = [
  { type: 'section', section: 'process' },
  { type: 'section', section: 'courses' },
  { type: 'route', to: '/courses/category-b' },
  { type: 'section', section: 'instructor' },
  { type: 'section', section: 'faq' },
  { type: 'section', section: 'contact' }
];

const NAV_SECTION_IDS: readonly NavSection[] = NAV_ITEMS.filter(
  (item): item is Extract<NavItem, { type: 'section' }> => item.type === 'section'
).map((item) => item.section);

const SITE_VERSION = 'v1.0.4';


const BASE_MONDAY = mondayOnOrBefore(new Date(2024, 0, 1));

function mondayOnOrBefore(date: Date): Date {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = (day + 6) % 7;
  clone.setDate(clone.getDate() - diff);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function monthName(year: number, month: number, locale: string) {
  return new Date(year, month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric'
  });
}
function getCycleStartMonday(date: Date, baseMonday: Date): Date | null {
  const millisPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(baseMonday.getFullYear(), baseMonday.getMonth(), baseMonday.getDate())) /
      millisPerDay
  );
  const weekOffset = Math.floor(diffDays / 7);
  const dayOfWeek = date.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const phase = ((weekOffset % 3) + 3) % 3;
  if (phase === 2 || !isWeekday) {
    return null;
  }
  const cycleStartWeeks = weekOffset - phase;
  const start = new Date(baseMonday);
  start.setDate(start.getDate() + cycleStartWeeks * 7);
  return start;
}

function classifyTheoryDate(date: Date, baseMonday: Date) {
  const start = getCycleStartMonday(date, baseMonday);
  if (!start) {
    return { theory: false, start: false, startIso: null as string | null };
  }
  const iso = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const startSame =
    start.getFullYear() === date.getFullYear() &&
    start.getMonth() === date.getMonth() &&
    start.getDate() === date.getDate();
  return { theory: true, start: startSame, startIso: iso };
}

function listUpcomingStarts(baseMonday: Date, count = 12) {
  const results: { iso: string; date: Date }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let weekIndex = 0;
  while (results.length < count && weekIndex < 160) {
    const candidate = new Date(baseMonday);
    candidate.setDate(candidate.getDate() + weekIndex * 7);
    const classification = classifyTheoryDate(candidate, baseMonday);
    if (classification.start && candidate >= today) {
      const iso = `${candidate.getFullYear()}-${String(candidate.getMonth() + 1).padStart(2, '0')}-${String(candidate.getDate()).padStart(2, '0')}`;
      results.push({ iso, date: candidate });
    }
    weekIndex += 1;
  }
  return results;
}

interface SmallCalendarProps {
  value: Date;
  locale: string;
  weekdays: readonly string[];
  baseMonday: Date;
  selectedStart: string | null;
  onPrev: () => void;
  onNext: () => void;
  onPick: (iso: string) => void;
}

function SmallCalendar({ value, locale, weekdays, baseMonday, selectedStart, onPrev, onNext, onPick }: SmallCalendarProps) {
  const year = value.getFullYear();
  const month = value.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  const ym = `${year}-${String(month + 1).padStart(2, '0')}`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button onClick={onPrev} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" aria-label="Previous month">
          <ChevronLeft size={14} />
        </button>
        <div className="min-w-[9rem] text-center text-xs font-medium uppercase text-neutral-600">
          {monthName(year, month, locale)}
        </div>
        <button onClick={onNext} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50" aria-label="Next month">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500">
        {weekdays.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8 rounded-md" />;
          }
          const iso = `${ym}-${String(day).padStart(2, '0')}`;
          const currentDate = new Date(year, month, day);
          const { theory, start, startIso } = classifyTheoryDate(currentDate, baseMonday);
          const isSelected = selectedStart && startIso === selectedStart;
          const baseClasses = 'h-8 rounded-md text-sm transition-colors';
          const className = theory
            ? start
              ? isSelected
                ? `${baseClasses} bg-red-700 text-white hover:bg-red-800`
                : `${baseClasses} bg-red-600 text-white hover:bg-red-700`
              : `${baseClasses} bg-red-200 text-red-900 hover:bg-red-300`
            : `${baseClasses} bg-neutral-100 text-neutral-700`;
          return (
            <button
              key={iso}
              type="button"
              className={className}
              onClick={() => {
                if (theory && startIso) {
                  onPick(startIso);
                }
              }}
              aria-pressed={isSelected}
              title={theory ? (start ? 'Start' : 'Theory') : ''}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  course: keyof Strings['courseOptions'];
  gdpr: boolean;
}
export default function HomePage() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('process');
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { scrollTo?: NavSection } | null;
  const [viewDate, setViewDate] = useState(() => new Date());
  const upcomingStarts = useMemo(() => listUpcomingStarts(BASE_MONDAY, 12), []);
  const [startDate, setStartDate] = useState<string>(() => upcomingStarts[0]?.iso ?? '');
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    phone: '',
    email: '',
    course: 'b_standard',
    gdpr: false
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startDate && upcomingStarts.length > 0) {
      setStartDate(upcomingStarts[0].iso);
    }
  }, [startDate, upcomingStarts]);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const scrollPosition = window.scrollY + headerHeight + 1;

      let currentSection: NavSection | null = null;
      for (const id of NAV_SECTION_IDS) {
        const element = document.getElementById(id);
        if (!element) {
          continue;
        }
        if (scrollPosition >= element.offsetTop) {
          currentSection = id;
        }
      }

      const nextSection = currentSection ?? NAV_SECTION_IDS[0];
      setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const handler = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('[data-nav-panel]')) {
        return;
      }
      setMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!form.gdpr) {
      formRef.current?.querySelector<HTMLInputElement>('[name="gdpr"]')?.focus();
      return;
    }
    setFormState('sending');
    window.setTimeout(() => {
      setFormState('success');
    }, 800);
  };

  const onPickTheoryDate = (iso: string) => {
    setStartDate(iso);
  };

  const handleScrollTo = useCallback((id: NavSection) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop - headerHeight, behavior: 'smooth' });
    }
  }, []);

  const handleBrandClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const target = locationState?.scrollTo;
    if (target && NAV_SECTION_IDS.includes(target)) {
      const timer = window.setTimeout(() => handleScrollTo(target), 100);
      navigate('.', { replace: true, state: null });
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [locationState, navigate, handleScrollTo]);

  const startOptions = useMemo(() => {
    if (startDate && !upcomingStarts.some((item) => item.iso === startDate)) {
      const parsed = new Date(startDate);
      return [...upcomingStarts, { iso: startDate, date: parsed }].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
    }
    return upcomingStarts;
  }, [startDate, upcomingStarts]);

  const selectedStartDateLabel = startDate
    ? new Date(startDate).toLocaleDateString(t.locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';
  const mapAddress = t.mapAddress;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={handleBrandClick}
              aria-label={t.brand}
              className="border-0 bg-transparent p-0 text-lg font-semibold text-red-600 transition hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              {t.brand}
            </button>
            <nav className="hidden gap-4 md:flex">
              {t.nav.map((label, index) => {
                const item = NAV_ITEMS[index];
                if (!item) {
                  return null;
                }
                const isSection = item.type === 'section';
                const active = isSection && activeSection === item.section;
                return (
                  <button
                    key={`${item.type}-${label}`}
                    type="button"
                    onClick={() => {
                      if (item.type === 'section') {
                        handleScrollTo(item.section);
                      } else {
                        navigate(item.to);
                      }
                    }}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      active ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
                    }`}
                    aria-current={active ? 'true' : undefined}
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
              aria-controls="mobile-menu"
            >
              ☰
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
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
                {t.nav.map((label, index) => {
                  const item = NAV_ITEMS[index];
                  if (!item) {
                    return null;
                  }
                  const isSection = item.type === 'section';
                  const active = isSection && activeSection === item.section;
                  return (
                    <button
                      key={`${item.type}-${label}`}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        if (item.type === 'section') {
                          handleScrollTo(item.section);
                        } else {
                          navigate(item.to);
                        }
                      }}
                      className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                        active ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
                      }`}
                      aria-current={active ? 'true' : undefined}
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
                    onClick={() => {
                      setMenuOpen(false);
                      handleScrollTo('contact');
                    }}
                    className="w-full rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    {t.ctaEnroll}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="border-b bg-gradient-to-b from-white to-neutral-100">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold leading-tight md:text-5xl"
              >
                {t.heroTitle}
              </motion.h1>
              <p className="mt-4 text-neutral-700 md:text-lg">{t.heroLead}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleScrollTo('contact')}
                  className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700"
                >
                  {t.ctaEnrollNow}
                </button>
                <a
                  href="tel:+3598977777430"
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm hover:bg-neutral-100"
                >
                  <Phone size={18} /> +359 8977 777 430
                </a>
              </div>

              <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <CalendarDays size={16} /> {t.theorySchedule}
                  </div>
                </div>
                <SmallCalendar
                  value={viewDate}
                  locale={t.locale}
                  weekdays={t.weekdayShort}
                  baseMonday={BASE_MONDAY}
                  selectedStart={startDate || null}
                  onPrev={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  onNext={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  onPick={onPickTheoryDate}
                />
                <div className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800">
                  {t.startTheory}: {selectedStartDateLabel}
                </div>
              </div>
            </div>
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-white shadow-sm">
                <img
                  src="https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/X3qgFrmQnyB7iCa6jmWA"
                  alt="Hyundai i30"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-xs text-neutral-500">Hyundai i30 (учебен автомобил).</p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-12" id="features">
          <div className="grid gap-4 md:grid-cols-3">
            {t.features.map(([title, description]) => (
              <div key={title} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-2 inline-flex rounded-full bg-neutral-100 p-2">
                  <CheckCircle2 size={18} />
                </div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-neutral-600">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-neutral-50" id="process">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.processTitle}</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-5">
              {[
                { title: t.steps[0], icon: <ClipboardCheck /> },
                { title: t.steps[1], icon: <Stethoscope /> },
                { title: t.steps[2], icon: <BookOpen /> },
                { title: t.steps[3], icon: <Car /> },
                { title: t.steps[4], icon: <GraduationCap /> }
              ].map((step, index) => (
                <li key={step.title} className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
                  <div className="mb-1 text-xs text-neutral-500">{t.stepLabel} {index + 1}</div>
                  <div className="font-semibold text-center">{step.title}</div>
                  <div className="mt-2 flex justify-center">
                    <div className="inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">{step.icon}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t bg-white" id="courses">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.coursesTitle}</h2>
            <p className="mt-2 text-neutral-600">{t.coursesLead}</p>
            <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
              <article className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{t.bStandard}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{t.bStandardDesc}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-neutral-50 p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t.coursePriceLabel}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-neutral-900">{t.bStandardPrice}</div>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                  {t.bStandardHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:gap-2">
                  <Link
                    to="/courses/category-b"
                    className="inline-flex w-full justify-center rounded-xl border px-4 py-2 text-center text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    {t.seeDetails}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    {t.enroll}
                  </button>
                </div>
              </article>

              <article className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{t.refreshTitle}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{t.refreshDesc}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t.refreshPriceLabel}
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                    {t.prices.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                  {t.refreshHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="w-full rounded-xl border px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    {t.price}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="w-full rounded-xl border px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                  >
                    {t.plan}
                  </button>
                </div>
              </article>

              <article className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{t.intensiveTitle}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{t.intensiveDesc}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-neutral-50 p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t.coursePriceLabel}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-neutral-900">{t.intensivePrice}</div>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-700">
                  {t.intensiveHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    {t.intensiveCta}
                  </button>
                </div>
              </article>
            </div>
            <p className="mt-6 text-sm text-neutral-500">{t.installmentsNote}</p>
          </div>
        </section>

        <section className="border-t bg-neutral-50" id="faq">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.faqTitle}</h2>
            <div className="mt-6 space-y-3">
              {t.faqs.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    {question}
                    <ChevronDown className="transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-neutral-700">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-white" id="instructor">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.instructorTitle}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                  <User size={18} />
                </div>
                <div className="font-semibold">{t.instructorCardTitle}</div>
                <p className="mt-2 text-sm text-neutral-700">{t.instructorCardText}</p>
              </div>
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                  <Home size={18} />
                </div>
                <div className="font-semibold">{t.classroomTitle}</div>
                <p className="mt-2 text-sm text-neutral-700">{t.classroomText}</p>
              </div>
            </div>
            <h3 className="mt-10 text-xl font-semibold md:text-2xl">{t.carSection}</h3>
            <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="overflow-hidden rounded-xl border">
                <img
                  alt="Hyundai i30"
                  className="h-full w-full object-cover"
                  src="https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/X3qgFrmQnyB7iCa6jmWA"
                />
              </div>
              <p className="mt-3 text-sm text-neutral-700">{t.carBullet}</p>
            </div>
          </div>
        </section>

        <section className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.reviews}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-1 text-yellow-600">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-700">
                    “Страхотно отношение и ясни обяснения. Създадох увереност и взех изпита от първия път!”
                  </p>
                  <div className="mt-3 text-xs text-neutral-500">— Иван П.</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="border-t bg-white" id="contact">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.contacts}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-3 text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <Phone size={18} /> +359 8977 777 430
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <a href="mailto:office@karailesno.bg" className="text-red-700 hover:underline">
                    office@karailesno.bg
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} /> {mapAddress}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} /> {t.hours}
                </div>
                <div className="overflow-hidden rounded-2xl border bg-neutral-50">
                  <iframe
                    title={t.mapTitle}
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
              </div>
              <div className="rounded-2xl border bg-neutral-50 p-5 shadow-sm">
                <h3 className="text-lg font-semibold">{t.formTitle}</h3>
                <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600" htmlFor="name">
                      {t.formName}
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600" htmlFor="phone">
                      {t.formPhone}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                      required
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600" htmlFor="email">
                      {t.formEmail}
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600" htmlFor="course">
                      {t.bStandard}
                    </label>
                    <select
                      id="course"
                      name="course"
                      value={form.course}
                      onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value as ContactFormState['course'] }))}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    >
                      {Object.entries(t.courseOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-600" htmlFor="start">
                      {t.formStartDate}
                    </label>
                    <select
                      id="start"
                      name="start"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                    >
                      {startOptions.map((item) => (
                        <option key={item.iso} value={item.iso}>
                          {new Date(item.iso).toLocaleDateString(t.locale, {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      name="gdpr"
                      checked={form.gdpr}
                      onChange={(event) => setForm((prev) => ({ ...prev, gdpr: event.target.checked }))}
                      className="h-4 w-4 rounded border"
                    />
                    {t.formGDPR}
                  </label>
                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full rounded-xl bg-red-600 py-2 font-semibold text-white shadow hover:bg-red-700 disabled:opacity-60"
                  >
                    {formState === 'success' ? t.sentOk : t.formSubmit}
                  </button>
                  {formState === 'success' && (
                    <div className="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-700">{t.sentThanks}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-neutral-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between">
          <div>{t.footer(new Date().getFullYear())}</div>
          <div className="text-xs text-neutral-400">Hyundai imagery © respective owners.</div>
          <div className="text-xs text-neutral-400">Site version: {SITE_VERSION}</div>
        </div>
      </footer>

    </div>
  );
}
