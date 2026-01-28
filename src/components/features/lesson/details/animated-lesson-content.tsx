'use client';

import { motion } from 'framer-motion';
import { type ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { HomeIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLessonProgress } from '@/lib/store';

interface AnimatedLessonContentProps {
  children: ReactNode;
  /** Cover images for prev/next lessons (slider peek effect) - desktop only */
  coverImages: ReactNode;
  /** Progress bar on the left - desktop only */
  progressBar: ReactNode;
  /** Home button - desktop only */
  homeButton: ReactNode;
  /** Previous navigation button (left side) - desktop only */
  prevNavigation: ReactNode;
  /** Next navigation button (right side) - desktop only */
  nextNavigation: ReactNode;
  /** Previous navigation button for mobile */
  prevNavigationMobile: ReactNode;
  /** Next navigation button for mobile */
  nextNavigationMobile: ReactNode;
  /** Module color for styling */
  moduleColor: string;
  /** Module UID for home link */
  moduleUid: string;
  /** Lesson ID for progress */
  lessonId: string;
}

const MOBILE_BREAKPOINT = 768;

// Desktop animations
const cardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, damping: 25, duration: 0.6 },
  },
};

const coverImagesVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.4 } },
};

const progressVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 250, damping: 25, delay: 0.7 },
  },
};

const prevNavigationVariants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 250, damping: 25, delay: 0.8 },
  },
};

const nextNavigationVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 250, damping: 25, delay: 0.8 },
  },
};

const homeButtonVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 250, damping: 25, delay: 0.9 },
  },
};

// Mobile animations - simple fade
const mobileCardVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const mobileBottomNavVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.3 } },
};

export function AnimatedLessonContent({
  children,
  coverImages,
  progressBar,
  homeButton,
  prevNavigation,
  nextNavigation,
  prevNavigationMobile,
  nextNavigationMobile,
  moduleColor,
  moduleUid,
  lessonId,
}: AnimatedLessonContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const progress = useLessonProgress(lessonId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex h-[100dvh] flex-col pt-24">
        {/* Main content area - takes remaining space above nav */}
        <motion.div
          className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-200"
          variants={mobileCardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Horizontal progress bar at top */}
          <div className="shrink-0 px-4 py-4 brightness-90" style={{ backgroundColor: moduleColor }}>
            <div className="flex items-center gap-2 text-xs text-white">
              <span>{progress}%</span>
              <Progress value={progress} className="h-2 flex-1" color={'#ffffff'} />
              <span>Complete</span>
            </div>
          </div>

          {/* Article content - scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </motion.div>

        {/* Bottom navigation bar - fixed height at bottom */}
        <motion.div
          className="shrink-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white"
          variants={mobileBottomNavVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Previous button */}
          {prevNavigationMobile}

          {/* Home button */}
          <Link
            href={`/module/${moduleUid}`}
            className="flex h-14 flex-1 items-center justify-center text-white"
            style={{ backgroundColor: moduleColor }}
          >
            <HomeIcon className="h-6 w-6" />
          </Link>

          {/* Next button */}
          {nextNavigationMobile}
        </motion.div>
      </div>
    );
  }

  // Desktop layout with animations
  return (
    <>
      {/* Cover images for prev/next lessons */}
      <motion.div variants={coverImagesVariants} initial="hidden" animate="visible">
        {coverImages}
      </motion.div>

      <div className="relative z-10 container mx-auto h-screen min-h-full max-w-5xl overflow-visible py-20">
        {/* Wrapper with relative positioning for side elements */}
        <div className="relative h-full w-full">
          {/* Progress bar - slides out from behind (left side) */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={progressVariants}
            initial="hidden"
            animate="visible"
          >
            {progressBar}
          </motion.div>

          {/* Previous button - slides out from behind (left side) */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={prevNavigationVariants}
            initial="hidden"
            animate="visible"
          >
            {prevNavigation}
          </motion.div>

          {/* Next button - slides out from behind (right side) */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={nextNavigationVariants}
            initial="hidden"
            animate="visible"
          >
            {nextNavigation}
          </motion.div>

          {/* Home button - slides out from behind (right side) */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={homeButtonVariants}
            initial="hidden"
            animate="visible"
          >
            {homeButton}
          </motion.div>

          {/* Main content card with zoom animation */}
          <motion.div
            className="relative z-10 flex h-full w-full bg-gray-100 shadow-[0px_4px_65px_14px_rgba(0,0,0,0.25)]"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
}