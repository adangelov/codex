import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronDown, CheckCircle2, Star, MapPin, Mail, Clock, Car, User, CalendarDays, ClipboardCheck, Stethoscope, BookOpen, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

// ===== Config =====
const VERSION = 2; // revert footer version to 2

// ===== i18n =====
const i18n = {
  bg: {
    brand: "РУМИ · Автошкола",
    nav: ["Как протича", "Курсове", "Цени", "Инструктор", "FAQ", "Контакти"],
    heroTitle: "Увереното шофиране започва тук.",
    heroLead: "Лицензиран инструктор. Реални ситуации. Модерна учебна среда. Практика с Hyundai i30 (дизел, ръчни скорости).",
    call: "Обади се",
    ctaEnroll: "Запиши се",
    ctaEnrollNow: "Запиши се сега",
    theorySchedule: "График теория",
    weekdayShort: ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"],
    startTheory: "Старт на теория",
    theory: "Теория",
    features: [
      ["Лицензиран инструктор с опит", "Истинско внимание и личен подход."],
      ["Практика в градски условия", "Подготовка за реални ситуации и маневри."],
      ["Специално оборудвана класна стая", "Комфорт, визуални материали и структуриран курс."],
      ["Индивидуален график", "Удобни часове сутрин/вечер/уикенд."],
      ["Подготовка за КАТ", "Вътрешни изпити и ясни критерии."],
      ["Висока успеваемост", "Фокус върху сигурност и увереност."],
    ],
    processTitle: "Как протича обучението",
    steps: ["Записване", "Медицинско", "Теория", "Практика", "Държавен изпит"],
    coursesTitle: "Курсове",
    coursesLead: "Изберете програма според нуждите си. Всички включват теория и практика.",
    bStandard: "Категория B – стандартен курс",
    bStandardDesc: "Теория + 31 учебни часа практика",
    seeDetails: "Виж детайли",
    enroll: "Запиши се",
    refreshTitle: "Опреснителни и индивидуални часове",
    price: "Цена",
    plan: "Планирай час",
    voucherTitle: "Подари ваучер 🎁",
    voucherLead: "Подари на близък ваучер за теория и практика.",
    getVoucher: "Вземи ваучер",
    faqTitle: "Често задавани въпроси",
    faqs: [
      ["На колко навършени години трябва да съм, за да се запиша?", "Минимум 17 г. и 9 месеца към датата на започване на курса (за категория B)."],
      ["Какво влиза като практика в курса?", "Градско шофиране, извънградско, маневри (успоредно/перпендикулярно/гараж), паркиране с камера за заден ход и нощно кормуване при възможност."],
      ["Колко време продължава курсът?", "Обичайно 6–8 седмици според графика и натовареността."],
      ["Как се провеждат часовете по кормуване?", "В реални градски условия по утвърден маршрут + маневри и паркиране."],
      ["Какви документи трябват?", "Лична карта, снимка, медицинско и други при необходимост."],
      ["Мога ли да плащам разсрочено?", "Да — предлагаме гъвкави планове."],
    ],
    pricingTitle: "Цени и график",
    planStandard: ["Стандартен", "Всичко необходимо за изпита", "Включва теория + практика"],
    planInstallments: ["Разсрочено", "Плащане на части", "Гъвкави планове"],
    instructorTitle: "Инструктор и класна стая",
    instructorCardTitle: "Димитър — лицензиран инструктор",
    instructorCardText: "Дългогодишен опит, спокоен подход и ясни обяснения. Индивидуално внимание според темпото ви.",
    classroomTitle: "Класна стая (Теория)",
    classroomText: "Специално оборудвана зала с визуални материали и удобства за ефективно усвояване.",
    carSection: "Автомобил",
    carBullet: "Hyundai i30 · дизел · ръчна скоростна кутия",
    reviews: "Отзиви",
    contacts: "Контакти",
    mapTitle: "Карта: Автошкола Руми",
    hours: "Пн–Пт 09:00–19:00, Съб 10:00–15:00",
    addressPrefix: "Адрес на класната стая — ",
    formTitle: "Записване за курс",
    formName: "Име и фамилия",
    formPhone: "Телефон",
    formEmail: "Имейл",
    formStartDate: "Дата старт (автопопълване)",
    formSubmit: "Запази място",
    formGDPR: "Съгласен/на съм с обработката на личните ми данни (GDPR)",
    sentThanks: "Благодарим! Ще се свържем с вас за потвърждение.",
    sentOk: "Изпратено! Ще ви потърсим до скоро.",
    courseOptions: {
      b_standard: "Категория B - стандартен курс",
      b_refresh: "Категория B - опреснителни курсове",
      b_extra: "Категория B - допълнителни часове",
    },
    detailsTitle: "Категория B — детайли",
    detailsIntro: "Пълна програма на теоретичното обучение + информация за практиката.",
    showContent: "Съдържание на теоретично обучение",
    hideContent: "Скрий съдържанието",
    topics: [
      "• Закон за движение по пътищата, знаци, маркировка",
      "• Основи на безопасността, дефанзивно шофиране",
      "• Техника на управление, позиция, огледала",
      "• Кръстовища, предимство, кръгово",
      "• Паркиране и маневри (успоредно, перпендикулярно, гараж)",
      "• Автомагистрала и извънградско",
      "• Особени условия: нощно, дъжд/сняг",
      "• Първа помощ и действия при ПТП",
      "• Подготовка за изпит (теория и практика)",
    ],
    close: "Затвори",
    chooseDateRefresh: "Избери дата за опреснителни",
    priceTitle: "Цени — опреснителни/индивидуални",
    prices: [
      "до 5 часа — ", "6–10 часа — ", "11–15 часа — ", "20–30 часа — "
    ],
    perHour: "лв/час",
    voucherModalTitle: "Подаръчен ваучер 🎁",
    voucherText: "Подари ваучер за пълен курс теория + практика или за пакет индивидуални часове. Идеален подарък за близък човек, който иска да започне да шофира уверено.",
    orderVoucher: "Поръчай ваучер",
    footer: (year) => `© Руми ${year} · Всички права запазени · Версия ${VERSION}`,
    locale: "bg-BG",
  },
  en: {
    brand: "RUMI · Driving School",
    nav: ["How it works", "Courses", "Pricing", "Instructor", "FAQ", "Contacts"],
    heroTitle: "Confident driving starts here.",
    heroLead: "Licensed instructor. Real-world situations. Modern classroom. Practice with Hyundai i30 (diesel, manual).",
    call: "Call",
    ctaEnroll: "Enroll",
    ctaEnrollNow: "Enroll now",
    theorySchedule: "Theory schedule",
    weekdayShort: ["Mo","Tu","We","Th","Fr","Sa","Su"],
    startTheory: "Theory start",
    theory: "Theory",
    features: [
      ["Licensed instructor", "Personal attention and clear guidance."],
      ["City driving practice", "Training for real situations and maneuvers."],
      ["Equipped classroom", "Comfort, visuals and structured course."],
      ["Flexible schedule", "Morning/evening/weekend hours."],
      ["Exam preparation", "Internal tests and clear criteria."],
      ["High success rate", "Focus on safety and confidence."],
    ],
    processTitle: "How the training works",
    steps: ["Enrollment", "Medical", "Theory", "Practice", "State exam"],
    coursesTitle: "Courses",
    coursesLead: "Choose a program for your needs. All include theory and practice.",
    bStandard: "Category B – standard course",
    bStandardDesc: "Theory + 31 practice lessons",
    seeDetails: "See details",
    enroll: "Enroll",
    refreshTitle: "Refresher & individual lessons",
    price: "Price",
    plan: "Plan a lesson",
    voucherTitle: "Gift a voucher 🎁",
    voucherLead: "Gift a voucher for theory and practice.",
    getVoucher: "Get voucher",
    faqTitle: "Frequently asked questions",
    faqs: [
      ["What minimum age do I need?", "At least 17 years and 9 months at course start (Category B)."],
      ["What is included in practice?", "City, highway, maneuvers (parallel/perpendicular/garage), parking with camera, and night driving if possible."],
      ["How long is the course?", "Usually 6–8 weeks depending on schedule."],
      ["How are driving lessons held?", "In real city traffic + maneuvers and parking."],
      ["What documents are required?", "ID, photo, medical certificate, others if needed."],
      ["Can I pay in installments?", "Yes — flexible plans available."],
    ],
    pricingTitle: "Pricing & schedule",
    planStandard: ["Standard", "Everything needed for the exam", "Includes theory + practice"],
    planInstallments: ["Installments", "Pay in parts", "Flexible plans"],
    instructorTitle: "Instructor & classroom",
    instructorCardTitle: "Dimitar — licensed instructor",
    instructorCardText: "Many years of experience, calm approach and clear explanations.",
    classroomTitle: "Classroom (Theory)",
    classroomText: "Dedicated room with visuals and equipment.",
    carSection: "Car",
    carBullet: "Hyundai i30 · diesel · manual gearbox",
    reviews: "Reviews",
    contacts: "Contacts",
    mapTitle: "Map: Rumi Driving School",
    hours: "Mon–Fri 09:00–19:00, Sat 10:00–15:00",
    addressPrefix: "Classroom address — ",
    formTitle: "Course enrollment",
    formName: "Full name",
    formPhone: "Phone",
    formEmail: "Email",
    formStartDate: "Start date (auto)",
    formSubmit: "Save spot",
    formGDPR: "I agree to personal data processing (GDPR)",
    sentThanks: "Thanks! We'll contact you soon.",
    sentOk: "Sent! We'll reach out shortly.",
    courseOptions: {
      b_standard: "Category B - standard course",
      b_refresh: "Category B - refresher lessons",
      b_extra: "Category B - additional hours",
    },
    detailsTitle: "Category B — details",
    detailsIntro: "Full theory syllabus + practice information.",
    showContent: "Show theory syllabus",
    hideContent: "Hide syllabus",
    topics: [
      "• Road law, signs, markings",
      "• Safety basics, defensive driving",
      "• Vehicle control, seating, mirrors",
      "• Intersections, right of way, roundabouts",
      "• Parking & maneuvers (parallel, perpendicular, garage)",
      "• Motorway & rural roads",
      "• Special conditions: night, rain/snow",
      "• First aid & at-accident actions",
      "• Exam preparation (theory & practice)",
    ],
    close: "Close",
    chooseDateRefresh: "Choose date for refresher",
    priceTitle: "Prices — refresher/individual",
    prices: ["up to 5 hours — ", "6–10 hours — ", "11–15 hours — ", "20–30 hours — "],
    perHour: "BGN/hour",
    voucherModalTitle: "Gift voucher 🎁",
    voucherText: "Gift a voucher for full course or a package of individual lessons.",
    orderVoucher: "Get voucher",
    footer: (year) => `© Rumi ${year} · All rights reserved · Version ${VERSION}`,
    locale: "en-US",
  },
  ru: {
    brand: "РУМИ · Автошкола",
    nav: ["Как проходит", "Курсы", "Цены", "Инструктор", "Вопросы", "Контакты"],
    heroTitle: "Уверенное вождение начинается здесь.",
    heroLead: "Лицензированный инструктор. Реальные ситуации. Современный класс. Практика на Hyundai i30 (дизель, механика).",
    call: "Позвонить",
    ctaEnroll: "Записаться",
    ctaEnrollNow: "Записаться сейчас",
    theorySchedule: "Расписание теории",
    weekdayShort: ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],
    startTheory: "Начало теории",
    theory: "Теория",
    features: [
      ["Лицензированный инструктор", "Личный подход и понятные объяснения."],
      ["Практика в городе", "Подготовка к реальным ситуациям и манёврам."],
      ["Оборудованный класс", "Комфорт и наглядные материалы."],
      ["Гибкий график", "Утро/вечер/выходные."],
      ["Подготовка к экзамену", "Внутренние проверки и критерии."],
      ["Высокая успешность", "Фокус на безопасность и уверенность."],
    ],
    processTitle: "Как проходит обучение",
    steps: ["Запись", "Медкомиссия", "Теория", "Практика", "Госэкзамен"],
    coursesTitle: "Курсы",
    coursesLead: "Выберите программу под ваши задачи. Все включают теорию и практику.",
    bStandard: "Категория B – стандартный курс",
    bStandardDesc: "Теория + 31 урок практики",
    seeDetails: "Подробнее",
    enroll: "Записаться",
    refreshTitle: "Повторные и индивидуальные занятия",
    price: "Цена",
    plan: "Запланировать",
    voucherTitle: "Подарочный ваучер 🎁",
    voucherLead: "Подарите ваучер на теорию и практику.",
    getVoucher: "Получить ваучер",
    faqTitle: "Частые вопросы",
    faqs: [
      ["С какого возраста можно записаться?", "Минимум 17 лет и 9 месяцев на дату начала курса (кат. B)."],
      ["Что входит в практику?", "Город, трасса, манёвры (параллельная/перпендикулярная/гараж), парковка с камерой, ночное вождение."],
      ["Сколько длится курс?", "Обычно 6–8 недель в зависимости от графика."],
      ["Как проходят занятия по вождению?", "В реальных условиях города + манёвры и парковка."],
      ["Какие документы нужны?", "Удостоверение личности, фото, медсправка и др. при необходимости."],
      ["Можно ли платить частями?", "Да — гибкие планы оплаты."],
    ],
    pricingTitle: "Цены и расписание",
    planStandard: ["Стандарт", "Всё для экзамена", "Включает теорию + практику"],
    planInstallments: ["В рассрочку", "Оплата частями", "Гибкие планы"],
    instructorTitle: "Инструктор и класс",
    instructorCardTitle: "Димитар — лицензированный инструктор",
    instructorCardText: "Большой опыт, спокойный подход и понятные пояснения.",
    classroomTitle: "Класс (Теория)",
    classroomText: "Отдельный зал с наглядными материалами.",
    carSection: "Автомобиль",
    carBullet: "Hyundai i30 · дизель · механика",
    reviews: "Отзывы",
    contacts: "Контакты",
    mapTitle: "Карта: Автошкола Руми",
    hours: "Пн–Пт 09:00–19:00, Сб 10:00–15:00",
    addressPrefix: "Адрес класса — ",
    formTitle: "Запись на курс",
    formName: "Имя и фамилия",
    formPhone: "Телефон",
    formEmail: "Email",
    formStartDate: "Дата начала (авто)",
    formSubmit: "Забронировать",
    formGDPR: "Согласен(на) на обработку персональных данных (GDPR)",
    sentThanks: "Спасибо! Мы свяжемся с вами скоро.",
    sentOk: "Отправлено! Скоро свяжемся.",
    courseOptions: {
      b_standard: "Категория B - стандартный курс",
      b_refresh: "Категория B - повторные занятия",
      b_extra: "Категория B - дополнительные часы",
    },
    detailsTitle: "Категория B — детали",
    detailsIntro: "Полная программа теории + информация о практике.",
    showContent: "Показать программу теории",
    hideContent: "Скрыть программу",
    topics: [
      "• ПДД, знаки, разметка",
      "• Основы безопасности, защитное вождение",
      "• Владение автомобилем, посадка, зеркала",
      "• Перекрестки, приоритет, круговое",
      "• Парковка и манёвры (параллельная, перпендикулярная, гараж)",
      "• Автомагистраль и загородные дороги",
      "• Особые условия: ночь, дождь/снег",
      "• Первая помощь и действия при ДТП",
      "• Подготовка к экзамену (теория и практика)",
    ],
    close: "Закрыть",
    chooseDateRefresh: "Выберите дату для повторных",
    priceTitle: "Цены — повторные/индивидуальные",
    prices: ["до 5 часов — ", "6–10 часов — ", "11–15 часов — ", "20–30 часов — "],
    perHour: "лв/час",
    voucherModalTitle: "Подарочный ваучер 🎁",
    voucherText: "Подарите ваучер на полный курс или пакет индивидуальных занятий.",
    orderVoucher: "Заказать ваучер",
    footer: (year) => `© Руми ${year} · Все права защищены · Версия ${VERSION}`,
    locale: "ru-RU",
  }
};

const monthName = (y, m, locale) => new Date(y, m, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const mondayOnOrBefore = (d) => {
  const day = d.getDay();
  const diff = (day + 6) % 7; // Mon=0
  const out = new Date(d);
  out.setDate(out.getDate() - diff);
  return out;
};

function getCycleStartMonday(date, baseMonday) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(baseMonday.getFullYear(), baseMonday.getMonth(), baseMonday.getDate())) / msPerDay);
  const weekOffset = Math.floor(diffDays / 7);
  const dayOfWeek = date.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const phase = ((weekOffset % 3) + 3) % 3; // 0,1 theory; 2 break
  if (phase === 2 || !isWeekday) return null;
  const cycleStartWeeks = weekOffset - phase;
  const start = new Date(baseMonday);
  start.setDate(start.getDate() + cycleStartWeeks * 7);
  return start;
}

function classifyTheoryDate(date, baseMonday) {
  const start = getCycleStartMonday(date, baseMonday);
  if (!start) return { theory: false, start: false, startIso: null };
  const iso = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-${String(start.getDate()).padStart(2,'0')}`;
  const isStartSame = date.getFullYear() === start.getFullYear() && date.getMonth() === start.getMonth() && date.getDate() === start.getDate();
  return { theory: true, start: isStartSame, startIso: iso };
}

function SmallCalendar({ value, onPrev, onNext, onPick, locale, weekdays }) {
  const y = value.getFullYear();
  const m = value.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startWeekday = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const ym = `${y}-${String(m+1).padStart(2,'0')}`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button onClick={onPrev} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50"><ChevronLeft size={14}/></button>
        <div className="min-w-[9rem] text-center text-xs font-medium uppercase text-neutral-600">{monthName(y, m, locale)}</div>
        <button onClick={onNext} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50"><ChevronRight size={14}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500">
        {weekdays.map(w => (<div key={w} className="py-1">{w}</div>))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d,i)=> d===null
          ? <div key={i} className="h-8 rounded-md"/>
          : <button key={i} onClick={()=>onPick(`${ym}-${String(d).padStart(2,'0')}`)} className="h-8 rounded-md bg-neutral-100 text-sm hover:bg-neutral-200">{d}</button>
        )}
      </div>
    </div>
  );
}

function listUpcomingStarts(baseMonday, count = 12) {
  const out = [];
  const today = new Date(); today.setHours(0,0,0,0);
  let weekIdx = 0;
  while (out.length < count && weekIdx < 156) {
    const d = new Date(baseMonday); d.setDate(d.getDate() + weekIdx * 7);
    const diffDays = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(baseMonday.getFullYear(), baseMonday.getMonth(), baseMonday.getDate())) / (24*3600*1000));
    const weekOffset = Math.floor(diffDays / 7);
    const phase = ((weekOffset % 3) + 3) % 3;
    const isStartMonday = phase === 0;
    if (isStartMonday && d >= today) {
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      out.push({ iso, date: d });
    }
    weekIdx += 1;
  }
  return out;
}

export default function RumiAutoSchool() {
  const [lang, setLang] = useState('bg');
  const t = i18n[lang];

  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [courseType, setCourseType] = useState('b_standard');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [showTheoryTopics, setShowTheoryTopics] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [miniCalDate, setMiniCalDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState('process');
  const formRef = useRef(null);
  const dateSelectRef = useRef(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const buildCalendar = () => {
    const y = viewYear; const m = viewMonth;
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const baseMonday = mondayOnOrBefore(first);
    const startWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = last.getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const ym = `${y}-${String(m+1).padStart(2,'0')}`;
    return { cells, ym, baseMonday };
  };

  const { cells, ym, baseMonday } = buildCalendar();

  const [allowedStarts, setAllowedStarts] = useState([]);
  useEffect(() => {
    const starts = listUpcomingStarts(baseMonday, 18).map(({ iso, date }) => ({ iso, label: date.toLocaleDateString(t.locale, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) }));
    setAllowedStarts(starts);
  }, [baseMonday, t.locale]);

  useEffect(() => {
    if (sent && formRef.current) {
      formRef.current.reset();
      setStartDate("");
      setCourseType('b_standard');
    }
  }, [sent]);

  useEffect(() => {
    const sections = ["process","courses","pricing","instructor","faq","contact"];
    const onScroll = () => {
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - 140 <= 0) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeMonth = (delta) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const onPickTheoryDate = (isoStart) => {
    setStartDate(isoStart);
    setCourseType('b_standard');
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-red-600" />
            <span className="font-semibold tracking-wide">{t.brand}</span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {/* Language switcher */}
            {(['bg','en','ru'] as const).map(code => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`rounded-xl px-2 py-1 text-xs ${lang===code? 'bg-red-600 text-white' : 'border hover:bg-neutral-100'}`}
                aria-pressed={lang===code}
              >{code.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-3">
          <nav className="hidden items-center gap-6 md:flex">
            {t.nav.map((label, idx) => {
              const ids = ["process","courses","pricing","instructor","faq","contact"];
              const id = ids[idx];
              const active = activeSection === id;
              return (
                <button
                  key={label}
                  onClick={() => scrollToId(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`pb-1 border-b-2 ${active? 'border-red-600 text-red-700':'border-transparent hover:text-red-700'}`}
                >{label}</button>
              );
            })}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <a href="tel:+3598977777430" className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm hover:bg-neutral-100"><Phone size={16}/> {t.call}</a>
            <button onClick={() => setFormOpen(true)} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700">{t.ctaEnroll}</button>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <ChevronDown className={`transition ${menuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden">
            <div className="mx-auto max-w-6xl px-4 pb-3">
              <div className="grid gap-2">
                {/* Mobile language switcher */}
                <div className="flex gap-2">
                  {(['bg','en','ru'] as const).map(code => (
                    <button key={code} onClick={()=>setLang(code)} className={`rounded-xl px-2 py-1 text-xs ${lang===code? 'bg-red-600 text-white' : 'border'}`}>{code.toUpperCase()}</button>
                  ))}
                </div>
                {t.nav.map((label, idx) => {
                  const ids = ["process","courses","pricing","instructor","faq","contact"];
                  const id = ids[idx];
                  const active = activeSection === id;
                  return (
                    <button key={label} onClick={() => { setMenuOpen(false); scrollToId(id); }} className={`rounded-xl px-3 py-2 text-left ${active? 'bg-red-50 text-red-800':'hover:bg-neutral-100'}`}>{label}</button>
                  );
                })}
                <div className="mt-2 flex gap-2">
                  <a href="tel:+3598977777430" className="flex-1 rounded-xl border px-3 py-2 text-sm">{t.call}</a>
                  <button onClick={() => setFormOpen(true)} className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white">{t.ctaEnroll}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero + Mini Calendar */}
      <section className="border-b bg-gradient-to-b from-white to-neutral-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-3xl font-bold leading-tight md:text-5xl">
              {t.heroTitle}
            </motion.h1>
            <p className="mt-4 text-neutral-700 md:text-lg">
              {t.heroLead}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => setFormOpen(true)} className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700">{t.ctaEnrollNow}</button>
              <a href="tel:+3598977777430" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 hover:bg-neutral-100"><Phone size={18}/> +359 8977 777 430</a>
            </div>

            {/* Mini calendar for upcoming theory classes */}
            <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold flex items-center gap-2"><CalendarDays size={16}/>{t.theorySchedule}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeMonth(-1)} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50"><ChevronLeft size={14}/></button>
                  <div className="min-w-[9rem] text-center text-xs font-medium uppercase text-neutral-600">{monthName(viewYear, viewMonth, t.locale)}</div>
                  <button onClick={() => changeMonth(1)} className="rounded-xl border px-2 py-1 text-xs hover:bg-neutral-50"><ChevronRight size={14}/></button>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500">
                  {t.weekdayShort.map(w => <div key={w} className="py-1">{w}</div>)}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map((d, i) => {
                    if (d === null) return <div key={i} className="h-8 rounded-md bg-transparent"/>;
                    const iso = `${ym}-${String(d).padStart(2,'0')}`;
                    const dt = new Date(viewYear, viewMonth, d);
                    const { theory, start, startIso } = classifyTheoryDate(dt, baseMonday);
                    const cls = theory
                      ? (start ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-200 text-red-900 hover:bg-red-300')
                      : 'bg-neutral-100 text-neutral-700';
                    return (
                      <button
                        key={i}
                        onClick={() => theory && onPickTheoryDate(startIso)}
                        className={`h-8 rounded-md text-sm ${cls}`}
                        aria-label={`Date ${iso}`}
                        title={theory ? (start ? t.startTheory : t.theory) : ''}
                      >{d}</button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-white shadow-sm">
              <img
                alt="Hyundai i30"
                className="h-full w-full object-cover"
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Hyundai_i30_PD_Fiery_Red_%2814%29.jpg"
              />
            </div>
            <p className="mt-2 text-center text-xs text-neutral-500">Hyundai i30 (stock image).</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12" id="features">
        <div className="grid gap-4 md:grid-cols-3">
          {t.features.map(([title, desc]) => (
            <div key={title} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 inline-flex rounded-full bg-neutral-100 p-2"><CheckCircle2 /></div>
              <div className="font-semibold">{title}</div>
              <div className="text-sm text-neutral-600">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-t bg-neutral-50" id="process">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.processTitle}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {[{title:t.steps[0],icon:<ClipboardCheck/>},{title:t.steps[1],icon:<Stethoscope/>},{title:t.steps[2],icon:<BookOpen/>},{title:t.steps[3],icon:<Car/>},{title:t.steps[4],icon:<GraduationCap/>}].map((step, i) => (
              <li key={step.title} className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
                <div className="mb-1 text-xs text-neutral-500">Стъпка {i + 1}</div>
                <div className="font-semibold text-center">{step.title}</div>
                <div className="mt-2 flex justify-center"><div className="inline-flex rounded-full bg-neutral-100 p-2">{step.icon}</div></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Courses */}
      <section className="border-t bg-white" id="courses">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.coursesTitle}</h2>
          <p className="mt-2 text-neutral-600">{t.coursesLead}</p>
          <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
            {/* B Standard */}
            <div className="h-full">
              <div className="flex h-full flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2"><Car /></div>
                <div className="font-semibold">{t.bStandard}</div>
                <div className="text-sm text-neutral-600">{t.bStandardDesc}</div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button onClick={() => { setCourseModalOpen(true); window.scrollTo({ top: 0, behavior: 'auto' }); }} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100">{t.seeDetails}</button>
                  <button onClick={() => { setCourseType('b_standard'); setFormOpen(false); scrollToId('contact'); setTimeout(()=>{ dateSelectRef.current?.focus(); }, 500); }} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100">{t.enroll}</button>
                </div>
              </div>
            </div>

            {/* Refresh & Individual */}
            <div className="h-full">
              <div className="flex h-full flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2"><Car /></div>
                <div className="font-semibold">{t.refreshTitle}</div>
                <div className="mt-auto flex gap-2 pt-3">
                  <button onClick={() => setPriceModalOpen(true)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100">{t.price}</button>
                  <button onClick={() => setScheduleModalOpen(true)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100">{t.plan}</button>
                </div>
              </div>
            </div>

            {/* Gift Voucher */}
            <div className="h-full">
              <div className="flex h-full flex-col rounded-2xl border p-4 shadow-sm">
                <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2"><Car /></div>
                <div className="font-semibold">{t.voucherTitle}</div>
                <div className="text-sm text-neutral-600">{t.voucherLead}</div>
                <div className="mt-auto pt-3">
                  <button onClick={() => setVoucherModalOpen(true)} className="rounded-xl border px-3 py-2 text-sm hover:bg-neutral-100">{t.getVoucher}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-neutral-50" id="faq">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.faqTitle}</h2>
          <div className="mt-6 space-y-3">
            {t.faqs.map(([q, a]) => (
              <details key={q} className="group rounded-2xl border bg-white p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {q}
                  <ChevronDown className="transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-neutral-700">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-neutral-50" id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.pricingTitle}</h2>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[t.planStandard, t.planInstallments].map(([title, sub, note]) => (
              <div key={title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold">{title}</div>
                <div className="text-sm text-neutral-600">{sub}</div>
                <div className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">{note}</div>
                <button onClick={() => { setCourseType('b_standard'); scrollToId('contact'); setTimeout(()=>{ dateSelectRef.current?.focus(); }, 500); }} className="mt-5 w-full rounded-xl bg-red-600 py-2 font-semibold text-white hover:bg-red-700">{t.formSubmit}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor & Classroom */}
      <section className="border-t bg-white" id="instructor">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.instructorTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2"><User /></div>
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
            <div className="mb-2 inline-flex rounded-full bg-neutral-100 p-2"><Car /></div>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>{t.carBullet}</li>
            </ul>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <img alt="Hyundai i30" className="h-full w-full object-cover" src="https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/X3qgFrmQnyB7iCa6jmWA"/>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.reviews}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1,2,3].map((n) => (
              <div key={n} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-1 text-yellow-600">
                  {Array.from({length:5}).map((_,i)=>(<Star key={i} size={16} fill="currentColor"/>))}
                </div>
                <p className="text-sm text-neutral-700">“Страхотно отношение и ясни обяснения. Съсдадох увереност и взех изпита от първия път!”</p>
                <div className="mt-3 text-xs text-neutral-500">— Иван П.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t bg-white" id="contact">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold md:text-3xl">{t.contacts}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="flex items-center gap-2"><Phone size={18}/> +359 8977 777 430</div>
              <div className="flex items-center gap-2"><Mail size={18}/> info@rumi-autoshkola.bg</div>
              <div className="flex items-center gap-2"><MapPin size={18}/> {t.addressPrefix}g.k. TroshevoMladost, бул. „Владислав Варненчик“ 184, 9009 Varna</div>
              <div className="flex items-center gap-2"><Clock size={18}/> {t.hours}</div>
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
            <div className="rounded-2xl border bg-neutral-50 p-4 shadow-s