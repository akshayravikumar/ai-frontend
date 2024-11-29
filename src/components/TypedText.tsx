import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypedTextProps {
  texts: string[];
  onComplete?: () => void;
  typingSpeed?: number;
  pauseBetweenTexts?: number;
  className?: string;
}

const TypedText: React.FC<TypedTextProps> = ({
  texts,
  onComplete,
  typingSpeed = 20,
  pauseBetweenTexts = 800,
  className = '',
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState('');

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (displayedChars.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedChars(currentText.slice(0, displayedChars.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    if (currentTextIndex < texts.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
        setDisplayedChars('');
      }, pauseBetweenTexts);
      return () => clearTimeout(timer);
    }

    if (currentTextIndex === texts.length - 1 && currentTextIndex === texts.length - 1) {
      onComplete?.();
    }
  }, [currentTextIndex, displayedChars, texts, typingSpeed, pauseBetweenTexts, onComplete]);

  return (
    <div className="font-mono flex flex-col gap-6">
      <AnimatePresence>
        {texts.slice(0, currentTextIndex + 1).map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={className}
          >
            {index === currentTextIndex ? displayedChars : text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TypedText;
