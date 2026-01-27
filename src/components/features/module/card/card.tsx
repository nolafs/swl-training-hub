'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useModuleProgress } from '@/lib/store';

interface ModuleCardProps {
  moduleId: string;
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  href: string;
  cardDimension?: number;
}

const DRAG_THRESHOLD = 5; // pixels - if moved more than this, it's a drag not a click

export function ModuleCard({
  moduleId,
  moduleNumber,
  title,
  description,
  color,
  href,
  cardDimension = 375,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const progress = useModuleProgress(moduleId);

  console.log('ModuleCard progress:', progress, 'for moduleId:', moduleId);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    // If we don't have a start position, allow the click
    if (!pointerStartRef.current) {
      router.push(href);
      return;
    }

    // Calculate how far the pointer moved
    const deltaX = Math.abs(e.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartRef.current.y);

    // Only navigate if it was a click (small movement), not a drag
    if (deltaX < DRAG_THRESHOLD && deltaY < DRAG_THRESHOLD) {
      router.push(href);
    }

    pointerStartRef.current = null;
  };

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ zIndex: isHovered ? 50 : 1 }}
    >
      {/* Progress bar - slides out from left */}
      <motion.div
        className="absolute top-1/2 left-0 flex h-75 w-20 -translate-y-1/2 p-3 brightness-95"
        style={{ backgroundColor: color }}
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? -110 : 0,
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
              {progress?.progress}%
            </div>
            <div className="text-xs leading-normal font-semibold tracking-tight text-gray-50 uppercase [text-orientation:mixed] [writing-mode:sideways-lr]">
              Completed
            </div>
          </div>

          <div className="h-full w-2 overflow-hidden rounded-full bg-gray-200/30">
            <motion.div
              className="w-full rounded-full bg-white"
              initial={{ height: 0 }}
              animate={{ height: `${progress?.progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Start button - slides out from right */}
      <motion.div
        className="absolute right-0 bottom-3 -translate-y-1/2"
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? 110 : 0,
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
          className="flex h-20 w-24 items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        >
          <ArrowRight className="ml-4 h-10 w-10" />
        </Link>
      </motion.div>

      {/* Main card - uses programmatic navigation to allow drag on slider */}
      <motion.div
        className="relative flex cursor-pointer flex-col overflow-hidden border bg-white"
        style={{ height: cardDimension, width: cardDimension }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        animate={{
          scale: isHovered ? 1.2 : 1,
          borderColor: isHovered ? color : 'rgba(0, 0, 0, 0.2)',
          boxShadow: isHovered ? '0 20px 50px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
          zIndex: isHovered ? 50 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="relative z-10 flex flex-1 flex-col p-4">
          <div className="grid grid-cols-2 items-center justify-center gap-2">
            <motion.div
              className="text-5xl font-extralight"
              animate={{ color: isHovered ? '#ffffff' : color }}
              transition={{ duration: 0.3 }}
            >
              {moduleNumber > 9 ? moduleNumber : '0' + moduleNumber}
            </motion.div>
            <motion.div
              className="text-right text-2xl font-light"
              animate={{ color: isHovered ? '#ffffff' : color }}
              transition={{ duration: 0.3 }}
            >
              Module
            </motion.div>
          </div>
          {isHovered && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-white/80">{description}</p>
            </motion.div>
          )}
        </div>
        <motion.div
          className="absolute bottom-0 left-0 h-4 w-full"
          style={{ backgroundColor: color }}
          animate={{
            height: isHovered ? '100%' : 16,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
