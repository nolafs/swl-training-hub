'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePageColor } from './context';

export function PageColorTransition() {
  const { color } = usePageColor();

  return (
    <>
      {/* Animated color layer - uses color as key to trigger animation on change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={color || 'transparent'}
          className="fixed inset-0 -z-20 origin-bottom"
          style={{ backgroundColor: color || 'transparent' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            scaleY: {
              type: 'spring',
              stiffness: 100,
              damping: 20,
              duration: 0.6,
            },
            opacity: {
              duration: 0.2,
            },
          }}
        />
      </AnimatePresence>
    </>
  );
}
