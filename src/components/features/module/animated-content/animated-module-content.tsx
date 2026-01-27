'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface AnimatedModuleContentProps {
  children: ReactNode;
  moduleNumber: number;
  moduleTitle: string;
  moduleDescription: string;
  continueButton: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const numberVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20,
      delay: 0.8,
    },
  },
};

const infoVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20,
      delay: 0.9,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
      delay: 1.1,
    },
  },
};

export function AnimatedModuleContent({
  children,
  moduleNumber,
  moduleTitle,
  moduleDescription,
  continueButton,
}: AnimatedModuleContentProps) {
  return (
    <motion.div
      className="flex h-full w-full flex-1 flex-col pt-32 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Slider area */}
      <motion.div variants={itemVariants}>
        {children}
      </motion.div>

      {/* Module info section */}
      <div className="mt-20 grid grid-cols-1 items-center gap-6 px-5 text-white md:grid-cols-2">
        <div className="flex">
          <motion.div
            className="text-9xl font-extralight tracking-tight"
            variants={numberVariants}
          >
            {moduleNumber < 10 ? `0${moduleNumber}` : moduleNumber}
          </motion.div>
          <motion.div
            className="ml-4 flex flex-col justify-center space-y-1"
            variants={infoVariants}
          >
            <div className="text-xl font-extralight uppercase">Module</div>
            <div className="text-3xl font-bold">{moduleTitle}</div>
            <div className="text-xl font-normal">{moduleDescription}</div>
          </motion.div>
        </div>
        <motion.div className="flex justify-center" variants={buttonVariants}>
          {continueButton}
        </motion.div>
      </div>
    </motion.div>
  );
}