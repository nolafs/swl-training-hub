'use client';
import dynamic from 'next/dynamic';
import Notification from '@/components/ui/notification';
import { type EmbedField, ImageFieldImage } from '@prismicio/client';

export interface ContentVideoProps {
  id: string;
  video?: EmbedField;
  loading?: 'lazy' | 'eager';
  image?: ImageFieldImage;
  autoplay?: boolean;
  controls?: boolean;
}

export function VideoPlayer({ id, video, loading, image }: ContentVideoProps) {
  if (!video) {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (video.type !== 'video') {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (!video.embed_url) {
    return <Notification body={'No video source found'} type={'error'} />;
  }

  if (!video.provider_name) {
    return <Notification body={'No video type found'} type={'error'} />;
  }

  if (video.provider_name === 'YouTube') {
    const Youtube = dynamic(() => import('./video-players/youtube'), { ssr: false });

    return (
      <Youtube
        id={id}
        title={video.title ?? id}
        poster={image}
        src={video.embed_url}
        width={944}
        loading={loading}
        height={531}
      />
    );
  }

  if (video.provider_name === 'Vimeo') {
    const Vimeo = dynamic(() => import('./video-players/vimeo'), { ssr: false });

    return (
      <Vimeo
        id={id}
        title={video.title ?? ''}
        poster={image}
        loading={loading}
        src={video.embed_url}
      />
    );
  }

  return <div className={'block w-full p-5'}>Type is undefined</div>;
}

export default VideoPlayer;
