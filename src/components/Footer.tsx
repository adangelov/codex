import { Fragment } from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

import type { Strings } from '../i18n';
import { SITE_VERSION } from '../siteVersion';

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    fill="currentColor"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/' },
  { icon: TikTokIcon, label: 'TikTok', href: 'https://www.tiktok.com/' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/' }
] as const;

interface FooterProps {
  footer: Strings['footer'];
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t bg-neutral-50 text-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[1.1fr_auto_1fr] md:items-center">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xl font-semibold leading-tight text-neutral-900">{footer.heading}</div>
            <div className="text-base font-medium text-neutral-600">{footer.subheading}</div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-neutral-600">
            {footer.links.map((link, index) => (
              <Fragment key={link.label}>
                <a href={link.href} className="transition hover:text-neutral-900">
                  {link.label}
                </a>
                {index < footer.links.length - 1 && <span className="text-neutral-400">•</span>}
              </Fragment>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-3 md:justify-end" aria-label={footer.socialLabel}>
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500 text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                aria-label={item.label}
              >
                <item.icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div>{footer.hyundaiNotice}</div>
          <div className="text-right text-[12px] text-neutral-700 sm:text-xs">{footer.copyright(SITE_VERSION)}</div>
        </div>
      </div>
    </footer>
  );
}
