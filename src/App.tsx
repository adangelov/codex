import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CourseDetailsPage from './pages/CourseDetailsPage';
import HomePage from './pages/HomePage';
import {
  CategoryBTransitionContext,
  type CategoryBTransitionPhase,
  type CategoryBTransitionContextValue
} from './transition/CategoryBTransitionContext';

interface OverlayState {
  visible: boolean;
  phase: CategoryBTransitionPhase;
  key: number;
}

function CategoryBTransitionOverlay({ state }: { state: OverlayState }) {
  const { visible, phase } = state;

  const title = phase === 'enter' ? 'Подготвяме Категория Б' : 'Излизаме от Категория Б';
  const subtitle =
    phase === 'enter'
      ? 'Моля, изчакайте докато заредим детайлите за обучението.'
      : 'Връщаме ви към останалото съдържание.';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`category-b-overlay-${phase}-${state.key}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="flex max-w-xs flex-col items-center gap-6 text-center"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-6 rounded-full bg-red-100/60 blur-md" aria-hidden />
              <div className="absolute inset-4 rounded-full border-2 border-red-300/70" aria-hidden />
              <motion.div
                className="relative flex h-28 w-28 items-center justify-center text-red-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
              >
                <CartoonHyundai />
              </motion.div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-neutral-900">{title}</p>
              <p className="text-sm text-neutral-500">{subtitle}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartoonHyundai() {
  return (
    <svg
      viewBox="0 0 240 120"
      className="h-full w-full drop-shadow-lg"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hyundai i30 илюстрация"
    >
      <defs>
        <linearGradient id="car-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#c81e1e" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M26 76c3.5-16 13.5-30.5 30-38.8l38-18c8.2-3.8 17.6-3.8 25.8 0l38 18C174.2 45.5 184.2 60 187.7 76H26Z"
          fill="url(#car-body)"
          stroke="#7f1d1d"
          strokeWidth="4"
        />
        <path
          d="M68 48c6-10 17-18 32-18h40c8 0 14.6 2.6 20 8l16 16H68Z"
          fill="url(#car-glass)"
          stroke="#cbd5f5"
          strokeWidth="3"
        />
        <path
          d="M32 76h168c6.4 0 12 4.7 12.8 11l2.2 16H17l2.2-16C20 80.7 25.6 76 32 76Z"
          fill="#991b1b"
          stroke="#7f1d1d"
          strokeWidth="4"
        />
        <path
          d="M82 44h24l-6 18H74l8-18Z"
          fill="#fecdd3"
          stroke="#fb7185"
          strokeWidth="3"
        />
        <path
          d="M136 44h24l8 18h-26l-6-18Z"
          fill="#fecdd3"
          stroke="#fb7185"
          strokeWidth="3"
        />
        <circle cx="68" cy="100" r="20" fill="#0f172a" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="172" cy="100" r="20" fill="#0f172a" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="68" cy="100" r="10" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="172" cy="100" r="10" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="3" />
        <path
          d="M48 80c4-6 9.5-9 15-9h114c5.5 0 11 3 15 9"
          stroke="#fca5a5"
          strokeWidth="3.5"
        />
        <path d="M54 66h32" stroke="#fee2e2" strokeWidth="4" />
        <path d="M154 66h32" stroke="#fee2e2" strokeWidth="4" />
      </g>
    </svg>
  );
}

export default function App() {
  const [overlayState, setOverlayState] = useState<OverlayState>({
    visible: false,
    phase: 'enter',
    key: Date.now()
  });

  const trigger = useCallback<CategoryBTransitionContextValue['trigger']>((phase) => {
    setOverlayState({ visible: true, phase, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!overlayState.visible) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setOverlayState((previous) => ({ ...previous, visible: false }));
    }, overlayState.phase === 'enter' ? 1100 : 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [overlayState]);

  const contextValue = useMemo<CategoryBTransitionContextValue>(
    () => ({ trigger }),
    [trigger]
  );

  return (
    <CategoryBTransitionContext.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/category-b" element={<CourseDetailsPage />} />
      </Routes>
      <CategoryBTransitionOverlay state={overlayState} />
    </CategoryBTransitionContext.Provider>
  );
}
