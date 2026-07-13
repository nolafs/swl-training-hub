'use client';
import { useCallback, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useUpdateLessonProgress } from '@/lib/store';

const BUNNY_LIB_ID = process.env.NEXT_PUBLIC_BUNNY_LIB_ID;

interface LessonVideoPlayerProps {
  lessonId: string;
  moduleId: string;
  videoUrl?: string;
  bunnyVideoId?: string | null;
}

export function LessonVideoPlayer({ lessonId, moduleId, videoUrl, bunnyVideoId }: LessonVideoPlayerProps) {
  const updateLessonProgress = useUpdateLessonProgress();
  const lastSavedProgress = useRef<number>(0);
  const playerRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track progress via postMessage events from the Bunny player
  useEffect(() => {
    if (!bunnyVideoId) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (data.event === 'timeupdate' && data.duration > 0) {
        const progressPercent = Math.round((data.seconds / data.duration) * 100);
        if (progressPercent > lastSavedProgress.current) {
          lastSavedProgress.current = progressPercent;
          updateLessonProgress(lessonId, moduleId, progressPercent);
        }
      }

      if (data.event === 'ended') {
        updateLessonProgress(lessonId, moduleId, 100);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bunnyVideoId, lessonId, moduleId, updateLessonProgress]);

  // Poll player progress every second for reliable tracking with embedded videos
  useEffect(() => {
    if (bunnyVideoId) return;

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
  }, [lessonId, moduleId, updateLessonProgress, bunnyVideoId]);

  const handleEnded = useCallback(() => {
    updateLessonProgress(lessonId, moduleId, 100);
  }, [lessonId, moduleId, updateLessonProgress]);

  if (bunnyVideoId && BUNNY_LIB_ID) {
    return (
      <div className="aspect-video">
        <iframe
          ref={iframeRef}
          src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIB_ID}/${bunnyVideoId}?autoplay=false&loop=false&muted=false&preload=true`}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (!videoUrl) return null;

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