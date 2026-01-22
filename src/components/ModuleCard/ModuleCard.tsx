"use client";

import { useState } from "react";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

export function ModuleCard({
  moduleNumber,
  title,
  description,
  color,
  onClick,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.content}>
        <span className={styles.moduleNumber}>{moduleNumber}</span>
        {isHovered && (
          <div className={styles.hoverContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
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