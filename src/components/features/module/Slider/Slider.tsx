"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ModuleCard } from "../Card";
import { ModuleDetail } from "../Detail";
import styles from "./Slider.module.css";

interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  lessons?: { id: string; title: string }[];
  progress?: number;
}

interface ModuleSliderProps {
  modules: Module[];
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
    <div className={styles.container} ref={constraintsRef}>
      <motion.div
        className={styles.slider}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      >
        {modules.map((module) => (
          <motion.div key={module.id} variants={itemVariants}>
            <ModuleCard
              moduleNumber={module.moduleNumber}
              title={module.title}
              description={module.description}
              color={module.color}
              isSelected={selectedModule?.id === module.id}
              onClick={() => handleModuleClick(module)}
            />
          </motion.div>
        ))}
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