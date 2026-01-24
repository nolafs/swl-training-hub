import { MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const client = createClient();
  let faviconUrl: string | null = null;

  try {
    const settings = await client.getSingle('settings');
    faviconUrl = settings?.data.favicon?.url ?? null;
  } catch {
    // Settings not found, use fallback
  }

  return {
    name: 'SWL Training Hub',
    short_name: 'SWL Hub',
    description: 'SWL Training Hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: faviconUrl
      ? [
          {
            src: `${faviconUrl}&w=192&h=192`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${faviconUrl}&w=512&h=512`,
            sizes: '512x512',
            type: 'image/png',
          },
        ]
      : [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
  };
}
