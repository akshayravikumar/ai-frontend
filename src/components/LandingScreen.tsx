import React from 'react';
import { motion } from 'framer-motion';
import TypedText from './TypedText';
import YellowButton from './YellowButton';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-black p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1>
          <TypedText texts={['help out an ai']} typingSpeed={30} pauseBetweenTexts={0} className="text-4xl" />
        </h1>
        <YellowButton onClick={onStart} initiallyHidden={true} showDelay={1} className="mx-auto">
          start
        </YellowButton>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
