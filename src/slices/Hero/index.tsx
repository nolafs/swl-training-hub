import { FC } from "react";
import { Content } from "@prismicio/client";
import {PrismicRichText, SliceComponentProps} from "@prismicio/react";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  return (
    <header
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
        {slice.variation === "default" && (<div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">{ slice.primary.title }</h2>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                        <PrismicRichText field={slice.primary.subtitle} />
                    </p>
                </div>
            </div>
        </div>
        )}
    </header>
  );
};

export default Hero;
