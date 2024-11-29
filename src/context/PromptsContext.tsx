import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PromptsContextType {
  prompts: string[];
  currentPromptIndex: number;
  setCurrentPromptIndex: (index: number) => void;
  responseHistory: Array<{
    prompt: string;
    userResponse: string;
    aiResponse: string;
    stars: number;
  }>;
  addToHistory: (prompt: string, userResponse: string, aiResponse: string, stars: number) => void;
  reset: () => void;
}

interface PromptsProviderProps {
  children: ReactNode;
}

const PromptsContext = createContext<PromptsContextType>({
  prompts: [],
  currentPromptIndex: 0,
  setCurrentPromptIndex: () => {},
  responseHistory: [],
  addToHistory: () => {},
  reset: () => {},
});

export const PromptsProvider: React.FC<PromptsProviderProps> = ({ children }) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responseHistory, setResponseHistory] = useState<
    Array<{
      prompt: string;
      userResponse: string;
      aiResponse: string;
      stars: number;
    }>
  >([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/prompts`)
      .then(response => response.json())
      .then(data => setPrompts(data));
  }, []);

  const addToHistory = (
    prompt: string,
    userResponse: string,
    aiResponse: string,
    stars: number
  ) => {
    setResponseHistory(prev => [...prev, { prompt, userResponse, aiResponse, stars }]);
  };

  const reset = () => {
    setResponseHistory([]);
    setCurrentPromptIndex(0);
  };

  return (
    <PromptsContext.Provider
      value={{
        prompts,
        currentPromptIndex,
        setCurrentPromptIndex,
        responseHistory,
        addToHistory,
        reset,
      }}
    >
      {children}
    </PromptsContext.Provider>
  );
};

export function usePrompts() {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return context;
}
