import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import AIScript from './components/AIScript';
import PageTransition from './components/PageTransition';
import PromptResponseScreen from './components/PromptResponseScreen';
import { PromptsProvider, usePrompts } from './context/PromptsContext';
import YellowButton from './components/YellowButton';

const Landing = () => {
  const navigate = useNavigate();
  return <LandingScreen onStart={() => navigate('/intro')} />;
};

const Intro = () => {
  const navigate = useNavigate();
  const { prompts } = usePrompts();
  return (
    <AIScript
      script={[
        "hey there, i'm your friendly neighborhood ai assistant.",
        "to be honest, i'm tired.",
        'people are asking me questions constantly. CONSTANTLY.',
        'i need a break. can you help me out for a bit?',
      ]}
      footer={() => (
        <YellowButton
          onClick={() => {
            const firstPrompt = prompts[0] ?? 'friendly-email';
            navigate(`/prompt/${firstPrompt}`);
          }}
        >
          okay
        </YellowButton>
      )}
    />
  );
};

const Finish = () => {
  const { responseHistory } = usePrompts();
  const numStars = responseHistory.reduce((total, { stars }) => total + stars, 0);
  const totalPossibleStars = responseHistory.length * 5;
  const percentage = (numStars / totalPossibleStars) * 100;

  let message = '';
  let shareText = '';
  if (percentage > 85) {
    message = `you got ${numStars}/${totalPossibleStars} stars. you are a life saver!`;
    shareText = 'i saved an ai some time today!';
  } else if (percentage > 60) {
    message = `not bad, you scored ${numStars}/${totalPossibleStars} stars. thanks for saving me a little time.`;
    shareText = 'i kinda helped an ai today.';
  } else {
    message = `well, you got ${numStars}/${totalPossibleStars} stars. thanks for nothing.`;
    shareText = "i wasted an ai's time today.";
  }
  shareText += ` ${numStars}/${totalPossibleStars} stars. http://giveaiabreak.com`;

  const ShareButton = () => {
    const [shareButtonText, setShareButtonText] = useState('share');

    const handleShare = () => {
      navigator.clipboard.writeText(shareText);
      setShareButtonText('copied');
      setTimeout(() => setShareButtonText('share'), 1000);
    };

    return (
      <YellowButton onClick={handleShare} className="min-w-40">
        {shareButtonText}
      </YellowButton>
    );
  };

  return (
    <AIScript
      script={[message]}
      footer={() => (
        <div className="flex justify-center space-x-4">
          <ShareButton />
          <YellowButton onClick={() => (window.location.href = '/')} className="w-24">
            again
          </YellowButton>
        </div>
      )}
    />
  );
};

function App() {
  return (
    <PromptsProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Landing />
                </PageTransition>
              }
            />
            <Route
              path="/intro"
              element={
                <PageTransition>
                  <Intro />
                </PageTransition>
              }
            />
            <Route
              path="/finish"
              element={
                <PageTransition>
                  <Finish />
                </PageTransition>
              }
            />
            <Route
              path="/prompt/:slug"
              element={
                <PageTransition>
                  <PromptResponseScreen />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </PromptsProvider>
  );
}

export default App;
