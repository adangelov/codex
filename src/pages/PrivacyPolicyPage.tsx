import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { i18n, type Lang } from '../i18n';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LegalContent from '../components/LegalContent';

const POLICY_SECTIONS = [
  {
    title: '1. Въведение',
    content: [
      'Настоящата Политика описва как се събират, съхраняват и обработват лични данни чрез уебсайта, в съответствие с Регламент (ЕС) 2016/679 (GDPR). Използването на сайта означава приемане на тази политика.'
    ]
  },
  {
    title: '2. Администратор на лични данни',
    content: [
      'Администратор на данните: Димитър Димитров',
      'Имейл за GDPR запитвания: office@karailesno.bg',
      'Телефон: +359 8977 777 430'
    ]
  },
  {
    title: '3. Какви данни се събират',
    content: [
      'При използване на сайта могат да бъдат събирани следните данни:',
      '- Име и фамилия',
      '- Телефон',
      '- Имейл адрес',
      '- Съобщение и информация, въведена във формата',
      '- IP адрес',
      '- Технически данни за устройството (браузър, операционна система и др.)'
    ]
  },
  {
    title: '4. Как се събират данните',
    content: [
      'Лични данни се събират само чрез:',
      '- онлайн формата за контакт/записване',
      'Не се използват аналитични или рекламни инструменти като Google Analytics или Facebook Pixel.'
    ]
  },
  {
    title: '5. Цели на обработката',
    content: [
      'Данните се обработват за:',
      '- връзка с подателя на формата;',
      '- предоставяне на информация за курсовете;',
      '- записване за обучение;',
      '- административни цели, свързани с дейността.'
    ]
  },
  {
    title: '6. Срок за съхранение',
    content: [
      '- До 12 месеца след последния контакт, ако лицето не стане клиент.',
      '- До 5 години след приключване на обучение (ако се запише за курс).'
    ]
  },
  {
    title: '7. Права на субекта',
    content: [
      'Потребителите имат право да:',
      '- поискат достъп до данните си;',
      '- изискат корекция;',
      '- поискат изтриване;',
      '- ограничат обработката;',
      '- възразят срещу обработката;',
      '- подадат жалба до Комисията за защита на личните данни.'
    ]
  },
  {
    title: '8. Предоставяне на данни на трети лица',
    content: ['Данните не се предоставят на трети лица, освен при законово задължение.']
  },
  {
    title: '9. Бисквитки (Cookies)',
    content: [
      'Сайтът използва само технически бисквитки, необходими за правилната работа на сайта и защитата от спам.'
    ]
  },
  {
    title: '10. Информационна сигурност',
    content: [
      'Данните се съхраняват в защитена среда, с ограничен достъп. Използва се SSL криптиране.'
    ]
  },
  {
    title: '11. Промени в политиката',
    content: [
      'Политиката може да бъде актуализирана при промени в законодателството или начина на работа.'
    ]
  },
  {
    title: '12. Контакт за GDPR въпроси',
    content: [
      'Имейл: office@karailesno.bg',
      'Телефон: +359 8977 777 430'
    ]
  }
] as const;

export default function PrivacyPolicyPage() {
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
        activeSection={null}
        activeRoute={location.pathname}
        onLangChange={setLang}
        onSectionSelect={(section) => navigate('/', { state: { scrollTo: section } })}
        onBrandClick={() => navigate('/')}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <article className="space-y-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600/80">
              ПОЛИТИКА ЗА ЗАЩИТА НА ЛИЧНИТЕ ДАННИ (GDPR)
            </p>
            <h1 className="text-3xl font-bold leading-tight text-neutral-900">
              „Шофьорски курсове Димитър Димитров“
            </h1>
            <p className="text-sm text-neutral-500">Последна актуализация: 2025 г.</p>
          </header>

          <div className="space-y-6 text-sm text-neutral-700">
            {POLICY_SECTIONS.map((section) => (
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
