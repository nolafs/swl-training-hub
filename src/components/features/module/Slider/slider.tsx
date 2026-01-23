"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ModuleCard } from "../Card";
import { ModuleDetail } from "../Detail";
import { ModuleDocument } from "../../../../../prismicio-types";

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
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleClose = () => {
    setSelectedModule(null);
  };

  return (
    <div className="w-full relative overflow-hidden" ref={constraintsRef}>
      <motion.div
        className="flex gap-6 p-10 cursor-grab active:cursor-grabbing [&>*]:shrink-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
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
            <motion.div key={module.id} variants={itemVariants}>
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

      {selectedModule && (
        <ModuleDetail
          module={selectedModule}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
