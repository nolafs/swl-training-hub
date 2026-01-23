"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { LessonCard } from "../Card";
import { LessonDetail } from "../Detail";

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
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleClose = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="w-full relative overflow-hidden" ref={constraintsRef}>
      <motion.div
        className="flex gap-6 p-10 cursor-grab active:cursor-grabbing [&>*]:shrink-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      >
        {lessons.map((lesson) => (
          <motion.div key={lesson.id} variants={itemVariants}>
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
