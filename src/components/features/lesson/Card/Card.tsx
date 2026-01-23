"use client";

import { useState } from "react";
import styles from "./Card.module.css";

interface LessonCardProps {
  lessonNumber: number;
  title: string;
  description: string;
  duration?: string;
  color: string;
  onClick?: () => void;
}

export function LessonCard({
  lessonNumber,
  title,
  description,
  duration,
  color,
  onClick,
}: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.content}>
        <span className={styles.lessonNumber}>{lessonNumber}</span>
        {isHovered && (
          <div className={styles.hoverContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            {duration && <span className={styles.duration}>{duration}</span>}
          </div>
        )}
      </div>
      <div
        className={`${styles.colorBar} ${isHovered ? styles.colorBarExpanded : ""}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}