"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderNavigationProps {
  currentIndex: number;
  maxIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSlide: (index: number) => void;
}

export function SliderNavigation({
  currentIndex,
  maxIndex,
  onPrev,
  onNext,
  onSlide,
}: SliderNavigationProps) {
  return (
    <div className="flex justify-center items-end gap-4 mt-6">
      <motion.button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous"
      >
        <ChevronLeft className="w-10 h-10 text-gray-600" />
      </motion.button>

      <div className="flex items-end gap-5">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onSlide(index)}
            className="font-medium text-6xl origin-bottom leading-none"
            animate={{
              scale: currentIndex === index ? 1.5 : 1,
              color: currentIndex === index ? "#ef4444" : "#9ca3af",
            }}
            transition={{
              type: "spring",
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
        className="w-10 h-10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next"
      >
        <ChevronRight className="w-10 h-10 text-gray-600" />
      </motion.button>
    </div>
  );
}
