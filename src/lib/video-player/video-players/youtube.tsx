'use client';

import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import VideoControl from './video-control';

import VideoPlayerWrapper from '../video-player-wrapper';
import cn from 'clsx';
import { ImageFieldImage } from '@prismicio/client';

export interface YoutubeProps {
  id: string;
  src?: string;
  title: string;
  poster?: ImageFieldImage;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  loading?: 'lazy' | 'eager';
  frame?: boolean;
}

export function Youtube({
  id,
  src,
  title,
  poster,
  autoplay = false,
  controls = true,
  loop = false,
  loading = 'lazy',
  width = 1920,
  height = 1200,
}: YoutubeProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<{ seekTo: (seconds: number) => void } | null>(null);

  if (!width) {
    width = 944;
  }

  if (!height) {
    height = 531;
  }

  // YouTube IFrame API parameters
  // Note: autoplay, controls, loop are handled via ReactPlayer props, not config
  // See: https://developers.google.com/youtube/player_parameters
  const opts = {
    youtube: {
      rel: 0 as const, // Don't show related videos
      enablejsapi: 1 as const, // Enable JS API
    },
  };

  const handlePlay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const handlePause = () => {
    setShowPlayer(false);
  };

  const handleEnded = () => {
    setShowPlayer(false);
    playerRef.current?.seekTo(0);
  };

  const handleReplay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const play = () => {
    setShowPlayer(true);
  };

  return (
    <VideoPlayerWrapper handlePlay={handlePlay} handlePause={handlePause} handleReplay={handleReplay}>
      <div className={cn('aspect-h-9 aspect-w-16 relative z-20 h-full w-full overflow-hidden')}>
        {showPlayer && (
          <ReactPlayer
            width="100%"
            height="100%"
            playing={showPlayer}
            controls={controls}
            loop={loop}
            ref={ref}
            id={id}
            src={src}
            config={opts}
            onPlay={handlePlay}
            onEnded={handleEnded}
            className={'absolute min-h-full w-auto min-w-full max-w-none'}
          />
        )}

        {!autoplay && (
          <VideoControl
            handlePlayAction={play}
            title={title}
            poster={poster}
            loading={loading}
            width={width}
            height={height}
            visible={!showPlayer}
          />
        )}
      </div>
    </VideoPlayerWrapper>
  );
}

export default Youtube;
