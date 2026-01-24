'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
      className="relative flex h-[180px] w-[180px] cursor-pointer flex-col overflow-hidden bg-neutral-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.15 : 1,
        boxShadow: isSelected
          ? '0 25px 50px rgba(0, 0, 0, 0.3)'
          : isHovered
            ? '0 10px 40px rgba(0, 0, 0, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: isSelected ? 1.15 : 1.05 }}
    >
      <div className="relative z-10 flex flex-1 flex-col p-4">
        <span className="text-xl font-bold text-gray-800">{lessonNumber}</span>
        {isHovered && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-1 text-[13px] font-semibold text-gray-800">{title}</h3>
            <p className="text-[11px] leading-relaxed text-gray-500">{description}</p>
            {duration && (
              <span className="mt-2 inline-block text-[10px] text-gray-400">{duration}</span>
            )}
          </motion.div>
        )}
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-1 w-full"
        style={{ backgroundColor: color }}
        animate={{
          height: isSelected ? '100%' : isHovered ? 10 : 4,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}
