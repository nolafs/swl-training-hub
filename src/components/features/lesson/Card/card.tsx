"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface LessonCardProps {
  lessonNumber: number;
  title: string;
  description: string;
  duration?: string;
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function LessonCard({
  lessonNumber,
  title,
  description,
  duration,
  color,
  isSelected = false,
  onClick,
}: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-[180px] h-[180px] bg-neutral-100 cursor-pointer overflow-hidden flex flex-col"
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
      <div className="flex-1 p-4 flex flex-col relative z-10">
        <span className="text-xl font-bold text-gray-800">{lessonNumber}</span>
        {isHovered && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
            {duration && (
              <span className="inline-block mt-2 text-[10px] text-gray-400">{duration}</span>
            )}
          </motion.div>
        )}
      </div>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
        animate={{
          height: isSelected ? "100%" : isHovered ? 10 : 4,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}
