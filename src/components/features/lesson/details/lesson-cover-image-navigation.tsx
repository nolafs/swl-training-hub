import { ImageField } from '@prismicio/client';
import Image from 'next/image';

interface LessonCoverImageNavigationProps {
  prevLessonCoverImage?: ImageField | null | undefined;
  nextLessonCoverImage?: ImageField | null | undefined;
  nextLessonTitle?: string | null | undefined;
  prevLessonTitle?: string | null | undefined;
}


export function LessonCoverImageNavigation({
  prevLessonCoverImage,
  nextLessonCoverImage,
  nextLessonTitle,
  prevLessonTitle,
}: LessonCoverImageNavigationProps) {
  return (
    <>
      {prevLessonCoverImage?.url && (
        <div className={'absolute top-36 z-2 -translate-x-1/2'}>
          <Image
            src={prevLessonCoverImage.url}
            alt={prevLessonTitle || prevLessonCoverImage?.alt || ''}
            width={600}
            height={400}
          />
        </div>
      )}

      {nextLessonCoverImage?.url && (
        <div className={'absolute top-36 right-0 z-2 translate-x-1/2'}>
          <Image
            src={nextLessonCoverImage.url}
            alt={nextLessonTitle || nextLessonCoverImage?.alt || ''}
            width={600}
            height={400}
          />
        </div>
      )}
    </>
  );
}