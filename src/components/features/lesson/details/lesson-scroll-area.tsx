'use client';

import { useCallback, useRef, type ReactNode, useEffect } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';
import { useUpdateLessonProgress } from '@/lib/store';

interface LessonScrollAreaProps {
  lessonId: string;
  moduleId: string;
  className?: string;
  children: ReactNode;
}

export function LessonScrollArea({ lessonId, moduleId, className, children }: LessonScrollAreaProps) {
  const updateLessonProgress = useUpdateLessonProgress();
  const lastSavedProgress = useRef<number>(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const scrollableHeight = scrollHeight - clientHeight;

    if (scrollableHeight <= 0) {
      // Content fits without scrolling, mark as complete
      if (lastSavedProgress.current < 100) {
        lastSavedProgress.current = 100;
        updateLessonProgress(lessonId, moduleId, 100);
      }
      return;
    }

    // Calculate progress as percentage (0-100)
    const progressPercent = Math.round((scrollTop / scrollableHeight) * 100);

    // Only update if progress increased by at least 1% to avoid excessive updates
    if (progressPercent > lastSavedProgress.current) {
      lastSavedProgress.current = progressPercent;
      updateLessonProgress(lessonId, moduleId, progressPercent);
    }
  }, [lessonId, moduleId, updateLessonProgress]);

  // Check initial content height on mount (in case content is smaller than viewport)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const { scrollHeight, clientHeight } = viewport;
    if (scrollHeight <= clientHeight && lastSavedProgress.current < 100) {
      // Content fits without scrolling, mark as complete
      lastSavedProgress.current = 100;
      updateLessonProgress(lessonId, moduleId, 100);
    }
  }, [lessonId, moduleId, updateLessonProgress]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative', className)}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
        onScroll={handleScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          data-slot="scroll-area-thumb"
          className="bg-border relative flex-1 rounded-full"
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}