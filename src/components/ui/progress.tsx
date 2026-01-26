"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// Convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  color?: string;
  trackOpacity?: number;
}

function Progress({
  className,
  color = '#000',
  trackOpacity = 0.2,
  value,
  ...props
}: ProgressProps) {
  const trackColor = hexToRgba(color, trackOpacity);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      style={{ backgroundColor: trackColor }}
      className={cn('relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all rounded-full"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: color,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress }
