"use client";

import { useState } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { ModuleDetail } from "@/components/ModuleDetail";
import styles from "./ModuleSlider.module.css";

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

export function ModuleSlider({ modules }: ModuleSliderProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  const handleClose = () => {
    setSelectedModule(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            moduleNumber={module.moduleNumber}
            title={module.title}
            description={module.description}
            color={module.color}
            onClick={() => handleModuleClick(module)}
          />
        ))}
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