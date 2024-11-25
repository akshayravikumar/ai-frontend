import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import TypedText from './TypedText';
import YellowButton from './YellowButton';
import { usePrompts } from '../context/PromptsContext';
import './ResponseScreen.css';

interface Variation {
  sender: string;
  avatarColor: string;
  message: string;
}

interface Prompt {
  slug: string;
  description: string;
  variation: Variation;
  variationIndex: number;
}

const PromptResponseScreen: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { prompts, currentPromptIndex, setCurrentPromptIndex, addToHistory } = usePrompts();

  // Prompt state
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Response state
  const [showMessage, setShowMessage] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [isResponseMode, setIsResponseMode] = useState(false);
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/prompt/${slug}`);
        const data = await response.json();
        setPrompt(data);
      } catch (error) {
        console.error('Error fetching prompt:', error);
      }
    };

    fetchPrompt();
  }, [slug]);

  const handleSubmit = async () => {
    if (!userResponse.trim()) return;

    try {
      setIsResponseMode(true);
      setShowLoading(true);

      const apiResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/submit/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: userResponse,
          variationIndex: prompt?.variationIndex,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await apiResponse.json();
      console.log(data);
      setMessage(data.message);
      setStars(data.stars);
      setUserResponse('');
      setShowMessage(true);
      addToHistory(prompts[currentPromptIndex], userResponse, data.message, data.stars);

      // Show loading for at least 2 seconds
      setTimeout(() => {
        setShowLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleNext = () => {
    const currentIndex = prompts.findIndex(p => p === slug);
    const nextPrompt = currentIndex < prompts.length - 1 ? prompts[currentIndex + 1] : null;

    if (nextPrompt) {
      navigate(`/prompt/${nextPrompt}`);
      setCurrentPromptIndex(currentIndex + 1);
    } else {
      navigate('/finish');
    }

    // Reset states
    setIsResponseMode(false);
    setShowMessage(false);
    setShowLoading(false);
    setUserResponse('');
  };

  if (!prompt) return null;

  return (
    <div className="min-h-screen bg-black p-8 text-yellow-400">
      <AnimatePresence mode="wait">
        {!isResponseMode && (
          <div className="min-h-screen bg-black p-8 text-yellow-400">
            <div className="mx-auto max-w-2xl space-y-8">
              {/* Message Bubble */}
              <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
                <div className="mb-4 flex items-center space-x-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: prompt.variation.avatarColor }}
                  >
                    {prompt.variation.sender[0]}
                  </div>
                  <div className="font-medium text-white">{prompt.variation.sender}</div>
                </div>
                <p className="text-white">{prompt.variation.message}</p>
              </div>

              {/* AI Description */}
              <div className="text-lg">
                <TypedText text={prompt.description} onComplete={() => setIsTypingDone(true)} />
              </div>

              {/* Response Input */}
              {isTypingDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <textarea
                    value={userResponse}
                    onChange={e => setUserResponse(e.target.value)}
                    className="h-32 w-full rounded-lg bg-gray-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Type your response here..."
                  />
                  <div className="flex justify-end">
                    <YellowButton onClick={handleSubmit}>submit</YellowButton>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {isResponseMode && (
          <div className="response-screen">
            <AnimatePresence mode="wait">
              {showLoading && !showMessage && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="loading-message"
                >
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="font-mono text-lg"
                  >
                    reading your response...
                  </motion.span>
                </motion.div>
              )}
              {showMessage && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={index < stars ? 'star-filled' : 'star-empty'}>
                        <FaStar />
                      </span>
                    ))}
                  </div>
                  <div className="message">
                    <TypedText text={message} />
                  </div>
                  <YellowButton onClick={handleNext}>
                    {prompts.findIndex(p => p === slug) < prompts.length - 1 ? 'next' : 'finish'}
                  </YellowButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptResponseScreen;
