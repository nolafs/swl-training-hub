import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import {PrismicNextImage} from "@prismicio/next";
import {DownloadDialog} from "@/components/features/downloads/download-dialog";

/**
 * Props for `IconTextHighlight`.
 */
export type IconTextHighlightProps = SliceComponentProps<Content.IconTextHighlightSlice>;

/**
 * Component for "IconTextHighlight" Slices.
 */
const IconTextHighlight: FC<IconTextHighlightProps> = ({ slice }) => {


  if(slice.variation === 'withDownloads') {
    return (
      <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}
               className="icon-text-highlight-default">
        <div className={'mx-auto px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8'}>
          <div className={'flex gap-4 w-full max-w-full lg:max-w-1/2'}>
            <div><PrismicNextImage field={slice.primary.icon} fallbackAlt=""/></div>
            <h2 className="w-full text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{slice.primary.text}</h2>
          </div>
          <div className="flex items-center justify-center gap-x-6 lg:mt-0 lg:shrink-0 px-10 py-10">
            <DownloadDialog />
          </div>
        </div>
      </section>)
  }



  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className={'mx-auto px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8'}>
          <div className={'flex gap-4'}>
            <div><PrismicNextImage field={slice.primary.icon} fallbackAlt=""/></div>
            <h2 className="max-w-1/2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">{slice.primary.text}</h2>
          </div>
      </div>
    </section>
  )
};

export default IconTextHighlight;
