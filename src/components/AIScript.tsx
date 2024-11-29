import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TypedText from './TypedText';

interface AIScriptProps {
  footer?: () => React.ReactNode;
  script: string[];
}

const AIScript: React.FC<AIScriptProps> = ({ footer, script }) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-black p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-3xl space-y-8 text-center">
        <div className="text-md whitespace-pre-line font-mono leading-loose text-yellow-400 md:text-xl">
          <TypedText texts={script} onComplete={handleTypingComplete} typingSpeed={15} />
        </div>
        {isTypingComplete && footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            {footer()}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIScript;
