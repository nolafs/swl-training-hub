'use client';

import Link from 'next/link';
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { useUpdateLessonProgress } from '@/lib/store';

type LessonType = 'Lesson' | 'Lesson Video' | 'Info' | 'Discussion' | 'Practice' | null;

interface LessonNavigationProps {
  moduleUid: string;
  moduleId: string;
  lessonId: string;
  lessonType: LessonType;
  nextLessonUid: string | null | undefined;
  prevLessonUid: string | null | undefined;
  nextModuleUid: string | null | undefined;
  moduleColor: string;
}

export function LessonNavigation({
  moduleUid,
  moduleId,
  lessonId,
  lessonType,
  nextLessonUid,
  prevLessonUid,
  nextModuleUid,
  moduleColor,
}: LessonNavigationProps) {
  const updateLessonProgress = useUpdateLessonProgress();

  const handleNextClick = () => {
    // For Info or Discussion types, mark as complete when clicking next
    if (lessonType === 'Info' || lessonType === 'Discussion') {
      updateLessonProgress(lessonId, moduleId, 100);
    }
  };

  // Determine next destination: next lesson or next module
  const nextHref = nextLessonUid
    ? `/module/${moduleUid}/lesson/${nextLessonUid}`
    : nextModuleUid
      ? `/module/${nextModuleUid}`
      : null;

  return (
    <>
      {nextHref && (
        <Link
          href={nextHref}
          onClick={handleNextClick}
          className={
            'absolute top-36 right-0 flex h-24 w-24 translate-x-full items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
          }
          style={{ backgroundColor: moduleColor }}
        >
          <ChevronRightIcon className={'h-12 w-12'} strokeWidth={1} />
        </Link>
      )}

      {prevLessonUid && (
        <Link
          href={`/module/${moduleUid}/lesson/${prevLessonUid}`}
          className={
            'absolute top-36 left-0 flex h-24 w-24 -translate-x-full items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
          }
          style={{ backgroundColor: moduleColor }}
        >
          <ChevronLeftIcon className={'h-12 w-12'} strokeWidth={1} />
        </Link>
      )}
    </>
  );
}