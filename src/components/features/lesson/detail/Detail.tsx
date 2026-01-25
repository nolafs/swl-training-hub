'use client';

import { useRouter } from 'next/navigation';
import styles from './Detail.module.css';

interface Lesson {
  id: string;
  uid: string;
  lessonNumber: number;
  title: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
}

interface LessonDetailProps {
  lesson: Lesson;
  moduleId: string;
  color: string;
  onClose: () => void;
}

export function LessonDetail({ lesson, moduleId, color, onClose }: LessonDetailProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push(`/module/${moduleId}/lesson/${lesson.uid}`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.lessonCard}>
          <div className={styles.cardHeader} style={{ backgroundColor: color }}>
            <span className={styles.lessonNumber}>{lesson.lessonNumber}</span>
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.title}>{lesson.title}</h2>
            <p className={styles.description}>{lesson.description}</p>
          </div>
        </div>

        <button className={styles.startButton} onClick={handleStart}>
          <span>Start Lesson</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
