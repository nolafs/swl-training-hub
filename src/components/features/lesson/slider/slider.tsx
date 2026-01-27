'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { LessonCard } from '../card';
import { SliderNavigation } from '@/components/ui/SliderNavigation';
import { ModuleProgress } from '@/components/features/lesson/progress/progress';
import { useLearnProgressStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';

interface Lesson {
  id: string;
  uid: string;
  lessonNumber: number;
  title: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
}

interface LessonSliderProps {
  lessons: Lesson[];
  moduleUid: string;
  moduleId: string;
  moduleColor: string;
  /** Delay in ms before auto-scrolling to current lesson (for intro animations) */
  animationDelay?: number;
}

const GAP = 24;
const CARD_ASPECT_RATIO = 16 / 9; // width / height for desktop
const MOBILE_BREAKPOINT = 430; // Below this width, show single slide with square cards

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

export function LessonSlider({ lessons, moduleUid, moduleId, moduleColor, animationDelay = 0 }: LessonSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();

  const maxIndex = Math.max(0, lessons.length - 1);

  // Get lesson progress from store
  const lessonProgress = useLearnProgressStore(
    useShallow((state) => state.lessonProgress)
  );

  // Calculate card dimensions based on container width and mobile state
  // Desktop: containerWidth = halfCard + gap + fullCard + gap + halfCard = 2*cardWidth + 2*gap
  // Mobile: single card takes full width minus padding, square aspect ratio
  const cardWidth = containerWidth > 0
    ? isMobile
      ? containerWidth - 32 // Mobile: full width minus 16px padding on each side
      : (containerWidth - 2 * GAP) / 2 // Desktop: centered layout with half cards visible
    : 400;
  const cardHeight = isMobile ? cardWidth : cardWidth / CARD_ASPECT_RATIO; // Square on mobile, 16:9 on desktop

  // Use ResizeObserver for reliable container width measurement
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setContainerWidth(width);
          setIsMobile(width < MOBILE_BREAKPOINT);
          setIsReady(true);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    // Also measure immediately
    const width = containerRef.current.offsetWidth;
    if (width > 0) {
      setContainerWidth(width);
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsReady(true);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate offset to center the current card
  const getCenteredOffset = (index: number) => {
    if (isMobile) {
      // Mobile: simple slide calculation, centered with padding
      return 16 - index * (cardWidth + GAP); // 16px left padding
    }
    // Desktop: center the card with half cards visible on sides
    const centerOffset = (containerWidth - cardWidth) / 2;
    const cardOffset = index * (cardWidth + GAP);
    return centerOffset - cardOffset;
  };

  const slideTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    const targetX = getCenteredOffset(newIndex);
    controls.start({ x: targetX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
  };

  // Initialize position when container width is known
  useLayoutEffect(() => {
    if (containerWidth > 0) {
      const targetX = getCenteredOffset(currentIndex);
      controls.set({ x: targetX });
    }
  }, [containerWidth, cardWidth, isMobile]);

  // Scroll to first uncompleted lesson on mount
  useEffect(() => {
    if (!isReady || hasInitialScrolled || containerWidth === 0) return;

    // Find the first uncompleted lesson
    let targetIndex = 0;
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const progress = lessonProgress[lesson.id];

      // If lesson is not completed (no progress or progress < 100), scroll to it
      if (!progress || !progress.completed) {
        targetIndex = i;
        break;
      }
      // If we've gone through all lessons and all are completed, stay at last one
      targetIndex = i;
    }

    // Use animationDelay + small buffer to ensure smooth animation after intro
    const timer = setTimeout(() => {
      if (targetIndex > 0) {
        slideTo(targetIndex);
      }
      setHasInitialScrolled(true);
    }, animationDelay + 100);

    return () => clearTimeout(timer);
  }, [isReady, containerWidth, lessons, lessonProgress, hasInitialScrolled, animationDelay]);

  const handlePrev = () => {
    slideTo(currentIndex - 1);
  };

  const handleNext = () => {
    slideTo(currentIndex + 1);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      slideTo(currentIndex + 1);
    } else if (offset > threshold || velocity > 500) {
      slideTo(currentIndex - 1);
    } else {
      slideTo(currentIndex);
    }
  };

  // Calculate drag constraints based on centered layout
  const leftConstraint = getCenteredOffset(maxIndex);
  const rightConstraint = getCenteredOffset(0);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex cursor-grab py-20 active:cursor-grabbing"
          style={{ gap: GAP, opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: leftConstraint, right: rightConstraint }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="shrink-0"
            >
              <LessonCard
                lessonId={lesson.id}
                lessonNumber={lesson.lessonNumber}
                title={lesson.title}
                description={lesson.description}
                coverImage={lesson.coverImage}
                coverImageAlt={lesson.coverImageAlt}
                color={moduleColor}
                href={`/module/${moduleUid}/lesson/${lesson.uid}`}
                width={cardWidth}
                height={cardHeight}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-6 px-5 md:flex-row">
        <div className={'w-full md:w-7/12'}>
          <div className={'flex w-full items-center justify-between gap-10'}>
            <div className={'opacity-20 text-white [text-orientation:mixed] [writing-mode:sideways-lr]'}>
              Lessons
            </div>
            <div className={'w-full justify-between'}>
              <ModuleProgress moduleId={moduleId} />{' '}
            </div>
            <div className={'opacity-20 text-white [text-orientation:mixed] [writing-mode:sideways-lr]'}>
              Completed
            </div>
          </div>
        </div>
        <div className={'w-full md:w-5/12'}>
        <SliderNavigation
          currentIndex={currentIndex}
          maxIndex={maxIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSlide={slideTo}
        />
        </div>
      </div>
    </div>
  );
}