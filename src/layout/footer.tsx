import { PrismicLink } from '@prismicio/react';
import type { SettingsDocument } from '../../prismicio-types';

interface FooterProps {
  settings: SettingsDocument | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = settings?.data?.copyright_line
    ? `© ${currentYear} ${settings?.data?.copyright_line}`
    : `© ${currentYear} SWL Training Hub`;
  const secondaryNav = settings?.data?.secondary_navigation || [];

  return (
    <footer>
      <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        {/* Copyright - Left */}
        <p className="text-sm text-gray-900">{copyrightText}</p>

        {/* Secondary Navigation - Right */}
        {secondaryNav.length > 0 && (
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              {secondaryNav.map((item, index) => (
                <li key={index}>
                  <PrismicLink
                    field={item.nav_item}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900"
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
