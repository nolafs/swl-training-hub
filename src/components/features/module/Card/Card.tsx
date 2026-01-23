"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Card.module.css";

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ModuleCard({
  moduleNumber,
  title,
  description,
  color,
  isSelected = false,
  onClick,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.15 : 1,
        boxShadow: isSelected
          ? "0 25px 50px rgba(0, 0, 0, 0.3)"
          : isHovered
            ? "0 10px 40px rgba(0, 0, 0, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: isSelected ? 1.15 : 1.05 }}
    >
      <div className={styles.content}>
        <span className={styles.moduleNumber}>{moduleNumber}</span>
        {isHovered && (
          <motion.div
            className={styles.hoverContent}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </motion.div>
        )}
      </div>
      <motion.div
        className={styles.colorBar}
        style={{ backgroundColor: color }}
        animate={{
          height: isSelected ? "100%" : isHovered ? 12 : 4,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}