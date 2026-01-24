'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PageColorContextType {
  color: string | null;
  previousColor: string | null;
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

  return (
    <PageColorContext.Provider value={{ color, previousColor, setPageColor }}>
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
