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
      className="container mx-auto px-4 py-16"
    >
      {slice.variation === 'default' && (
        <div className="prose prose-lg lg:prose-xl mx-auto text-gray-500">
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
