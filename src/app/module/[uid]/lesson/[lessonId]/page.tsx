import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { PageColorSetter } from "@/components/features/page-color";
import { components } from "@/slices";
import {PrismicRichText, SliceZone} from "@prismicio/react";
import { Metadata } from "next";
import { isFilled } from "@prismicio/client";
import { ScrollArea } from '@/components/ui/scroll-area';
import { LessonVideoPlayer, LessonScrollArea, LessonNavigation, LessonPracticeCountdown, ProgressCard } from '@/components/features';
import { PrismicNextImage } from '@prismicio/next';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';


type Params = { uid: string; lessonId: string };

interface LessonPageProps {
  params: Promise<Params>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { uid, lessonId } = await params;
  const client = createClient();

  // Fetch module to get the color
  const moduleDoc = await client.getByUID('module', uid).catch(() => null);

  if (!moduleDoc) {
    notFound();
  }

  const lessonDoc = await client.getByUID('lesson', lessonId).catch(() => null);

  if (!lessonDoc) {
    notFound();
  }

  const moduleColor = moduleDoc.data.colour || '#fff';

  const numberOfLessons = moduleDoc.data.lesson.length;
  let currentIndex = -1;

  // Find current lesson index (0-based)
  for (let i = 0; i < numberOfLessons; i++) {
    const item = moduleDoc.data.lesson[i];
    if (isFilled.contentRelationship(item.lesson) && item.lesson.uid === lessonId) {
      currentIndex = i;
      break;
    }
  }

  // Get next and previous lesson UIDs (with safety checks)
  const nextLessonItem = currentIndex < numberOfLessons - 1 ? moduleDoc.data.lesson[currentIndex + 1] : null;
  const prevLessonItem = currentIndex > 0 ? moduleDoc.data.lesson[currentIndex - 1] : null;

  const nextLessonUid = nextLessonItem && isFilled.contentRelationship(nextLessonItem.lesson)
    ? nextLessonItem.lesson.uid
    : null;
  const prevLessonUid = prevLessonItem && isFilled.contentRelationship(prevLessonItem.lesson)
    ? prevLessonItem.lesson.uid
    : null;

  // If we're at the last lesson, get the next module
  let nextModuleUid: string | null = null;
  if (!nextLessonUid) {
    const allModules = await client.getAllByType('module', {
      orderings: [{ field: 'my.module.position', direction: 'asc' }],
    });
    const currentModulePosition = moduleDoc.data.position ?? 0;
    const nextModule = allModules.find(
      (m) => (m.data.position ?? 0) > currentModulePosition
    );
    nextModuleUid = nextModule?.uid ?? null;
  }

  // Display index is 1-based
  const lessonIndex = currentIndex + 1;



  return (
    <main className="h-screen w-full overflow-visible">
      <PageColorSetter color={moduleColor} />

      <div>

      </div>

      <div className="relative z-10 container mx-auto h-screen min-h-full max-w-5xl overflow-visible py-20">
        {/* Home Link Button */}
        <div
          className={
            'relative flex h-full w-full bg-gray-100 shadow-[0px_4px_65px_14px_rgba(0,0,0,0.25)]'
          }
        >
          <Link
            href={`/module/${moduleDoc.uid}`}
            className={
              'absolute right-0 bottom-11 flex h-24 w-24 translate-x-full items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
            }
            style={{ backgroundColor: moduleColor }}
          >
            <HomeIcon className={'h-12 w-12'} strokeWidth={1} />
          </Link>

          {/* Next Previous lesson Link Button */}

          <LessonNavigation
            moduleUid={moduleDoc.uid}
            moduleId={moduleDoc.id}
            lessonId={lessonDoc.id}
            lessonType={lessonDoc.data.type}
            nextLessonUid={nextLessonUid}
            prevLessonUid={prevLessonUid}
            nextModuleUid={nextModuleUid}
            moduleColor={moduleColor}
          />

          {/* Lesson progress bar */}

          <div
            className={
              'absolute top-1/2 left-0 z-1 flex h-75 w-20 -translate-x-full p-3 shadow-lg brightness-90'
            }
            style={{ backgroundColor: moduleColor }}
          >
            <ProgressCard lessonId={lessonId} />
          </div>

          <article className="relative flex flex-col z-10 w-full h-full max-h-screen max-w-5xl px-8 pt-4 pb-2 shadow-[0px_0px_5px_5px_rgba(0,0,0,0.10)]">
            <h1 className={'flex items-center gap-x-3'}>
              <span className={'text-2xl font-semibold tracking-tight text-gray-500'}>
                {lessonIndex < 10 ? `0${lessonIndex}` : lessonIndex}
              </span>{' '}
              <span className={'font-bold'}>{lessonDoc.data.title}</span>
            </h1>

            {lessonDoc.data.type === 'Info' && isFilled.image(lessonDoc.data.cover_image) && (
              <PrismicNextImage
                field={lessonDoc.data.cover_image}
                className={'aspect-video w-full'}
                fallbackAlt={''}
              />
            )}

            {lessonDoc.data.type === 'Lesson' && isFilled.image(lessonDoc.data.cover_image) && (
              <PrismicNextImage
                field={lessonDoc.data.cover_image}
                className={'aspect-video w-full'}
                fallbackAlt={''}
              />
            )}

            {lessonDoc.data.type === 'Lesson Video' &&
              isFilled.embed(lessonDoc.data.video) &&
              lessonDoc.data.video.embed_url && (
                <LessonVideoPlayer
                  lessonId={lessonDoc.id}
                  moduleId={moduleDoc.id}
                  videoUrl={lessonDoc.data.video.embed_url}
                />
              )}

            {lessonDoc.data.type === 'Practice' && isFilled.image(lessonDoc.data.cover_image) && (
              <LessonPracticeCountdown
                lessonId={lessonDoc.id}
                moduleId={moduleDoc.id}
                duration={lessonDoc.data.duration}
                coverImage={lessonDoc.data.cover_image}
              />
            )}

            {lessonDoc.data.type === 'Lesson' ? (
              <LessonScrollArea
                lessonId={lessonDoc.id}
                moduleId={moduleDoc.id}
                className="mt-4 mb-8 flex-1 overflow-hidden border bg-white p-4"
              >
                <div className={'prose lg:prose-xl max-w-5xl'}>
                  <PrismicRichText field={lessonDoc.data.body} />
                  <SliceZone slices={lessonDoc.data.slices} components={components} />
                </div>
              </LessonScrollArea>
            ) : (
              <ScrollArea className="mt-4 mb-8 flex-1  overflow-hidden  border bg-white p-4">
                <div className={'prose lg:prose-xl max-w-5xl'}>
                  <PrismicRichText field={lessonDoc.data.body} />
                  <SliceZone slices={lessonDoc.data.slices} components={components} />
                </div>
              </ScrollArea>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lessonId } = await params;
  const client = createClient();
  const lesson = await client.getByUID('lesson', lessonId).catch(() => null);

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: lesson.data.title,
    description: lesson.data.description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const modulesDoc = await client.getAllByType('module', {
    fetchLinks: ['lesson.uid'],
  });

  const paths: Params[] = [];

  for (const moduleItem of modulesDoc) {
    if (!moduleItem.uid) continue;

    for (const item of moduleItem.data.lesson || []) {
      if (isFilled.contentRelationship(item.lesson) && item.lesson.uid) {
        paths.push({
          uid: moduleItem.uid,
          lessonId: item.lesson.uid,
        });
      }
    }
  }

  return paths;
}


