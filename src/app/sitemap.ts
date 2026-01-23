import { type MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Dynamic routes from Prismic
  try {
    const pages = await client.getAllByType('page');
    const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/${page.uid}`,
      lastModified: new Date(page.last_publication_date || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Add module routes when the 'module' type exists in Prismic
    // Uncomment after creating the module type in Slice Machine:
    // const modules = await client.getAllByType('module');
    // const moduleRoutes: MetadataRoute.Sitemap = modules.map((module) => ({
    //   url: `${baseUrl}/module/${module.uid}`,
    //   lastModified: new Date(module.last_publication_date || Date.now()),
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // }));

    return [...staticRoutes, ...pageRoutes];
  } catch {
    // Return static routes if Prismic fetch fails
    return staticRoutes;
  }
}
