'use client';

import Link from 'next/link';
import { ButtonHero } from '@/components/ui/button-hero';
import { ChevronRightIcon } from 'lucide-react';
import { useLearnProgressStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { useMemo } from 'react';

interface Lesson {
  uid: string;
  id: string;
}

interface ContinueButtonProps {
  moduleUid: string;
  moduleId: string;
  lessons: Lesson[];
  colour?: string;
}

export function ContinueButton({ moduleUid, moduleId, lessons, colour }: ContinueButtonProps) {
  const lessonProgress = useLearnProgressStore(
    useShallow((state) => state.lessonProgress)
  );

  // Find the first uncompleted lesson
  const nextUncompletedLesson = useMemo(() => {
    for (const lesson of lessons) {
      const progress = lessonProgress[lesson.id];
      console.log('Checking lesson:', lesson.uid, 'Progress:', progress);

      // Lesson is uncompleted if no progress record or not completed (progress < 100)
      if (!progress || !progress.completed) {
        return lesson;
      }
    }



    return null;
  }, [lessons, lessonProgress]);

  // Hide button if all lessons are completed
  if (!nextUncompletedLesson) {
    return null;
  }

  return (
    <Link href={`/module/${moduleUid}/lesson/${nextUncompletedLesson.uid}`}>
      <ButtonHero
        iconBgColor={colour || '#fff'}
        textColor={colour || '#fff'}
        icon={<ChevronRightIcon />}
      >
        Continue
      </ButtonHero>
    </Link>
  );
}