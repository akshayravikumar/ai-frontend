import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Typed from 'typed.js';
import YellowButton from './YellowButton';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const el = useRef(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    const options = {
      strings: ['give ai a break'],
      typeSpeed: 30,
      showCursor: true,
      cursorChar: '|',
      startDelay: 400,
      onComplete: () => {
        if (typed.current) {
          typed.current.cursor.style.display = 'none';
        }
      },
    };

    if (el.current) {
      typed.current = new Typed(el.current, options);
    }

    return () => {
      typed.current?.destroy();
    };
  }, []);

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-black p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <motion.h1
          className="font-mono text-4xl font-bold lowercase text-yellow-400 md:text-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <span ref={el} />
        </motion.h1>

        <motion.p
          className="font-mono text-lg lowercase text-yellow-400/80 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
        >
          your assistant needs a vacation.
        </motion.p>

        <YellowButton onClick={onStart} initiallyHidden={true} showDelay={2.8} className="mx-auto">
          start
        </YellowButton>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
