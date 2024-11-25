import React from 'react';
import { motion } from 'framer-motion';

interface YellowButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  initiallyHidden?: boolean;
  showDelay?: number;
}

const YellowButton: React.FC<YellowButtonProps> = ({
  onClick,
  children,
  className = '',
  initiallyHidden = false,
  showDelay = 0,
}) => {
  return (
    <motion.button
      className={`w-full min-w-40 rounded-lg border-2 border-yellow-400 px-8 py-3 font-mono text-yellow-400 transition-colors hover:bg-yellow-400/10 md:w-auto ${className}`}
      onClick={onClick}
      initial={{ opacity: initiallyHidden ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ delay: showDelay, duration: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default YellowButton;
