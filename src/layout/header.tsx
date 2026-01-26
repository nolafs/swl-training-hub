'use client';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SettingsDocument } from '../../prismicio-types';
import { SettingsDialog } from '@/components/features/settings/settings-dialog';
import { usePageColor } from '@/components/features/page-color';

interface HeaderProps {
  settings: SettingsDocument | null;
}

export function Header({ settings }: HeaderProps) {
  const logo = settings?.data?.logo;
  const logoAlt = settings?.data?.logo_alt;
  const { color, textColor } = usePageColor();

  // Use alternate logo when page has a background color
  const displayLogo = color && logoAlt?.url ? logoAlt : logo;

  return (
    <header style={{ color: textColor }} className="transition-colors duration-300">
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <PrismicNextLink href="/" className="flex items-center">
          {displayLogo?.url ? (
            <PrismicNextImage field={displayLogo} className="h-16 w-auto sm:h-16 md:h-26" fallbackAlt="" />
          ) : (
            <span className="text-xl font-bold">SWL Training Hub</span>
          )}
        </PrismicNextLink>

        {/* Navigation - Right (placeholder for future menu) */}
        <nav aria-label="Main navigation" className="flex items-center gap-4">
          {/* Menu items will go here */}
          <SettingsDialog textColor={textColor} />
        </nav>
      </div>
    </header>
  );
}
