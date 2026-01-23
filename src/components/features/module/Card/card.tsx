"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ModuleCard({
  moduleNumber,
  title,
  description,
  color,
  isSelected = false,
  onClick,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-[375px] h-[375px] bg-neutral-100 cursor-pointer overflow-hidden flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        scale: isSelected ? 1.15 : 1,
        boxShadow: isSelected
          ? "0 25px 50px rgba(0, 0, 0, 0.3)"
          : isHovered
            ? "0 10px 40px rgba(0, 0, 0, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: isSelected ? 1.15 : 1.05 }}
    >
      <div className="flex-1 p-4 flex flex-col relative z-10">
        <span className="text-2xl font-bold text-gray-800">{moduleNumber}</span>
        {isHovered && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          </motion.div>
        )}
      </div>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
        animate={{
          height: isSelected ? "100%" : isHovered ? 12 : 4,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}
