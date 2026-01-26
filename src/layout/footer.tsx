'use client';

import { PrismicLink } from '@prismicio/react';
import type { SettingsDocument } from '../../prismicio-types';
import { usePageColor } from '@/components/features/page-color';

interface FooterProps {
  settings: SettingsDocument | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = settings?.data?.copyright_line
    ? `© ${currentYear} ${settings?.data?.copyright_line}`
    : `© ${currentYear} SWL Training Hub`;
  const secondaryNav = settings?.data?.secondary_navigation || [];
  const { textColor } = usePageColor();

  return (
    <footer style={{ color: textColor }} className="transition-colors duration-300">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        {/* Copyright - Left */}
        <p className="text-sm">{copyrightText}</p>

        {/* Secondary Navigation - Right */}
        {secondaryNav.length > 0 && (
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              {secondaryNav.map((item, index) => (
                <li key={index}>
                  <PrismicLink
                    field={item.nav_item}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
