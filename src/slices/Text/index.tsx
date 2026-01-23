import { FC } from 'react';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

/**
 * Props for `Text`.
 */
export type TextProps = SliceComponentProps<Content.TextSlice>;

/**
 * Component for "Text" Slices.
 */
const Text: FC<TextProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {slice.variation === 'default' && (
        <div className="prose prose-lg max-w-none">
          <PrismicRichText field={slice.primary.body} />
        </div>
      )}

      {slice.variation === 'heading' && (
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {slice.primary.title}
        </h2>
      )}
    </section>
  );
};

export default Text;
