'use client';

import { useState, useRef, useCallback, type ReactNode, type MouseEvent } from 'react';
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
  nextLessonTitle: string | null | undefined;
  prevLessonUid: string | null | undefined;
  prevLessonTitle: string | null | undefined;
  nextModuleUid: string | null | undefined;
  nextModuleTitle: string | null | undefined;
  moduleColor: string;
}

interface MouseTooltipProps {
  children: ReactNode;
  label: string;
  delay?: number;
}

function MouseTooltip({ children, label, delay = 300 }: MouseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible && (
        <div
          className="pointer-events-none fixed z-[100] rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
          style={{
            left: position.x + 12,
            top: position.y + 12,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export function LessonNavigation({
  moduleUid,
  moduleId,
  lessonId,
  lessonType,
  nextLessonUid,
  nextLessonTitle,
  prevLessonUid,
  prevLessonTitle,
  nextModuleUid,
  nextModuleTitle,
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

  // Determine tooltip label for next button
  const nextTooltipLabel = nextLessonUid
    ? `Next: ${nextLessonTitle || 'Next Lesson'}`
    : nextModuleUid
      ? `Next Module: ${nextModuleTitle || 'Next Module'}`
      : '';

  const prevTooltipLabel = prevLessonTitle
    ? `Previous: ${prevLessonTitle}`
    : 'Previous Lesson';

  return (
    <>
      {nextHref && (
        <MouseTooltip label={nextTooltipLabel}>
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
        </MouseTooltip>
      )}

      {prevLessonUid && (
        <MouseTooltip label={prevTooltipLabel}>
          <Link
            href={`/module/${moduleUid}/lesson/${prevLessonUid}`}
            className={
              'absolute top-36 left-0 flex h-24 w-24 -translate-x-full items-center justify-center text-white shadow-lg brightness-90 hover:brightness-130'
            }
            style={{ backgroundColor: moduleColor }}
          >
            <ChevronLeftIcon className={'h-12 w-12'} strokeWidth={1} />
          </Link>
        </MouseTooltip>
      )}
    </>
  );
}