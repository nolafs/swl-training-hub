'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderNavigationProps {
  currentIndex: number;
  maxIndex: number;
  color?: string;
  onPrev: () => void;
  onNext: () => void;
  onSlide: (index: number) => void;
}

export function SliderNavigation({
  currentIndex,
  color,
  maxIndex,
  onPrev,
  onNext,
  onSlide,
}: SliderNavigationProps) {
  return (
    <div className="mt-6 flex items-end justify-end gap-4">
      <motion.button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="flex h-10 w-10 items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous"
      >
        <ChevronLeft className="h-10 w-10 text-gray-600" />
      </motion.button>

      <div className="flex items-end gap-10">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlide(index)}
            className="origin-bottom text-6xl leading-none font-semibold"
            animate={{
              scale: currentIndex === index ? 1.5 : 1,
              color: currentIndex === index ? (color ?? '#fff') : (color ? `${color}` : 'rgba(255,255,255,0.50)'),
              lineHeight: currentIndex === index ? 0.9 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            whileHover={{ scale: currentIndex === index ? 1.5 : 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
        className="flex h-10 w-10 items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next"
      >
        <ChevronRight className="h-10 w-10 text-gray-600" />
      </motion.button>
    </div>
  );
}
