"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { LessonCard } from "../Card";
import { LessonDetail } from "../Detail";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  description: string;
  duration?: string;
}

interface LessonSliderProps {
  lessons: Lesson[];
  moduleId: string;
  moduleColor: string;
}

const CARD_WIDTH = 180;
const GAP = 24;
const PADDING = 40;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function LessonSlider({ lessons, moduleId, moduleColor }: LessonSliderProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current && sliderRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = sliderRef.current.scrollWidth;
        const maxScroll = contentWidth - containerWidth + PADDING;
        const totalSlides = Math.ceil(maxScroll / (CARD_WIDTH + GAP));
        setMaxIndex(Math.max(0, totalSlides));
      }
    };

    updateMaxIndex();
    window.addEventListener("resize", updateMaxIndex);
    return () => window.removeEventListener("resize", updateMaxIndex);
  }, [lessons.length]);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleClose = () => {
    setSelectedLesson(null);
  };

  const slideTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    const targetX = -newIndex * (CARD_WIDTH + GAP);
    controls.start({ x: targetX, transition: { type: "spring", stiffness: 300, damping: 30 } });
  };

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

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      {/* Slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex gap-6 p-10 cursor-grab active:cursor-grabbing"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxIndex * (CARD_WIDTH + GAP), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          onAnimationComplete={() => {
            x.set(-currentIndex * (CARD_WIDTH + GAP));
          }}
        >
          {lessons.map((lesson) => (
            <motion.div key={lesson.id} variants={itemVariants} className="shrink-0">
              <LessonCard
                lessonNumber={lesson.lessonNumber}
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                color={moduleColor}
                isSelected={selectedLesson?.id === lesson.id}
                onClick={() => handleLessonClick(lesson)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Number Navigation */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => slideTo(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                currentIndex === index
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          moduleId={moduleId}
          color={moduleColor}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
