import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { i18n, type Lang } from '../i18n';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LegalContent from '../components/LegalContent';

const TERMS_SECTIONS = [
  {
    title: '1. Предмет на документа',
    content: [
      'Настоящите Общи условия уреждат правилата за ползване на уебсайта, предоставян от „Шофьорски курсове Димитър Димитров“, както и отношенията между посетителите на сайта и собственика на услугата. Използвайки сайта, Вие приемате настоящите условия.'
    ]
  },
  {
    title: '2. Собственик на уебсайта',
    content: [
      'Собственик на услугата е:',
      'Димитър Димитров',
      'Телефон: +359 8977 777 430',
      'Имейл: office@karailesno.bg',
      'Адрес: (не е предоставен)'
    ]
  },
  {
    title: '3. Услуги',
    content: [
      'Сайтът предоставя информация относно:',
      '- Шофьорски курсове категория Б',
      '- Инструктор: Димитър Димитров',
      '- Условия за записване',
      '- Начини за контакт',
      '- Онлайн формата за запитвания и кандидатстване'
    ]
  },
  {
    title: '4. Авторски права',
    content: [
      'Цялото съдържание в сайта е защитено от Закона за авторското право. Копирането, разпространението или използването на текстове, изображения, дизайни, графични елементи или идеи без изрично писмено съгласие е забранено.'
    ]
  },
  {
    title: '5. Забранени действия',
    content: [
      'Потребителите нямат право да:',
      '- копират, разпространяват или модифицират съдържание;',
      '- използват сайта за незаконни цели;',
      '- предоставят неверни данни чрез формите;',
      '- извършват нерегламентирани опити за достъп.'
    ]
  },
  {
    title: '6. Записване за курс',
    content: [
      'Записването се осъществява чрез:',
      '- попълване на онлайн формата;',
      '- телефонен контакт;',
      '- последващо потвърждение от инструктор.',
      'Изпращането на форма не гарантира записване, докато не бъде извършено потвърждение.'
    ]
  },
  {
    title: '7. Лични данни',
    content: [
      'Обработката на лични данни се извършва съгласно Политиката за защита на личните данни, публикувана на сайта.'
    ]
  },
  {
    title: '8. Ограничаване на отговорността',
    content: [
      'Собственикът не носи отговорност за:',
      '- технически проблеми в сайта;',
      '- външни препратки;',
      '- временна недостъпност на услугата.'
    ]
  },
  {
    title: '9. Промени в условията',
    content: [
      'Собственикът може да актуализира Общите условия по всяко време, без предварително уведомление. Промените влизат в сила при публикуването им.'
    ]
  },
  {
    title: '10. Контакт',
    content: [
      'За въпроси относно Общите условия:',
      'Имейл: office@karailesno.bg',
      'Телефон: +359 8977 777 430'
    ]
  }
] as const;

export default function TermsPage() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

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
        onMobileCtaClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
        onBrandClick={() => navigate('/')}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <article className="space-y-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600/80">
              ОБЩИ УСЛОВИЯ ЗА ПОЛЗВАНЕ НА УЕБСАЙТА
            </p>
            <h1 className="text-3xl font-bold leading-tight text-neutral-900">
              „Шофьорски курсове Димитър Димитров“
            </h1>
            <p className="text-sm text-neutral-500">Последна актуализация: 2025 г.</p>
          </header>

          <div className="space-y-6 text-sm text-neutral-700">
            {TERMS_SECTIONS.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-lg font-semibold text-neutral-900">{section.title}</h2>
                <LegalContent content={section.content} />
              </section>
            ))}
          </div>
        </article>
      </main>

      <ScrollToTopButton className="fixed bottom-6 right-6 z-40" />
      <Footer footer={t.footer} />
    </div>
  );
}
