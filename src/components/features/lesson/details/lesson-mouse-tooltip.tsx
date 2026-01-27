'use client';
import { ReactNode, useCallback, useRef, useState, MouseEvent } from 'react';

interface MouseTooltipProps {
  children: ReactNode;
  label: string;
  delay?: number;
}

export function LessonMouseTooltip({ children, label, delay = 300 }: MouseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible && (
        <div
          className="pointer-events-none fixed z-100 rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
          style={{
            left: position.x + 12,
            top: position.y + 12,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}