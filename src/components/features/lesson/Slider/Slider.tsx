"use client";

import { useState } from "react";
import { LessonCard } from "../Card";
import { LessonDetail } from "../Detail";
import styles from "./Slider.module.css";

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

export function LessonSlider({ lessons, moduleId, moduleColor }: LessonSliderProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleClose = () => {
    setSelectedLesson(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lessonNumber={lesson.lessonNumber}
            title={lesson.title}
            description={lesson.description}
            duration={lesson.duration}
            color={moduleColor}
            onClick={() => handleLessonClick(lesson)}
          />
        ))}
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