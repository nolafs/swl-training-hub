'use client';
import { useCallback, useRef, type SyntheticEvent } from 'react';
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

  const handleTimeUpdate = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      if (video.duration > 0) {
        // Calculate progress as percentage (0-100)
        const progressPercent = Math.round((video.currentTime / video.duration) * 100);

        // Only update if progress increased by at least 1% to avoid excessive updates
        if (progressPercent > lastSavedProgress.current) {
          lastSavedProgress.current = progressPercent;
          updateLessonProgress(lessonId, moduleId, progressPercent);
        }
      }
    },
    [lessonId, moduleId, updateLessonProgress]
  );

  const handleEnded = useCallback(() => {
    // Mark as 100% complete when video ends
    updateLessonProgress(lessonId, moduleId, 100);
  }, [lessonId, moduleId, updateLessonProgress]);

  return (
    <div className="aspect-video">
      <ReactPlayer
        src={videoUrl}
        controls
        width="100%"
        height="100%"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}