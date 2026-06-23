import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SWL Traingin Hub',
    short_name: 'SWL',
    description: 'SWL Traingin Hub',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fff',
    theme_color: '#000',
    lang: 'en',
    icons: [
      {
        src: '/icons/android-icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}