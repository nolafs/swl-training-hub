'use client';
import cn from 'clsx';
import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import VideoControl from './video-control';
import VideoPlayerWrapper from '../video-player-wrapper';
import { ImageFieldImage } from '@prismicio/client';

export interface VimeoProps {
  id: string;
  src?: string;
  title: string;
  poster?: ImageFieldImage;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  loading?: 'lazy' | 'eager';
  loop?: boolean;
  frame?: boolean;
  standard?: boolean;
}

export function Vimeo({
  id,
  src,
  title,
  poster,
  autoplay,
  frame: _frame,
  controls = true,
  loop = false,
  loading = 'lazy',
  width = 1920,
  height = 1200,
  standard: _standard = true,
}: VimeoProps) {
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const ref = useRef<HTMLVideoElement>(null);

  // Vimeo config for react-player v3
  // Note: controls, loop are passed as ReactPlayer props
  const opts = {
    vimeo: {
      title: false,
      byline: false,
      portrait: false,
      dnt: true,
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

  const handleReplay = () => {
    if (autoplay) {
      setShowPlayer(true);
    }
  };

  const play = () => {
    setShowPlayer(true);
  };

  return (
    <VideoPlayerWrapper
      handlePlay={handlePlay}
      handlePause={handlePause}
      handleReplay={handleReplay}
    >
      <div
        className={cn(
          'bg-neutral aspect-w-16 aspect-h-9 relative z-20 h-full w-full overflow-hidden',
          showPlayer ? 'display opacity-100' : 'hidden opacity-0'
        )}
      >
        {showPlayer && (
          <ReactPlayer
            width="100%"
            height="100%"
            playing={showPlayer}
            controls={controls}
            loop={loop}
            muted={autoplay}
            ref={ref}
            id={id}
            src={src}
            config={opts}
            className={'h-full w-full object-cover object-center'}
            onPlay={handlePlay}
          ></ReactPlayer>
        )}

        {!autoplay && (
          <VideoControl
            handlePlayAction={play}
            title={title}
            loading={loading}
            poster={poster}
            width={width}
            height={height}
          />
        )}
      </div>
    </VideoPlayerWrapper>
  );
}

export default Vimeo;
