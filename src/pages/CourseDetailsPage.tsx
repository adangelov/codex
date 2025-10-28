import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronDown, ChevronLeft } from 'lucide-react';

import { i18n, type Lang } from '../i18n';

export default function CourseDetailsPage() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const [showTopics, setShowTopics] = useState(false);
  const navigate = useNavigate();

  const handleContact = () => {
    navigate('/', { state: { scrollTo: 'contact' } });
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-red-600">
            {t.brand}
          </Link>
          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={handleContact}
              className="hidden rounded-full border px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 sm:inline-flex"
            >
              {t.contacts}
            </button>
          </div>
        </div>
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
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4 md:max-w-xl">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{t.detailsTitle}</h1>
                <p className="mt-2 text-sm text-neutral-600">{t.detailsIntro}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{t.bStandard}</h2>
                <p className="mt-2 text-sm text-neutral-600">{t.bStandardDesc}</p>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {t.coursePriceLabel}
                </div>
                <div className="mt-2 text-2xl font-semibold text-neutral-900">{t.bStandardPrice}</div>
              </div>
              <ul className="space-y-2 text-sm text-neutral-700">
                {t.bStandardHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border bg-neutral-50 p-4 text-sm text-neutral-700 md:w-72">
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
              <p className="text-xs text-neutral-500">
                {t.detailsIntro}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleContact}
              className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
            >
              {t.enroll}
            </button>
            <Link
              to="/"
              className="w-full rounded-xl border px-4 py-2 text-center text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              {t.coursesTitle}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-neutral-50">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div>{t.footer(new Date().getFullYear())}</div>
          <div className="text-[11px] text-neutral-400">Hyundai imagery © respective owners.</div>
        </div>
      </footer>
    </div>
  );
}
