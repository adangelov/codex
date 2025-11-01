export type NavSection = 'process' | 'courses' | 'instructor' | 'faq' | 'contact';

export type NavItem =
  | { type: 'section'; section: NavSection }
  | { type: 'route'; to: string };

export const NAV_ITEMS: readonly NavItem[] = [
  { type: 'section', section: 'process' },
  { type: 'section', section: 'courses' },
  { type: 'route', to: '/courses/category-b' },
  { type: 'section', section: 'instructor' },
  { type: 'section', section: 'faq' },
  { type: 'section', section: 'contact' }
] as const;

export const NAV_SECTION_IDS: readonly NavSection[] = NAV_ITEMS.filter(
  (item): item is Extract<NavItem, { type: 'section' }> => item.type === 'section'
).map((item) => item.section);

