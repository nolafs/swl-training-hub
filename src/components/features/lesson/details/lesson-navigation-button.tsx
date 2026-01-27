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
  /** Layout variant: desktop (absolute positioned) or mobile (inline) */
  variant?: 'desktop' | 'mobile';
}

export function LessonNavigationButton({
  type,
  lessonId,
  lessonType,
  lessonLinkTitle,
  lessonLinkUid,
  moduleLinkUid,
  moduleId,
  moduleUid,
  moduleColor,
  variant = 'desktop',
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

  const Icon = type === 'next' ? ChevronRightIcon : ChevronLeftIcon;

  // Mobile variant - inline button for bottom nav bar
  if (variant === 'mobile') {
    if (!href) {
      // Disabled state for mobile
      return (
        <div className="flex h-14 flex-1 items-center justify-center text-gray-300">
          <Icon className="h-6 w-6" />
        </div>
      );
    }

    return (
      <Link
        href={href}
        onClick={type === 'next' ? handleNextClick : undefined}
        className="flex h-14 flex-1 items-center justify-center text-gray-700 transition-colors hover:bg-gray-100"
      >
        <Icon className="h-6 w-6" />
      </Link>
    );
  }

  // Desktop variant - absolute positioned with tooltip
  if (!href) {
    return null;
  }

  return (
    <LessonMouseTooltip label={tooltipLabel}>
      <Link
        href={href}
        onClick={type === 'next' ? handleNextClick : undefined}
        className={cn(
          type === 'next' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full',
          'absolute top-36 flex h-24 w-24 items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
        )}
        style={{ backgroundColor: moduleColor }}
      >
        <Icon className="h-12 w-12" strokeWidth={1} />
      </Link>
    </LessonMouseTooltip>
  );
}