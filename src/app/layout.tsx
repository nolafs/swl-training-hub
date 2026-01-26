import type { Metadata, ResolvingMetadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { PrismicPreview } from '@prismicio/next';
import { createClient, repositoryName } from '@/prismicio';
import { RootInnerLayout } from '@/layout/RootInnerLayout';
import { Footer } from '@/layout/footer';
import { Header } from '@/layout/header';
import { asText, isFilled } from '@prismicio/client';
import { LearnProgressStoreProvider, type CourseStructure } from '@/lib/store';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

type Props = {
  params: Promise<{ uid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function isURL(string: string | null | undefined): boolean {
  if (!string) return false;

  const pattern = new RegExp('^(https?|ftp):\\/\\/[^s/$.?#].[^s]*$', 'i');
  return pattern.test(string);
}

export async function generateMetadata({}: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle('settings');
  const defaultImages = [];

  if (settings?.data.share_image?.url) {
    defaultImages[0] = settings?.data.share_image?.url;
  }

  // Get favicon URL from CMS or use fallback
  const faviconUrl = settings?.data.favicon?.url;

  return {
    metadataBase: new URL(
      isURL(settings.data?.site_canonical_url ?? '')
        ? settings.data.site_canonical_url!
        : (process.env.NEXT_PUBLIC_BASE_URL ?? '')
    ),
    alternates: {
      canonical: settings.data?.site_canonical_url ?? process.env.NEXT_PUBLIC_BASE_URL ?? '',
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}feed.xml`,
      },
    },
    title: settings?.data.site_title ?? (await parent).title ?? 'Site Title',
    description: asText(settings?.data.site_description) ?? (await parent).description,
    keywords: settings?.data.site_keywords ?? (await parent).keywords ?? '',
    openGraph: {
      images: [...defaultImages],
    },
    icons: faviconUrl
      ? {
          icon: [
            { url: `${faviconUrl}&w=32&h=32`, type: 'image/png', sizes: '32x32' },
            { url: `${faviconUrl}&w=16&h=16`, type: 'image/png', sizes: '16x16' },
          ],
          shortcut: `${faviconUrl}&w=32&h=32`,
          apple: `${faviconUrl}&w=180&h=180`,
        }
      : {
          icon: [
            { url: '/favicon.png?v=2', type: 'image/png', sizes: '32x32' },
            { url: '/favicon.png?v=2', type: 'image/png', sizes: '16x16' },
          ],
          shortcut: '/favicon.png',
          apple: '/apple-icon.png',
        },
    /*
        verification: {
            other: {
                'google-site-verification': 'gRDwZ-Sqgn85j_W4GYVmCfCwoS3ScXUAxbZE0V4rCQg',
                'algolia-site-verification': '3032BA6863E51546',
            }
        },

         */

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const client = createClient();
  let settings = null;

  try {
    settings = await client.getSingle('settings');
  } catch {
    console.warn('Settings document not found');
  }

  // Load course structure from CMS for progress tracking
  let courseStructure: CourseStructure = { modules: [] };

  try {
    const modules = await client.getAllByType('module', {
      orderings: [{ field: 'my.module.position', direction: 'asc' }],
      fetchLinks: ['lesson.title'],
    });

    courseStructure = {
      modules: modules.map((module) => ({
        moduleId: module.id,
        title: module.data.title ?? '',
        lessons: (module.data.lesson ?? []).flatMap((item, index) => {
          if (!isFilled.contentRelationship(item.lesson)) return [];
          const lesson = item.lesson;
          return [
            {
              lessonId: lesson.id ?? `lesson-${index}`,
              title: (lesson.data as { title?: string } | undefined)?.title ?? `Lesson ${index + 1}`,
            },
          ];
        }),
      })),
    };
  } catch {
    console.warn('Could not load course structure');
  }

  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <LearnProgressStoreProvider courseStructure={courseStructure}>
          <RootInnerLayout>
            <Header settings={settings} />
            {children}
            <Footer settings={settings} />
            {/* Prismic preview */}
            <PrismicPreview repositoryName={repositoryName} />
          </RootInnerLayout>
        </LearnProgressStoreProvider>
      </body>
    </html>
  );
}
