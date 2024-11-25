import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync';
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, mode = 'wait' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
