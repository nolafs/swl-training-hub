'use client';
import { useCallback, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useUpdateLessonProgress } from '@/lib/store';

interface LessonVideoPlayerProps {
  lessonId: string;
  moduleId: string;
  videoUrl: string;
}

export function LessonVideoPlayer({ lessonId, moduleId, videoUrl }: LessonVideoPlayerProps) {
  const updateLessonProgress = useUpdateLessonProgress();
  const lastSavedProgress = useRef<number>(0);
  const playerRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll player progress every second for reliable tracking with embedded videos
  useEffect(() => {
    const checkProgress = () => {
      const player = playerRef.current;
      if (player && player.duration > 0) {
        const progressPercent = Math.round((player.currentTime / player.duration) * 100);

        if (progressPercent > lastSavedProgress.current) {
          lastSavedProgress.current = progressPercent;
          updateLessonProgress(lessonId, moduleId, progressPercent);
        }
      }
    };

    intervalRef.current = setInterval(checkProgress, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [lessonId, moduleId, updateLessonProgress]);

  const handleEnded = useCallback(() => {
    // Mark as 100% complete when video ends
    updateLessonProgress(lessonId, moduleId, 100);
  }, [lessonId, moduleId, updateLessonProgress]);

  return (
    <div className="aspect-video">
      <ReactPlayer
        ref={playerRef}
        src={videoUrl}
        controls
        width="100%"
        height="100%"
        onEnded={handleEnded}
      />
    </div>
  );
}