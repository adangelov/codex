import { createContext, useContext } from 'react';

export type CategoryBTransitionPhase = 'enter' | 'exit';

export interface CategoryBTransitionContextValue {
  trigger: (phase: CategoryBTransitionPhase) => void;
}

export const CategoryBTransitionContext = createContext<CategoryBTransitionContextValue | null>(null);

export function useCategoryBTransition() {
  const context = useContext(CategoryBTransitionContext);

  if (!context) {
    throw new Error('useCategoryBTransition must be used within a CategoryBTransitionContext provider.');
  }

  return context;
}
