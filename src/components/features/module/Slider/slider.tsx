"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

export function ModuleSlider({ modules }: ModuleSliderProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();

  useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current && sliderRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = sliderRef.current.scrollWidth;
        const maxScroll = contentWidth - containerWidth;
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
      {/* Slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex justify-end gap-6 py-10 pr-10 cursor-grab active:cursor-grabbing"
          animate={controls}
          drag="x"
          dragConstraints={{ left: -maxIndex * (CARD_WIDTH + GAP), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {modules.map((module, index) => {
            const moduleData: Module = {
              id: module.id,
              position: module.data.position ?? 0,
              title: module.data.title ?? "",
              description: module.data.description ?? "",
              colour: module.data.colour ?? "#000000",
            };

            return (
              <motion.div
                key={module.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="shrink-0"
              >
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

      {/* Navigation - Arrows with Number Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>

        <div className="flex gap-2">
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

        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {selectedModule && (
        <ModuleDetail
          module={selectedModule}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
