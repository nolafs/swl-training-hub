'use client';

import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SettingsDocument } from '../../prismicio-types';
import { SettingsDialog } from '@/components/features/settings/settings-dialog';
import { usePageColor } from '@/components/features/page-color';
import { useMemo } from 'react';
import { isFilled } from '@prismicio/client';
import { UserButton, useUser } from '@clerk/nextjs';

interface HeaderProps {
  settings: SettingsDocument | null;
}

export function Header({ settings }: HeaderProps) {
  const logo = settings?.data?.logo;
  const logoAlt = settings?.data?.logo_alt;
  const { color, textColor } = usePageColor();
  const user = useUser()

  const displayLogo = useMemo(() => {

    console.log('[color]',color);

    if (!isFilled.image(logo)) {
      return;
    }
    if (!isFilled.image(logoAlt)) { return logo}
    return (color ? logoAlt : logo);
  }, [color, logoAlt, logo]);

  return (
    <header
      style={{ color: textColor }}
      className="absolute top-0 left-0 z-50 w-full transition-colors duration-300"
    >
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <PrismicNextLink href="/" className="flex items-center">
          {displayLogo ? (
            <PrismicNextImage
              field={displayLogo}
              className="h-16 w-auto sm:h-16 md:h-26"
              fallbackAlt=""
            />
          ) : (
            <span className="text-xl font-bold">{settings?.data.site_title}</span>
          )}
        </PrismicNextLink>

        {/* Navigation - Right */}
        {user.isSignedIn && (
          <nav aria-label="Main navigation" className="flex items-center gap-4">
            <SettingsDialog textColor={textColor} />
            <UserButton />
          </nav>
        )}
      </div>
    </header>
  );
}
