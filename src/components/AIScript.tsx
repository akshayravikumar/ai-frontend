import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { motion } from 'framer-motion';
import YellowButton from './YellowButton';

interface AIScriptProps {
  footer?: () => React.ReactNode;
  script: string[];
}

const AIScript: React.FC<AIScriptProps> = ({ footer, script }) => {
  const el = useRef(null);
  const typed = useRef<Typed | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const options = {
      strings: [script.join('\n\n')],
      typeSpeed: 15,
      backSpeed: 0,
      showCursor: true,
      cursorChar: '|',
      startDelay: 500,
      smartBackspace: false,
      backDelay: 1000,
      onComplete: () => {
        if (typed.current) {
          typed.current.cursor.style.display = 'none';
        }
        setIsTypingComplete(true);
      },
    };

    if (el.current) {
      typed.current = new Typed(el.current, options);

      // Fix cursor positioning
      if (typed.current.cursor) {
        typed.current.cursor.style.display = 'inline';
      }
    }

    return () => {
      typed.current?.destroy();
    };
  }, [script]);

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-black p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div>
          <span
            ref={el}
            className="whitespace-pre-line font-mono text-lg leading-loose text-yellow-400 md:text-xl"
          />
        </div>
        {isTypingComplete && footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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
