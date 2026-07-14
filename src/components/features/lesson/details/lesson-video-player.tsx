'use client';
import { useCallback, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useUpdateLessonProgress } from '@/lib/store';

const BUNNY_LIB_ID = process.env.NEXT_PUBLIC_BUNNY_LIB_ID;

interface PlayerJSInstance {
  on: (event: string, callback: (data?: { seconds: number; duration: number }) => void) => void;
  off: (event: string) => void;
}

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
  const isMounted = useRef(true);
  const playerInstanceRef = useRef<PlayerJSInstance | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Track Bunny player progress via player.js
  useEffect(() => {
    if (!bunnyVideoId || !iframeRef.current) return;

    (async () => {
      const m = await import('player.js');
      if (!isMounted.current || !iframeRef.current) return;

      const PlayerJS = m.default || m;
      const playerInstance: PlayerJSInstance = new PlayerJS.Player(iframeRef.current);
      playerInstanceRef.current = playerInstance;

      playerInstance.on('ready', () => {
        playerInstance.on('timeupdate', (progress?: { seconds: number; duration: number }) => {
          if (!progress?.duration) return;
          const percent = Math.round((progress.seconds / progress.duration) * 100);
          if (percent > lastSavedProgress.current) {
            lastSavedProgress.current = percent;
            updateLessonProgress(lessonId, moduleId, percent);
          }
        });

        playerInstance.on('ended', () => {
          updateLessonProgress(lessonId, moduleId, 100);
        });
      });
    })();

    return () => {
      playerInstanceRef.current?.off('timeupdate');
      playerInstanceRef.current?.off('ended');
      playerInstanceRef.current = null;
    };
  }, [bunnyVideoId, lessonId, moduleId, updateLessonProgress]);

  // Poll progress for YouTube/other embedded players
  useEffect(() => {
    if (bunnyVideoId) return;

    const checkProgress = () => {
      const player = playerRef.current;
      if (player && player.duration > 0) {
        const percent = Math.round((player.currentTime / player.duration) * 100);
        if (percent > lastSavedProgress.current) {
          lastSavedProgress.current = percent;
          updateLessonProgress(lessonId, moduleId, percent);
        }
      }
    };

    intervalRef.current = setInterval(checkProgress, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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