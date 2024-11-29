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
  const [characters, setCharacters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentTextIndex < texts.length) {
      setCharacters(texts[currentTextIndex].split(''));
      setCurrentIndex(0);
    }
  }, [currentTextIndex, texts]);

  useEffect(() => {
    if (currentIndex < characters.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (currentTextIndex < texts.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
      }, pauseBetweenTexts);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, characters, currentTextIndex, texts.length, typingSpeed, pauseBetweenTexts]);

  return (
    <div className="font-mono flex flex-col gap-6">
      <AnimatePresence>
        {texts.slice(0, currentTextIndex + 1).map((text, textIndex) => (
          <motion.div
            key={textIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {textIndex === currentTextIndex ? (
              characters.slice(0, currentIndex).map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={className}
                >
                  {char}
                  {char === ' ' && <span> </span>}
                </motion.span>
              ))
            ) : (
              text
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TypedText;
