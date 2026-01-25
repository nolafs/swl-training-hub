import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { PageColorSetter } from "@/components/features/page-color";
import { components } from "@/slices";
import {PrismicRichText, SliceZone} from "@prismicio/react";
import { Metadata } from "next";
import { isFilled } from "@prismicio/client";


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
  let lessonIndex = -1;

  console.log('Checking numberOfLessons:', numberOfLessons);

  for (let i = 0; i < numberOfLessons; i++) {
    const item = moduleDoc.data.lesson[i];
    console.log('Checking lesson:', lessonIndex);
    if (isFilled.contentRelationship(item.lesson) && item.lesson.uid === lessonId) {
      lessonIndex = (i + 1);
      break;
    }
  }

  return (
    <main className="min-h-screen flex-1 pb-16">
      <PageColorSetter color={moduleColor} />
      <div className="container mx-auto px-6 ">
        <article className="mx-auto max-w-5xl  bg-gray-100 py-4 px-8 shadow-lg">
          <h1 className={'flex items-center gap-x-3'}><span className={'font-semibold tracking-tight text-2xl text-gray-500'}>{lessonIndex < 10 ? `0${lessonIndex}` : lessonIndex  }</span> <span className={'font-bold'}>{lessonDoc.data.title}</span></h1>
          <div className={'prose lg:prose-xl max-w-5xl '}>



            <PrismicRichText field={lessonDoc.data.body} />

            <SliceZone slices={lessonDoc.data.slices} components={components} />
          </div>
        </article>
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


