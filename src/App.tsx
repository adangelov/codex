import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  Mail,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  User
} from 'lucide-react';

type Lang = 'bg' | 'en' | 'ru';

type NavSection = 'process' | 'courses' | 'pricing' | 'instructor' | 'faq' | 'contact';

const VERSION = 3;

const NAV_SECTION_IDS: NavSection[] = ['process', 'courses', 'pricing', 'instructor', 'faq', 'contact'];

const i18n = {
  bg: {
    brand: 'РУМИ · Автошкола',
    nav: ['Как протича', 'Курсове', 'Цени', 'Инструктор', 'FAQ', 'Контакти'],
    heroTitle: 'Увереното шофиране започва тук.',
    heroLead:
      'Лицензиран инструктор. Реални ситуации. Модерна учебна среда. Практика с Hyundai i30 (дизел, ръчни скорости).',
    call: 'Обади се',
    ctaEnroll: 'Запиши се',
    ctaEnrollNow: 'Запиши се сега',
    theorySchedule: 'График теория',
    weekdayShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    startTheory: 'Старт на теория',
    theory: 'Теория',
    features: [
      ['Лицензиран инструктор с опит', 'Истинско внимание и личен подход.'],
      ['Практика в градски условия', 'Подготовка за реални ситуации и маневри.'],
      ['Специално оборудвана класна стая', 'Комфорт, визуални материали и структуриран курс.'],
      ['Индивидуален график', 'Удобни часове сутрин/вечер/уикенд.'],
      ['Подготовка за КАТ', 'Вътрешни изпити и ясни критерии.'],
      ['Висока успеваемост', 'Фокус върху сигурност и увереност.']
    ],
    processTitle: 'Как протича обучението',
    steps: ['Записване', 'Медицинско', 'Теория', 'Практика', 'Държавен изпит'],
    coursesTitle: 'Курсове',
    coursesLead: 'Изберете програма според нуждите си. Всички включват теория и практика.',
    bStandard: 'Категория B – стандартен курс',
    bStandardDesc: 'Теория + 31 учебни часа практика',
    seeDetails: 'Виж детайли',
    enroll: 'Запиши се',
    refreshTitle: 'Опреснителни и индивидуални часове',
    price: 'Цена',
    plan: 'Планирай час',
    voucherTitle: 'Подари ваучер 🎁',
    voucherLead: 'Подари на близък ваучер за теория и практика.',
    getVoucher: 'Вземи ваучер',
    faqTitle: 'Често задавани въпроси',
    faqs: [
      ['На колко навършени години трябва да съм, за да се запиша?', 'Минимум 17 г. и 9 месеца към датата на започване на курса (за категория B).'],
      ['Какво влиза като практика в курса?', 'Градско шофиране, извънградско, маневри, паркиране с камера за заден ход и нощно кормуване при възможност.'],
      ['Колко време продължава курсът?', 'Обичайно 6–8 седмици според графика и натовареността.'],
      ['Как се провеждат часовете по кормуване?', 'В реални градски условия по утвърден маршрут + маневри и паркиране.'],
      ['Какви документи трябват?', 'Лична карта, снимка, медицинско и други при необходимост.'],
      ['Мога ли да плащам разсрочено?', 'Да — предлагаме гъвкави планове.']
    ],
    pricingTitle: 'Цени и график',
    planStandard: ['Стандартен', 'Всичко необходимо за изпита', 'Включва теория + практика + вътрешни изпити.'],
    planInstallments: ['Разсрочено', 'Плащане на части', 'Гъвкави планове и индивидуален график.'],
    instructorTitle: 'Инструктор и класна стая',
    instructorCardTitle: 'Димитър — лицензиран инструктор',
    instructorCardText: 'Дългогодишен опит, спокоен подход и ясни обяснения. Индивидуално внимание според темпото ви.',
    classroomTitle: 'Класна стая (Теория)',
    classroomText: 'Специално оборудвана зала с визуални материали и удобства за ефективно усвояване.',
    carSection: 'Автомобил',
    carBullet: 'Hyundai i30 · дизел · ръчна скоростна кутия',
    reviews: 'Отзиви',
    contacts: 'Контакти',
    mapTitle: 'Карта: Автошкола Руми',
    hours: 'Пн–Пт 09:00–19:00, Сб 10:00–15:00',
    addressPrefix: 'Адрес на класната стая — ',
    formTitle: 'Записване за курс',
    formName: 'Име и фамилия',
    formPhone: 'Телефон',
    formEmail: 'Имейл',
    formStartDate: 'Дата старт',
    formSubmit: 'Запази място',
    formGDPR: 'Съгласен/на съм с обработката на личните ми данни (GDPR)',
    sentThanks: 'Благодарим! Ще се свържем с вас за потвърждение.',
    sentOk: 'Изпратено! Ще ви потърсим до скоро.',
    courseOptions: {
      b_standard: 'Категория B - стандартен курс',
      b_refresh: 'Категория B - опреснителни курсове',
      b_extra: 'Категория B - допълнителни часове'
    },
    detailsTitle: 'Категория B — детайли',
    detailsIntro: 'Пълна програма на теоретичното обучение + информация за практиката.',
    showContent: 'Съдържание на теоретично обучение',
    hideContent: 'Скрий съдържанието',
    topics: [
      '• Закон за движение по пътищата, знаци, маркировка',
      '• Основи на безопасността, дефанзивно шофиране',
      '• Техника на управление, позиция, огледала',
      '• Кръстовища, предимство, кръгово',
      '• Паркиране и маневри (успоредно, перпендикулярно, гараж)',
      '• Автомагистрала и извънградско',
      '• Особени условия: нощно, дъжд/сняг',
      '• Първа помощ и действия при ПТП',
      '• Подготовка за изпит (теория и практика)'
    ],
    close: 'Затвори',
    chooseDateRefresh: 'Избери дата за опреснителни',
    priceTitle: 'Цени — опреснителни/индивидуални',
    prices: ['до 5 часа — 45 лв/час', '6–10 часа — 40 лв/час', '11–15 часа — 38 лв/час', '20–30 часа — 35 лв/час'],
    perHour: 'лв/час',
    voucherModalTitle: 'Подаръчен ваучер 🎁',
    voucherText: 'Подари ваучер за пълен курс теория + практика или за пакет индивидуални часове. Идеален подарък за близък човек, който иска да започне уверено.',
    orderVoucher: 'Поръчай ваучер',
    footer: (year: number) => `© Руми ${year} · Всички права запазени · Версия ${VERSION}`,
    locale: 'bg-BG'
  },
  en: {
    brand: 'RUMI · Driving School',
    nav: ['How it works', 'Courses', 'Pricing', 'Instructor', 'FAQ', 'Contacts'],
    heroTitle: 'Confident driving starts here.',
    heroLead:
      'Licensed instructor. Real-world situations. Modern classroom. Practice with Hyundai i30 (diesel, manual).',
    call: 'Call',
    ctaEnroll: 'Enroll',
    ctaEnrollNow: 'Enroll now',
    theorySchedule: 'Theory schedule',
    weekdayShort: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    startTheory: 'Theory start',
    theory: 'Theory',
    features: [
      ['Licensed instructor', 'Personal attention and clear guidance.'],
      ['City driving practice', 'Training for real situations and maneuvers.'],
      ['Equipped classroom', 'Comfort, visuals and structured course.'],
      ['Flexible schedule', 'Morning/evening/weekend hours.'],
      ['Exam preparation', 'Internal tests and clear criteria.'],
      ['High success rate', 'Focus on safety and confidence.']
    ],
    processTitle: 'How the training works',
    steps: ['Enrollment', 'Medical', 'Theory', 'Practice', 'State exam'],
    coursesTitle: 'Courses',
    coursesLead: 'Choose a program for your needs. All include theory and practice.',
    bStandard: 'Category B – standard course',
    bStandardDesc: 'Theory + 31 practice lessons',
    seeDetails: 'See details',
    enroll: 'Enroll',
    refreshTitle: 'Refresher & individual lessons',
    price: 'Price',
    plan: 'Plan a lesson',
    voucherTitle: 'Gift a voucher 🎁',
    voucherLead: 'Gift a voucher for theory and practice.',
    getVoucher: 'Get voucher',
    faqTitle: 'Frequently asked questions',
    faqs: [
      ['What minimum age do I need?', 'At least 17 years and 9 months at course start (Category B).'],
      ['What is included in practice?', 'City, highway, maneuvers (parallel/perpendicular/garage), parking with camera, and night driving if possible.'],
      ['How long is the course?', 'Usually 6–8 weeks depending on schedule.'],
      ['How are driving lessons held?', 'In real city traffic + maneuvers and parking.'],
      ['What documents are required?', 'ID, photo, medical certificate, others if needed.'],
      ['Can I pay in installments?', 'Yes — flexible plans available.']
    ],
    pricingTitle: 'Pricing & schedule',
    planStandard: ['Standard', 'Everything needed for the exam', 'Includes theory + practice + internal mock exams.'],
    planInstallments: ['Installments', 'Pay in parts', 'Flexible plans tailored to your calendar.'],
    instructorTitle: 'Instructor & classroom',
    instructorCardTitle: 'Dimitar — licensed instructor',
    instructorCardText: 'Many years of experience, calm approach and clear explanations.',
    classroomTitle: 'Classroom (Theory)',
    classroomText: 'Dedicated room with visuals and equipment.',
    carSection: 'Car',
    carBullet: 'Hyundai i30 · diesel · manual gearbox',
    reviews: 'Reviews',
    contacts: 'Contacts',
    mapTitle: 'Map: Rumi Driving School',
    hours: 'Mon–Fri 09:00–19:00, Sat 10:00–15:00',
    addressPrefix: 'Classroom address — ',
    formTitle: 'Course enrollment',
    formName: 'Full name',
    formPhone: 'Phone',
    formEmail: 'Email',
    formStartDate: 'Start date',
    formSubmit: 'Save spot',
    formGDPR: 'I agree to personal data processing (GDPR)',
    sentThanks: 'Thanks! We will contact you shortly.',
    sentOk: 'Sent! We will reach out soon.',
    courseOptions: {
      b_standard: 'Category B - standard course',
      b_refresh: 'Category B - refresher lessons',
      b_extra: 'Category B - additional hours'
    },
    detailsTitle: 'Category B — details',
    detailsIntro: 'Full theory syllabus + practice information.',
    showContent: 'Show theory syllabus',
    hideContent: 'Hide syllabus',
    topics: [
      '• Road law, signs, markings',
      '• Safety basics, defensive driving',
      '• Vehicle control, seating, mirrors',
      '• Intersections, right of way, roundabouts',
      '• Parking & maneuvers (parallel, perpendicular, garage)',
      '• Motorway & rural roads',
      '• Special conditions: night, rain/snow',
      '• First aid & at-accident actions',
      '• Exam preparation (theory & practice)'
    ],
    close: 'Close',
    chooseDateRefresh: 'Choose date for refresher',
    priceTitle: 'Prices — refresher/individual',
    prices: ['up to 5 lessons — 45 BGN/hour', '6–10 lessons — 40 BGN/hour', '11–15 lessons — 38 BGN/hour', '20–30 lessons — 35 BGN/hour'],
    perHour: 'BGN/hour',
    voucherModalTitle: 'Gift voucher 🎁',
    voucherText: 'Gift a voucher for a full course or a package of individual lessons. Perfect for a loved one who wants to start driving confidently.',
    orderVoucher: 'Get voucher',
    footer: (year: number) => `© Rumi ${year} · All rights reserved · Version ${VERSION}`,
    locale: 'en-US'
  },
  ru: {
    brand: 'РУМИ · Автошкола',
    nav: ['Как проходит', 'Курсы', 'Цены', 'Инструктор', 'Вопросы', 'Контакты'],
    heroTitle: 'Уверенное вождение начинается здесь.',
    heroLead:
      'Лицензированный инструктор. Реальные ситуации. Современный класс. Практика на Hyundai i30 (дизель, механика).',
    call: 'Позвонить',
    ctaEnroll: 'Записаться',
    ctaEnrollNow: 'Записаться сейчас',
    theorySchedule: 'Расписание теории',
    weekdayShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    startTheory: 'Начало теории',
    theory: 'Теория',
    features: [
      ['Лицензированный инструктор', 'Личный подход и понятные объяснения.'],
      ['Практика в городе', 'Подготовка к реальным ситуациям и манёврам.'],
      ['Оборудованный класс', 'Комфорт и наглядные материалы.'],
      ['Гибкий график', 'Утро/вечер/выходные.'],
      ['Подготовка к экзамену', 'Внутренние проверки и критерии.'],
      ['Высокая успешность', 'Фокус на безопасность и уверенность.']
    ],
    processTitle: 'Как проходит обучение',
    steps: ['Запись', 'Медкомиссия', 'Теория', 'Практика', 'Госэкзамен'],
    coursesTitle: 'Курсы',
    coursesLead: 'Выберите программу под ваши задачи. Все включают теорию и практику.',
    bStandard: 'Категория B – стандартный курс',
    bStandardDesc: 'Теория + 31 урок практики',
    seeDetails: 'Подробнее',
    enroll: 'Записаться',
    refreshTitle: 'Повторные и индивидуальные занятия',
    price: 'Цена',
    plan: 'Запланировать',
    voucherTitle: 'Подарочный ваучер 🎁',
    voucherLead: 'Подарите ваучер на теорию и практику.',
    getVoucher: 'Получить ваучер',
    faqTitle: 'Частые вопросы',
    faqs: [
      ['С какого возраста можно записаться?', 'Минимум 17 лет и 9 месяцев на дату начала курса (кат. B).'],
      ['Что входит в практику?', 'Город, трасса, манёвры (параллельная/перпендикулярная/гараж), парковка с камерой и ночное вождение.'],
      ['Сколько длится курс?', 'Обычно 6–8 недель в зависимости от графика.'],
      ['Как проходят занятия по вождению?', 'В реальных условиях города + манёвры и парковка.'],
      ['Какие документы нужны?', 'Удостоверение личности, фото, медсправка и др. при необходимости.'],
      ['Можно ли платить частями?', 'Да — гибкие планы оплаты.']
    ],
    pricingTitle: 'Цены и расписание',
    planStandard: ['Стандарт', 'Всё для экзамена', 'Включает теорию + практику + внутренние проверки.'],
    planInstallments: ['В рассрочку', 'Оплата частями', 'Гибкие планы и индивидуальный график.'],
    instructorTitle: 'Инструктор и класс',
    instructorCardTitle: 'Димитар — лицензированный инструктор',
    instructorCardText: 'Большой опыт, спокойный подход и понятные пояснения.',
    classroomTitle: 'Класс (Теория)',
    classroomText: 'Отдельный зал с наглядными материалами.',
    carSection: 'Автомобиль',
    carBullet: 'Hyundai i30 · дизель · механика',
    reviews: 'Отзывы',
    contacts: 'Контакты',
    mapTitle: 'Карта: Автошкола Руми',
    hours: 'Пн–Пт 09:00–19:00, Сб 10:00–15:00',
    addressPrefix: 'Адрес класса — ',
    formTitle: 'Запись на курс',
    formName: 'Имя и фамилия',
    formPhone: 'Телефон',
    formEmail: 'Email',
    formStartDate: 'Дата начала',
    formSubmit: 'Забронировать',
    formGDPR: 'Согласен(на) на обработку персональных данных (GDPR)',
    sentThanks: 'Спасибо! Мы свяжемся с вами для подтверждения.',
    sentOk: 'Отправлено! Скоро свяжемся.',
    courseOptions: {
      b_standard: 'Категория B - стандартный курс',
      b_refresh: 'Категория B - повторные занятия',
      b_extra: 'Категория B - дополнительные часы'
    },
    detailsTitle: 'Категория B — детали',
    detailsIntro: 'Полная программа теории + информация о практике.',
    showContent: 'Показать программу теории',
    hideContent: 'Скрыть программу',
    topics: [
      '• ПДД, знаки, разметка',
      '• Основы безопасности, защитное вождение',
      '• Владение автомобилем, посадка, зеркала',
      '• Перекрёстки, приоритет, круговое',
      '• Парковка и манёвры (параллельная, перпендикулярная, гараж)',
      '• Автомагистраль и загородные дороги',
      '• Особые условия: ночь, дождь/снег',
      '• Первая помощь и действия при ДТП',
      '• Подготовка к экзамену (теория и практика)'
    ],
    close: 'Закрыть',
    chooseDateRefresh: 'Выберите дату для повторных',
    priceTitle: 'Цены — повторные/индивидуальные',
    prices: ['до 5 часов — 45 лв/час', '6–10 часов — 40 лв/час', '11–15 часов — 38 лв/час', '20–30 часов — 35 лв/час'],
    perHour: 'лв/час',
    voucherModalTitle: 'Подарочный ваучер 🎁',
    voucherText: 'Подарите ваучер на полный курс или пакет индивидуальных занятий. Прекрасный подарок близкому человеку, который хочет уверенно водить.',
    orderVoucher: 'Заказать ваучер',
    footer: (year: number) => `© Руми ${year} · Все права защищены · Версия ${VERSION}`,
    locale: 'ru-RU'
  }
} as const;

type Strings = (typeof i18n)[Lang];

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

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ open, title, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-neutral-200 p-1 text-neutral-500 hover:bg-neutral-100"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-neutral-700">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  course: keyof Strings['courseOptions'];
  gdpr: boolean;
}
export default function App() {
  const [lang, setLang] = useState<Lang>('bg');
  const t = i18n[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('process');
  const [modal, setModal] = useState<null | 'course' | 'price' | 'schedule' | 'voucher'>(null);
  const [showTheoryTopics, setShowTheoryTopics] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const upcomingStarts = useMemo(() => listUpcomingStarts(BASE_MONDAY, 12), []);
  const allowedStartSet = useMemo(() => new Set(upcomingStarts.map((item) => item.iso)), [upcomingStarts]);
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

  useEffect(() => {
    if (!startDate && upcomingStarts.length > 0) {
      setStartDate(upcomingStarts[0].iso);
    }
  }, [startDate, upcomingStarts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as NavSection;
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -45% 0px',
        threshold: 0.2
      }
    );

    NAV_SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
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
    if (allowedStartSet.has(iso)) {
      setStartDate(iso);
    }
  };

  const handleScrollTo = (id: NavSection) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedStartDateLabel = startDate
    ? new Date(startDate).toLocaleDateString(t.locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <span className="text-lg font-semibold text-red-600">{t.brand}</span>
            <nav className="hidden gap-4 md:flex">
              {t.nav.map((label, index) => {
                const id = NAV_SECTION_IDS[index];
                const active = activeSection === id;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleScrollTo(id)}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      active ? 'bg-red-100 text-red-700' : 'hover:bg-neutral-100'
                    }`}
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
              className="hidden rounded-full border px-4 py-2 text-sm md:inline-flex"
            >
              {t.call}
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
                  const id = NAV_SECTION_IDS[index];
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleScrollTo(id);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100"
                    >
                      {label}
                    </button>
                  );
                })}
                <div className="flex gap-2">
                  <a href="tel:+3598977777430" className="flex-1 rounded-xl border px-3 py-2 text-sm">
                    {t.call}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleScrollTo('contact');
                    }}
                    className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white"
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
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Hyundai_i30_PD_Fiery_Red_%2814%29.jpg"
                  alt="Hyundai i30"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-xs text-neutral-500">Hyundai i30 (stock image).</p>
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
                  <div className="mb-1 text-xs text-neutral-500">{index + 1}.</div>
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
              <div className="flex flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                  <Car size={18} />
                </div>
                <div className="font-semibold">{t.bStandard}</div>
                <div className="mt-2 text-sm text-neutral-600">{t.bStandardDesc}</div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal('course')}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {t.seeDetails}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {t.enroll}
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                  <Car size={18} />
                </div>
                <div className="font-semibold">{t.refreshTitle}</div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal('price')}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {t.price}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal('schedule')}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {t.plan}
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                  <Car size={18} />
                </div>
                <div className="font-semibold">{t.voucherTitle}</div>
                <div className="text-sm text-neutral-600">{t.voucherLead}</div>
                <div className="mt-auto pt-3">
                  <button
                    type="button"
                    onClick={() => setModal('voucher')}
                    className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100"
                  >
                    {t.getVoucher}
                  </button>
                </div>
              </div>
            </div>
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

        <section className="border-t bg-neutral-50" id="pricing">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t.pricingTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[t.planStandard, t.planInstallments].map(([title, subtitle, note]) => (
                <div key={title} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="text-lg font-semibold">{title}</div>
                  <div className="text-sm text-neutral-600">{subtitle}</div>
                  <div className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">{note}</div>
                  <button
                    type="button"
                    onClick={() => handleScrollTo('contact')}
                    className="mt-5 w-full rounded-xl bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    {t.formSubmit}
                  </button>
                </div>
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
                <div className="font-semibold">{t.classroomTitle}</div>
                <p className="mt-2 text-sm text-neutral-700">{t.classroomText}</p>
              </div>
            </div>
            <h3 className="mt-10 text-xl font-semibold md:text-2xl">{t.carSection}</h3>
            <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-full bg-neutral-100 p-2 text-neutral-600">
                <Car size={18} />
              </div>
              <ul className="space-y-1 text-sm text-neutral-700">
                <li>{t.carBullet}</li>
              </ul>
              <div className="mt-3 overflow-hidden rounded-xl border">
                <img
                  alt="Hyundai i30"
                  className="h-full w-full object-cover"
                  src="https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/X3qgFrmQnyB7iCa6jmWA"
                />
              </div>
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
                  <Mail size={18} /> info@rumi-autoshkola.bg
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} /> {t.addressPrefix}g.k. TroshevoMladost, бул. „Владислав Варненчик“ 184, 9009 Varna
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
                    src={`https://www.google.com/maps?q=${encodeURIComponent('g.k. TroshevoMladost, бул. „Владислав Варненчик“ 184, 9009 Varna')}&output=embed`}
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
                      {upcomingStarts.map((item) => (
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
        </div>
      </footer>

      <Modal
        open={modal === 'course'}
        onClose={() => setModal(null)}
        title={t.detailsTitle}
      >
        <p>{t.detailsIntro}</p>
        <button
          type="button"
          className="text-sm font-semibold text-red-600 underline"
          onClick={() => setShowTheoryTopics((prev) => !prev)}
        >
          {showTheoryTopics ? t.hideContent : t.showContent}
        </button>
        {showTheoryTopics && (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {t.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          onClick={() => {
            setModal(null);
            handleScrollTo('contact');
          }}
        >
          {t.enroll}
        </button>
      </Modal>

      <Modal
        open={modal === 'price'}
        onClose={() => setModal(null)}
        title={t.priceTitle}
      >
        <ul className="space-y-2 text-sm">
          {t.prices.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button
          type="button"
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          onClick={() => {
            setModal(null);
            handleScrollTo('contact');
          }}
        >
          {t.plan}
        </button>
      </Modal>

      <Modal
        open={modal === 'schedule'}
        onClose={() => setModal(null)}
        title={t.chooseDateRefresh}
      >
        <p className="text-sm text-neutral-600">{t.startTheory}: {selectedStartDateLabel}</p>
        <ul className="space-y-2 text-sm">
          {upcomingStarts.map((item) => (
            <li key={item.iso} className="flex items-center justify-between">
              <span>
                {new Date(item.iso).toLocaleDateString(t.locale, {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <button
                type="button"
                className="rounded-lg border px-2 py-1 text-xs hover:bg-neutral-100"
                onClick={() => {
                  setStartDate(item.iso);
                  setModal(null);
                  handleScrollTo('contact');
                }}
              >
                {t.formSubmit}
              </button>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={modal === 'voucher'}
        onClose={() => setModal(null)}
        title={t.voucherModalTitle}
      >
        <p>{t.voucherText}</p>
        <button
          type="button"
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          onClick={() => setModal(null)}
        >
          {t.orderVoucher}
        </button>
      </Modal>
    </div>
  );
}
