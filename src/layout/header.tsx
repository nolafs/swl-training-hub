'use client';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SettingsDocument } from '../../prismicio-types';
import { SettingsDialog } from '@/components/features/settings/settings-dialog';
import { usePageColor } from '@/components/features/page-color';
import { useMemo } from 'react';
import { isFilled } from '@prismicio/client';

interface HeaderProps {
  settings: SettingsDocument | null;
}

export function Header({ settings }: HeaderProps) {
  const logo = settings?.data?.logo;
  const logoAlt = settings?.data?.logo_alt;
  const { color, textColor } = usePageColor();

  const displayLogo = useMemo(() => {

    console.log('[color]',color);

    if (!isFilled.image(logo)) {
      return;
    }
    if (!isFilled.image(logoAlt)) { return logo}
    return (color ? logoAlt : logo);
  }, [color, logoAlt, logo]);

  return (
    <header style={{ color: textColor }} className="transition-colors duration-300 absolute top-0 left-0 w-full z-50">
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <PrismicNextLink href="/" className="flex items-center">
          {displayLogo ? (
            <PrismicNextImage field={displayLogo} className="h-16 w-auto sm:h-16 md:h-26" fallbackAlt="" />
          ) : (
            <span className="text-xl font-bold">{settings?.data.site_title}</span>
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
