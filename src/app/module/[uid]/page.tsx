import { LessonSlider } from '@/components/features/lesson';
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { isFilled } from "@prismicio/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PageColorSetter } from "@/components/features/page-color";

interface ModulePageProps {
  params: Promise<{ uid: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { uid } = await params;
  const client = createClient();

  const moduleDoc = await client.getByUID('module', uid, {
    fetchLinks: ['lesson.title', 'lesson.type', 'lesson.description', 'lesson.cover_image'],
  }).catch(() => null);

  if (!moduleDoc) {
    notFound();
  }

  const moduleColor = moduleDoc.data.colour || '#fff';

  // Transform CMS lessons to the format expected by LessonSlider
  const lessons = moduleDoc.data.lesson
    .map((item, index) => {
      if (!isFilled.contentRelationship(item.lesson)) return null;

      const lessonData = item.lesson.data as {
        title?: string;
        description?: string;
        cover_image?: { url?: string; alt?: string };
      } | undefined;

      return {
        id: item.lesson.id,
        uid: item.lesson.uid || '',
        lessonNumber: index + 1,
        title: lessonData?.title || 'Untitled Lesson',
        description: lessonData?.description || '',
        coverImage: lessonData?.cover_image?.url || '',
        coverImageAlt: lessonData?.cover_image?.alt || '',
      };
    })
    .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== null);

  const hasLessons = lessons.length > 0;

  return (
    <main className="flex flex-col h-full w-full flex-1">
      <PageColorSetter color={moduleColor} />
      <div className="container mx-auto py-12">
        {hasLessons ? (
          <LessonSlider lessons={lessons} moduleId={uid} moduleColor={moduleColor} />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No lessons found</AlertTitle>
            <AlertDescription>
              There are no lessons available for this module yet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}
