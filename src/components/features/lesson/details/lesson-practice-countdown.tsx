'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageField } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { useUpdateLessonProgress } from '@/lib/store';

interface LessonPracticeCountdownProps {
  lessonId: string;
  moduleId: string;
  duration: number | null; // Duration in seconds from CMS
  coverImage: ImageField;
}

function formatTime(totalSeconds: number): { hours: string; minutes: string; seconds: string } {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

export function LessonPracticeCountdown({
  lessonId,
  moduleId,
  duration,
  coverImage,
}: LessonPracticeCountdownProps) {
  const updateLessonProgress = useUpdateLessonProgress();
  const initialDuration = duration ?? 0;
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    setIsRunning(false);
    updateLessonProgress(lessonId, moduleId, 100);
  }, [lessonId, moduleId, updateLessonProgress]);

  // Update progress as countdown progresses
  useEffect(() => {
    if (initialDuration > 0 && timeRemaining < initialDuration) {
      const progressPercent = Math.round(((initialDuration - timeRemaining) / initialDuration) * 100);
      updateLessonProgress(lessonId, moduleId, progressPercent);
    }
  }, [timeRemaining, initialDuration, lessonId, moduleId, updateLessonProgress]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, handleComplete]);

  const handleStart = () => {
    if (timeRemaining > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeRemaining(initialDuration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const { hours, minutes, seconds } = formatTime(timeRemaining);
  const showHours = initialDuration >= 3600;

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      {/* Background Image */}
      <PrismicNextImage
        field={coverImage}
        className="absolute inset-0 h-full w-full object-cover"
        fallbackAlt=""
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Countdown Content */}
      <div className="relative flex h-full flex-col items-center justify-center text-white">
        {isComplete ? (
          <div className="text-center">
            <div className="mb-4 text-6xl font-bold tracking-tight md:text-8xl">Complete!</div>
            <button
              onClick={handleReset}
              className="rounded-lg bg-white/20 px-6 py-3 text-lg font-medium backdrop-blur-sm transition hover:bg-white/30"
            >
              Restart Practice
            </button>
          </div>
        ) : (
          <>
            {/* Timer Display */}
            <div className="mb-8 flex items-center gap-2 font-mono text-7xl font-bold tracking-tight md:text-9xl">
              {showHours && (
                <>
                  <span className="tabular-nums">{hours}</span>
                  <span className="animate-pulse">:</span>
                </>
              )}
              <span className="tabular-nums">{minutes}</span>
              <span className="animate-pulse">:</span>
              <span className="tabular-nums">{seconds}</span>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="rounded-lg bg-white/20 px-8 py-4 text-xl font-medium backdrop-blur-sm transition hover:bg-white/30"
                >
                  {timeRemaining === initialDuration ? 'Start Practice' : 'Resume'}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="rounded-lg bg-white/20 px-8 py-4 text-xl font-medium backdrop-blur-sm transition hover:bg-white/30"
                >
                  Pause
                </button>
              )}

              {timeRemaining !== initialDuration && !isRunning && (
                <button
                  onClick={handleReset}
                  className="rounded-lg bg-white/10 px-8 py-4 text-xl font-medium backdrop-blur-sm transition hover:bg-white/20"
                >
                  Reset
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
