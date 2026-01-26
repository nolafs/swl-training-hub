'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface PageColorContextType {
  color: string | null;
  previousColor: string | null;
  textColor: string;
  setPageColor: (color: string | null) => void;
}

const PageColorContext = createContext<PageColorContextType | undefined>(undefined);

export function PageColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<string | null>(null);
  const [previousColor, setPreviousColor] = useState<string | null>(null);

  const setPageColor = useCallback((newColor: string | null) => {
    setPreviousColor(color);
    setColor(newColor);
  }, [color]);

  // When a page color is set, use white text; otherwise use dark text
  const textColor = useMemo(() => {
    return color ? '#ffffff' : '#111827'; // white or gray-900
  }, [color]);

  return (
    <PageColorContext.Provider value={{ color, previousColor, textColor, setPageColor }}>
      {children}
    </PageColorContext.Provider>
  );
}

export function usePageColor() {
  const context = useContext(PageColorContext);
  if (context === undefined) {
    throw new Error('usePageColor must be used within a PageColorProvider');
  }
  return context;
}
