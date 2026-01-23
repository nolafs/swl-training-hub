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
        {slice.variation === "default" && (<div className={''}>
            <h1>{ slice.primary.title }</h1>
            <div><PrismicRichText field={slice.primary.subtitle} /></div>
            </div>
        )}
    </header>
  );
};

export default Hero;
