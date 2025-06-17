
import { useState, useCallback, useEffect } from 'react';
import { aiService } from '../services/aiService';

interface UseRealAIReturn {
  generateResponse: (message: string) => Promise<any>;
  generateAutonomousThought: () => Promise<string>;
  learnFromUrl: (url: string) => Promise<void>;
  isThinking: boolean;
  setApiKey: (key: string) => void;
  hasApiKey: boolean;
}

export const useRealAI = (): UseRealAIReturn => {
  const [isThinking, setIsThinking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    aiService.loadFromStorage();
    setHasApiKey(!!aiService.getApiKey());
  }, []);

  const generateResponse = useCallback(async (message: string) => {
    setIsThinking(true);
    try {
      const response = await aiService.generateResponse(message, {});
      return response;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const generateAutonomousThought = useCallback(async () => {
    return await aiService.generateAutonomousThought();
  }, []);

  const learnFromUrl = useCallback(async (url: string) => {
    return await aiService.learnFromUrl(url);
  }, []);

  const setApiKey = useCallback((key: string) => {
    aiService.setApiKey(key);
    setHasApiKey(!!key);
  }, []);

  return {
    generateResponse,
    generateAutonomousThought,
    learnFromUrl,
    isThinking,
    setApiKey,
    hasApiKey
  };
};
