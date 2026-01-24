"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

interface ModuleCardProps {
  moduleNumber: number;
  title: string;
  description: string;
  color: string;
  progress?: number;
  href: string;
}

export function ModuleCard({
  moduleNumber,
  title,
  description,
  color,
  progress = 0,
  href,
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ zIndex: isHovered ? 50 : 1 }}
    >
      {/* Progress bar - slides out from left */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[300px] w-16 flex flex-col items-center justify-center gap-2"
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? -80 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="text-xs text-gray-500 font-medium">{progress}%</div>
        <div className="h-48 w-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="w-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
        <div className="text-xs text-gray-400">Progress</div>
      </motion.div>

      {/* Start button - slides out from right */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        initial={{ x: 0, opacity: 0 }}
        animate={{
          x: isHovered ? 80 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <Link
          href={href}
          className="flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
        >
          <Play className="w-6 h-6 ml-1" fill="white" />
        </Link>
      </motion.div>

      {/* Main Card */}
      <Link href={href}>
        <motion.div
          className="relative w-[375px] h-[375px] bg-white border border-black/20 cursor-pointer overflow-hidden flex flex-col"
          animate={{
            boxShadow: isHovered
              ? "0 20px 50px rgba(0, 0, 0, 0.2)"
              : "0 2px 8px rgba(0, 0, 0, 0.08)",
            zIndex: isHovered ? 50 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex-1 p-4 flex flex-col relative z-10">
            <div className="grid grid-cols-2 justify-center items-center gap-2">
              <motion.div
                className="text-5xl font-extralight"
                animate={{ color: isHovered ? "#ffffff" : color }}
                transition={{ duration: 0.3 }}
              >
                {moduleNumber > 9 ? moduleNumber : "0" + moduleNumber}
              </motion.div>
              <motion.div
                className="text-2xl font-light text-right"
                animate={{ color: isHovered ? "#ffffff" : color }}
                transition={{ duration: 0.3 }}
              >
                Module
              </motion.div>
            </div>
            {isHovered && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-white/80 leading-relaxed">{description}</p>
              </motion.div>
            )}
          </div>
          <motion.div
            className="absolute bottom-0 left-0 w-full h-4"
            style={{ backgroundColor: color }}
            animate={{
              height: isHovered ? "100%" : 16,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
