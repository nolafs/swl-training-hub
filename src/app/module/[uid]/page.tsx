import { LessonSlider } from '@/components/features/lesson';
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { isFilled } from "@prismicio/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {AlertCircle, ChevronRightIcon} from "lucide-react";
import { PageColorSetter } from "@/components/features/page-color";
import {ButtonHero} from "@/components/ui/button-hero";

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


      {hasLessons ? (
          <LessonSlider lessons={lessons} moduleId={uid} moduleColor={moduleColor} />
        ) : (<div className={'p-10'}>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No lessons found</AlertTitle>
            <AlertDescription>
              There are no lessons available for this module yet.
            </AlertDescription>
          </Alert></div>)}


      <div className="mt-20 grid grid-cols-1 items-center gap-6 px-5 md:grid-cols-2 text-white">
        <div className={'flex'}>
          <div className={'text-9xl font-extralight '}>{(moduleDoc.data.position ?? 0) < 10 ? `0${moduleDoc.data.position ?? 0}` : moduleDoc.data.position}</div>
          <div className={'flex flex-col justify-center ml-4 space-y-1'}>
            <div className={'text-xl font-extralight capitalize'}>Module</div>
            <div className={'text-3xl font-bold'}>{moduleDoc.data.title}</div>
            <div className={'text-xl font-normal'}>{moduleDoc.data.description}</div>

          </div>
        </div>
        <div className={'flex  justify-center'}>
          <ButtonHero iconBgColor={moduleDoc.data.colour || '#fff'} textColor={moduleDoc.data.colour || '#fff'} icon={<ChevronRightIcon />}>Continue</ButtonHero>
        </div>
      </div>
    </main>
  );
}
