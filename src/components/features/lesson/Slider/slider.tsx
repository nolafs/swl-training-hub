'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { LessonCard } from '../Card';
import { LessonDetail } from '../Detail';
import { SliderNavigation } from '@/components/ui/SliderNavigation';

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
  moduleId: string;
  moduleColor: string;
}

const CARD_WIDTH = 320;
const GAP = 24;

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

export function LessonSlider({ lessons, moduleId, moduleColor }: LessonSliderProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();

  useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current && sliderRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = sliderRef.current.scrollWidth;
        const maxScroll = contentWidth - containerWidth;
        const totalSlides = Math.ceil(maxScroll / (CARD_WIDTH + GAP));
        setMaxIndex(Math.max(0, totalSlides));
      }
    };

    updateMaxIndex();
    window.addEventListener('resize', updateMaxIndex);
    return () => window.removeEventListener('resize', updateMaxIndex);
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
    controls.start({ x: targetX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
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
    <div className="relative w-full" ref={containerRef}>
      {/* Slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex cursor-grab gap-6 p-32 active:cursor-grabbing"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -maxIndex * (CARD_WIDTH + GAP), right: 0 }}
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
                lessonNumber={lesson.lessonNumber}
                title={lesson.title}
                description={lesson.description}
                coverImage={lesson.coverImage}
                coverImageAlt={lesson.coverImageAlt}
                color={moduleColor}
                isSelected={selectedLesson?.id === lesson.id}
                onClick={() => handleLessonClick(lesson)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>


      <div className="mt-4 grid grid-cols-1 items-center gap-6 px-5 md:grid-cols-2">
        <div>Progress here</div>
        <SliderNavigation
          currentIndex={currentIndex}
          maxIndex={maxIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSlide={slideTo}
        />
      </div>

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
