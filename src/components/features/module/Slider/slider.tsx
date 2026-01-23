"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { ModuleCard } from "../Card";
import { ModuleDetail } from "../Detail";
import { ModuleDocument } from "../../../../../prismicio-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Module {
  id: string;
  position: number;
  title: string;
  description: string;
  colour: string;
}

interface ModuleSliderProps {
  modules: ModuleDocument[];
}

const CARD_WIDTH = 375;
const GAP = 24;
const PADDING = 40;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function ModuleSlider({ modules }: ModuleSliderProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current && sliderRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = sliderRef.current.scrollWidth;
        const maxScroll = contentWidth - containerWidth + PADDING;
        const totalSlides = Math.ceil(maxScroll / (CARD_WIDTH + GAP));
        setMaxIndex(Math.max(0, totalSlides));
      }
    };

    updateMaxIndex();
    window.addEventListener("resize", updateMaxIndex);
    return () => window.removeEventListener("resize", updateMaxIndex);
  }, [modules.length]);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleClose = () => {
    setSelectedModule(null);
  };

  const slideTo = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    const targetX = -newIndex * (CARD_WIDTH + GAP);
    controls.start({ x: targetX, transition: { type: "spring", stiffness: 300, damping: 30 } });
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
    <div className="w-full relative" ref={containerRef}>
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex gap-6 p-10 cursor-grab active:cursor-grabbing"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxIndex * (CARD_WIDTH + GAP), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          onAnimationComplete={() => {
            // Sync motion value with current position
            x.set(-currentIndex * (CARD_WIDTH + GAP));
          }}
        >
          {modules.map((module) => {
            const moduleData: Module = {
              id: module.id,
              position: module.data.position ?? 0,
              title: module.data.title ?? "",
              description: module.data.description ?? "",
              colour: module.data.colour ?? "#000000",
            };

            return (
              <motion.div key={module.id} variants={itemVariants} className="shrink-0">
                <ModuleCard
                  moduleNumber={moduleData.position ?? 0}
                  title={moduleData.title ?? ""}
                  description={moduleData.description ?? ""}
                  color={moduleData.colour ?? "#000000"}
                  isSelected={selectedModule?.id === module.id}
                  onClick={() => handleModuleClick(moduleData)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Number Navigation */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => slideTo(index)}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                currentIndex === index
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedModule && (
        <ModuleDetail
          module={selectedModule}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
