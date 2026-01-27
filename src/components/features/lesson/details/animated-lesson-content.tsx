'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface AnimatedLessonContentProps {
  children: ReactNode;
  /** Cover images for prev/next lessons (slider peek effect) */
  coverImages: ReactNode;
  /** Progress bar on the left */
  progressBar: ReactNode;
  /** Home button */
  homeButton: ReactNode;
  /** Previous navigation button (left side) */
  prevNavigation: ReactNode;
  /** Next navigation button (right side) */
  nextNavigation: ReactNode;
}

// Main content card - zooms in from smaller scale (high z-index so side elements slide from behind)
const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
      duration: 0.6,
    },
  },
};

// Cover images - slide in from sides with delay
const coverImagesVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.4,
    },
  },
};

// Progress bar - slides out from behind the card (left side)
// Completely hidden until card is fully scaled, then slides out
const progressVariants = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 25,
      delay: 0.7,
    },
  },
};

// Previous button - slides out from behind the card (left side, same direction as progress)
// Completely hidden until card is fully scaled, then slides out from right to left
const prevNavigationVariants = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 25,
      delay: 0.8,
    },
  },
};

// Next button - slides out from behind the card (right side)
// Completely hidden until card is fully scaled, then slides out from left to right
const nextNavigationVariants = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 25,
      delay: 0.8,
    },
  },
};

// Home button - slides out from behind (right side)
// Completely hidden until card is fully scaled, then slides out
const homeButtonVariants = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 25,
      delay: 0.9,
    },
  },
};

export function AnimatedLessonContent({
  children,
  coverImages,
  progressBar,
  homeButton,
  prevNavigation,
  nextNavigation,
}: AnimatedLessonContentProps) {
  return (
    <>
      {/* Cover images for prev/next lessons */}
      <motion.div variants={coverImagesVariants} initial="hidden" animate="visible">
        {coverImages}
      </motion.div>

      <div className="relative z-10 container mx-auto h-screen min-h-full max-w-5xl overflow-visible py-20">
        {/* Wrapper with relative positioning for side elements */}
        <div className="relative h-full w-full">
          {/* Progress bar - slides out from behind (left side) - z-0 to be behind card */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={progressVariants}
            initial="hidden"
            animate="visible"
          >
            {progressBar}
          </motion.div>

          {/* Previous button - slides out from behind (left side) - z-0 to be behind card */}
          <motion.div
            id={'prevButton'}
            className="absolute inset-0 z-0"
            variants={prevNavigationVariants}
            initial="hidden"
            animate="visible"
          >
            {prevNavigation}
          </motion.div>

          {/* Next button - slides out from behind (right side) - z-0 to be behind card */}
          <motion.div
            id={'nextButton'}
            className="absolute inset-0 z-0"
            variants={nextNavigationVariants}
            initial="hidden"
            animate="visible"
          >
            {nextNavigation}
          </motion.div>

          {/* Home button - slides out from behind (right side) - z-0 to be behind card */}
          <motion.div
            className="absolute inset-0 z-0"
            variants={homeButtonVariants}
            initial="hidden"
            animate="visible"
          >
            {homeButton}
          </motion.div>

          {/* Main content card with zoom animation - z-10 to be above side elements */}
          <motion.div
            className="relative z-10 flex h-full w-full bg-gray-100 shadow-[0px_4px_65px_14px_rgba(0,0,0,0.25)]"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Article content */}
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
}