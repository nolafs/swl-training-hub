'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { ModuleCard } from '../card';
import { ModuleDocument } from '../../../../../prismicio-types';
import { SliderNavigation } from '@/components/ui/SliderNavigation';
import { CourseProgress } from '@/components/features/module/progress/progress-course';

interface ModuleSliderProps {
  modules: ModuleDocument[];
}

const DEFAULT_CARD_WIDTH = 391;
const GAP = 24;
const MOBILE_BREAKPOINT = 430; // Below this width, show single slide

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

export function ModuleSlider({ modules }: ModuleSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(DEFAULT_CARD_WIDTH);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();

  // Handle resize and calculate card dimensions
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current || !sliderRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const mobile = containerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      // Calculate card width based on container
      let newCardWidth: number;
      if (mobile) {
        // Single slide mode: card takes full width minus padding
        newCardWidth = containerWidth - 32; // 16px padding on each side
      } else {
        // Default card width, but cap at container width if needed
        newCardWidth = Math.min(DEFAULT_CARD_WIDTH, containerWidth - GAP - 16);
      }
      setCardWidth(newCardWidth);

      // Calculate max index
      const contentWidth = modules.length * (newCardWidth + GAP);
      const maxScroll = contentWidth - containerWidth;
      const totalSlides = Math.ceil(maxScroll / (newCardWidth + GAP));
      setMaxIndex(Math.max(0, totalSlides));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [modules.length]);

  const slideTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    const targetX = -newIndex * (cardWidth + GAP);
    controls.start({ x: targetX, transition: { type: 'spring', stiffness: 300, damping: 30 } });
  };

  const handlePrev = () => {
    slideTo(currentIndex - 1);
  };

  const handleNext = () => {
    slideTo(currentIndex + 1);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      slideTo(currentIndex + 1);
    } else if (offset > threshold || velocity > 500) {
      slideTo(currentIndex - 1);
    } else {
      slideTo(currentIndex);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex cursor-grab gap-6 p-5 md:p-20 md:pl-36 active:cursor-grabbing"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -maxIndex * (cardWidth + GAP), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="shrink-0"
            >
              <ModuleCard
                moduleId={module.id}
                moduleNumber={module.data.position ?? 0}
                title={module.data.title ?? ''}
                description={module.data.description ?? ''}
                color={module.data.colour ?? '#000000'}
                href={`/module/${module.uid}`}
                cardDimension={cardWidth}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-x-6 px-5 md:flex-row">
        <div className={'w-full md:w-7/12'}>
          <div className={'gap-10 flex w-full items-center justify-between'}>
            <div className={'opacity-20 [text-orientation:mixed] [writing-mode:sideways-lr]'}>
              Modules
            </div>
            <div className={'w-full justify-between'}>
              <CourseProgress />
            </div>
            <div className={'opacity-20 [text-orientation:mixed] [writing-mode:sideways-lr]'}>
              Completed
            </div>
          </div>
        </div>
        <div className={'w-full md:w-5/12'}>
          <SliderNavigation
            color={'#000'}
            currentIndex={currentIndex}
            maxIndex={maxIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onSlide={slideTo}
          />
        </div>
      </div>
    </div>
  );
}
