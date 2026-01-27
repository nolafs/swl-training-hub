'use client';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { LessonMouseTooltip } from './lesson-mouse-tooltip';
import { useUpdateLessonProgress } from '@/lib/store';
import cn from 'clsx';

interface LessonNavigationButtonProps {
  type: 'next' | 'prev';
  lessonId: string;
  lessonType: LessonType;
  lessonLinkTitle: string | null | undefined;
  lessonLinkUid: string | null | undefined;
  moduleLinkUid: string | null | undefined;
  moduleId: string;
  moduleUid: string | null | undefined;
  moduleColor: string;
}

export function LessonNavigationButton ({
  type,
  lessonId,
  lessonType,
  lessonLinkTitle,
  lessonLinkUid,
  moduleLinkUid,
  moduleId,
  moduleUid,
  moduleColor,
                                        }: LessonNavigationButtonProps) {

  const updateLessonProgress = useUpdateLessonProgress();

  const handleNextClick = () => {
    // For Info or Discussion types, mark as complete when clicking next
    if (lessonType === 'Info' || lessonType === 'Discussion') {
      updateLessonProgress(lessonId, moduleId, 100);
    }
  };

  const href = lessonLinkUid
    ? `/module/${moduleUid}/lesson/${lessonLinkUid}`
    : moduleLinkUid
      ? `/module/${moduleLinkUid}`
      : null;

  const tooltipLabel = lessonLinkTitle
    ? `${type === 'next' ? 'Next Lesson' : 'Previous Lesson'}: ${lessonLinkTitle}`
    : `${type === 'next' ? 'Next Lesson' : 'Previous Lesson'}`;


  if(!href) {
    return null;
  }
  
  return (
    <LessonMouseTooltip label={tooltipLabel}>
      <Link
        href={href}
        onClick={handleNextClick}
        className={cn(
          type === 'next' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full',
          'absolute top-36 flex h-24 w-24 items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
        )}
        style={{ backgroundColor: moduleColor }}
      >
        {type === 'next' ? (
          <ChevronRightIcon className={'h-12 w-12'} strokeWidth={1} />
        ) : (
          <ChevronLeftIcon className={'h-12 w-12'} strokeWidth={1} />
        )}
      </Link>
    </LessonMouseTooltip>
  );
}