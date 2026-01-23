"use client";

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
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="w-10 h-10 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <div className="flex items-center gap-5">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSlide(index)}
            className={`font-medium transition-all hover:scale-110 ${
              currentIndex === index
                ? "text-9xl text-red-500"
                : "text-6xl text-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex >= maxIndex}
        className="w-20 h-20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight className="w-10 h-10 text-gray-600" />
      </button>
    </div>
  );
}
