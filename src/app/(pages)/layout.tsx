import { createClient } from '@/prismicio';
import { Header } from '@/layout/header';
import { Footer } from '@/layout/footer';
import { type CourseStructure, LearnProgressStoreProvider } from '@/lib/store';
import { isFilled } from '@prismicio/client';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
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
              title:
                (lesson.data as { title?: string } | undefined)?.title ?? `Lesson ${index + 1}`,
            },
          ];
        }),
      })),
    };
  } catch {
    console.warn('Could not load course structure');
  }

  return (
    <LearnProgressStoreProvider courseStructure={courseStructure}>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
    </LearnProgressStoreProvider>
  );
}