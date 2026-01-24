'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LessonCardProps {
  lessonNumber: number;
  title: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function LessonCard({
  lessonNumber,
  title,
  coverImage,
  coverImageAlt,
  description,
  color,
  isSelected = false,
  onClick,
}: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex h-[200px] w-[320px] cursor-pointer flex-col overflow-hidden bg-neutral-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.1 : 1,
        zIndex: isSelected || isHovered ? 50 : 1,
        boxShadow: isSelected
          ? '0 25px 50px rgba(0, 0, 0, 0.4)'
          : isHovered
            ? '0 15px 40px rgba(0, 0, 0, 0.25)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: isSelected ? 1.1 : 1.03 }}
    >
      {/* Cover Image */}
      {coverImage ? (
        <Image
          src={coverImage}
          alt={coverImageAlt || title}
          fill
          className="object-cover"
          sizes="320px"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
      )}

      {/* Blurred overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Description overlay on hover */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-white/90 leading-relaxed text-center line-clamp-5">
          {description}
        </p>
      </motion.div>

      {/* Caption bar at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: color }}
        animate={{
          y: isHovered ? 100 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <span className="text-white font-bold text-lg">
          {lessonNumber < 10 ? `0${lessonNumber}` : lessonNumber}
        </span>
        <span className="text-white/90 text-sm font-medium truncate">
          {title}
        </span>
      </motion.div>
    </motion.div>
  );
}
