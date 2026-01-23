import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SettingsDocument } from '../../prismicio-types';

interface HeaderProps {
  settings: SettingsDocument | null;
}

export function Header({ settings }: HeaderProps) {
  const logo = settings?.data?.logo;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <PrismicNextLink href="/" className="flex items-center">
          {logo?.url ? (
            <PrismicNextImage
              field={logo}
              className="h-8 w-auto sm:h-10"
              fallbackAlt=""
            />
          ) : (
            <span className="text-xl font-bold text-gray-900">SWL Training Hub</span>
          )}
        </PrismicNextLink>

        {/* Navigation - Right (placeholder for future menu) */}
        <nav aria-label="Main navigation" className="flex items-center gap-4">
          {/* Menu items will go here */}
        </nav>
      </div>
    </header>
  );
}
