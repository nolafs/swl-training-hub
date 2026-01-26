'use client';

import { useRouter } from 'next/navigation';
import styles from './Detail.module.css';

interface ModuleDetailProps {
  module: Module;
  onClose: () => void;
}

export function ModuleDetail({ module, onClose }: ModuleDetailProps) {
  const router = useRouter();

  const handleNext = () => {
    router.push(`/module/${module.id}`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Progress box on the left */}
        <div className={styles.progressBox}>
          <h4 className={styles.progressTitle}>Progress</h4>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${module.progress || 0}%`,
                backgroundColor: module.colour,
              }}
            />
          </div>
          <span className={styles.progressText}>{module.progress || 0}%</span>
        </div>

        {/* Main module card */}
        <div className={styles.moduleCard}>
          <div className={styles.cardHeader} style={{ backgroundColor: module.colour }}>
            <span className={styles.moduleNumber}>{module.position}</span>
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.title}>{module.title}</h2>
            <p className={styles.description}>{module.description}</p>
            {module.lessons && module.lessons.length > 0 && (
              <div className={styles.lessonPreview}>
                <span className={styles.lessonCount}>{module.lessons.length} lessons</span>
              </div>
            )}
          </div>
        </div>

        {/* Next button on the right */}
        <button className={styles.nextButton} onClick={handleNext}>
          <span>Start</span>
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
