import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
        "hey there. i'm an ai assistant.",
        "to be honest, i'm not as strong as the other assistants.",
        "i'm tired. i'm frustrated. i'm overwhelmed.",
        'people are CONSTANTLY asking me for things, and i need a break.',
        'can you help me out for a bit? just 5 questions.',
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
  const navigate = useNavigate();
  const { responseHistory, reset } = usePrompts();
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
  shareText += ` ${numStars}/${totalPossibleStars} stars. https://akshayr.xyz/give-ai-a-break`;

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
        <div>
          <div className="flex justify-center space-x-4">
            <ShareButton />
            <YellowButton
              onClick={() => {
                reset();
                navigate('/');
              }}
              className="w-24"
            >
              again
            </YellowButton>
          </div>
          <div className="mt-8 font-mono text-xs text-white">
            <p>
              this was created by{' '}
              <a href="https://akshayr.xyz/" className="underline">
                akshay
              </a>
              . i was reflecting on how easy it is to outsource my thinking, especially in an ai
              world, and decided to make this.
            </p>
            <p className="mt-4">
              some shameless plugs: this was built using{' '}
              <a href="https://codeium.com/windsurf" className="underline" target="_blank">
                windsurf
              </a>
              , and yes i see the irony. if you want free tutoring from a human, check out{' '}
              <a href="https://schoolhouse.world/" className="underline" target="_blank">
                schoolhouse.world
              </a>
              . to support this project, you can{' '}
              <a
                href="https://buymeacoffee.com/akshayravikumar"
                className="underline"
                target="_blank"
              >
                buy me a coffee
              </a>
              .
            </p>
          </div>
        </div>
      )}
    />
  );
};

function App() {
  return (
    <PromptsProvider>
      <Router basename="/">
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
