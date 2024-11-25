import React, { useState, useEffect } from 'react';

interface TypedTextProps {
  text: string;
  onComplete?: () => void;
  typingSpeed?: number;
}

const TypedText: React.FC<TypedTextProps> = ({ text, onComplete, typingSpeed = 25 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Reset state when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTypingDone(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (!isTypingDone) {
      setIsTypingDone(true);
      onComplete?.();
    }
  }, [currentIndex, text, typingSpeed, onComplete, isTypingDone]);

  return (
    <div className="font-mono">
      {displayedText}
      {!isTypingDone && <span className="animate-pulse">|</span>}
    </div>
  );
};

export default TypedText;
