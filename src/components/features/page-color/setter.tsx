'use client';

import { useEffect } from 'react';
import { usePageColor } from './context';

interface PageColorSetterProps {
  color: string | null;
}

export function PageColorSetter({ color }: PageColorSetterProps) {
  const { setPageColor } = usePageColor();

  useEffect(() => {
    setPageColor(color);

    return () => {
      // Don't clear on unmount - let the next page set its color
    };
  }, [color, setPageColor]);

  return null;
}
