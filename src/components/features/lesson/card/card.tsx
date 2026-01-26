'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLessonProgress } from '@/lib/store';

interface LessonCardProps {
  lessonId: string;
  lessonNumber: number;
  title: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  color: string;
  href: string;
  width?: number;
  height?: number;
}

const DRAG_THRESHOLD = 5;

export function LessonCard({
  lessonId,
  lessonNumber,
  title,
  coverImage,
  coverImageAlt,
  description,
  color,
  href,
  width = 320,
  height = 200,
}: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lessonProgress = useLessonProgress(lessonId);


  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!pointerStartRef.current) {
      router.push(href);
      return;
    }

    const deltaX = Math.abs(e.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartRef.current.y);

    if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
      router.push(href);
    }

    pointerStartRef.current = null;
  };

  // Calculate proportional sizes for progress bar and start button
  const sideElementWidth = Math.max(64, width * 0.12);
  const slideDistance = sideElementWidth + 16; // element width + gap

  return (
    <motion.div
      className="relative"
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ zIndex: isHovered ? 50 : 1 }}
    >
      {/* Progress bar - slides out from left */}
      <motion.div
        className="absolute top-1/2 left-0 flex h-75 w-20 -translate-y-1/2 p-3 shadow-lg brightness-90"
        style={{ backgroundColor: color, height: height * 0.8, width: sideElementWidth }}
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? -slideDistance : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className={'flex h-full gap-2.5'}>
          <div className={'flex flex-col items-center justify-between border-white/30'}>
            <div className="text-xs leading-normal font-medium tracking-tight text-gray-50 [text-orientation:mixed] [writing-mode:sideways-lr]">
              {lessonProgress}%
            </div>
            <div className="text-xs leading-normal font-semibold tracking-tight text-gray-50 uppercase [text-orientation:mixed] [writing-mode:sideways-lr]">
              Completed
            </div>
          </div>
          <div
            className="h-full w-2 overflow-hidden rounded-full bg-gray-200/30"
          >
            <motion.div
              className="w-full rounded-full"
              style={{ backgroundColor: '#ffffff' }}
              initial={{ height: 0 }}
              animate={{ height: `${lessonProgress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Start button - slides out from right */}
      <motion.div
        className="absolute right-0 bottom-4"
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? slideDistance : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        <Link
          href={href}
          className="flex items-center justify-center w-20 h-16 text-white shadow-lg transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        >
          <ArrowRight className="ml-2 h-8 w-8" />
        </Link>
      </motion.div>

      {/* Main card */}
      <motion.div
        className="relative flex cursor-pointer flex-col overflow-hidden bg-neutral-900"
        style={{ width, height }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        animate={{
          scale: isHovered ? 1.1 : 1,
          zIndex: isHovered ? 50 : 1,
          boxShadow: isHovered ? '0 20px 50px rgba(0, 0, 0, 0.3)' : 'none',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        {/* Cover Image */}
        {coverImage ? (
          <Image
            src={coverImage}
            alt={coverImageAlt || title}
            fill
            className="object-cover"
            sizes={`${width}px`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
        )}

        {/* Caption bar - expands to fill card on hover */}
        <motion.div
          className="absolute right-0 bottom-0 left-0 flex flex-col justify-start overflow-hidden px-4 py-3"
          style={{ backgroundColor: isHovered ? `${color}cc` : color }}
          animate={{
            height: isHovered ? '100%' : 48,
            backdropFilter: isHovered ? 'blur(12px)' : 'blur(0px)',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
        >
          {/* Heading - moves up on hover */}
          <motion.div
            className="flex items-center gap-3"
            animate={{
              y: isHovered ? 0 : 0,
            }}
          >
            <span className="text-lg font-bold text-white">
              {lessonNumber < 10 ? `0${lessonNumber}` : lessonNumber}
            </span>
            <span className="truncate text-sm font-medium text-white/90">{title}</span>
          </motion.div>

          {/* Description - appears below heading on hover */}
          <motion.p
            className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{
              duration: 0.3,
              delay: isHovered ? 0.1 : 0,
            }}
          >
            {description}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}