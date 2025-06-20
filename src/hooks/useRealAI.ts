
import { useState, useCallback, useEffect } from 'react';
import { realAIService } from '../services/realAIService';

interface UseRealAIReturn {
  generateResponse: (message: string, userId?: string) => Promise<string>;
  analyzeEmotion: (text: string) => Promise<string>;
  learnFromUrl: (url: string) => Promise<void>;
  getPersonalMemory: (userId: string) => any;
  getLearningProgress: () => any;
  isThinking: boolean;
}

export const useRealAI = (): UseRealAIReturn => {
  const [isThinking, setIsThinking] = useState(false);

  const generateResponse = useCallback(async (message: string, userId: string = 'default') => {
    setIsThinking(true);
    try {
      const response = await realAIService.generateContextualResponse(message, userId);
      return response;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const analyzeEmotion = useCallback(async (text: string) => {
    return await realAIService.analyzeEmotion(text);
  }, []);

  const learnFromUrl = useCallback(async (url: string) => {
    return await realAIService.webScrapeAndLearn(url);
  }, []);

  const getPersonalMemory = useCallback((userId: string) => {
    return realAIService.getPersonalMemory(userId);
  }, []);

  const getLearningProgress = useCallback(() => {
    return realAIService.getLearningProgress();
  }, []);

  return {
    generateResponse,
    analyzeEmotion,
    learnFromUrl,
    getPersonalMemory,
    getLearningProgress,
    isThinking
  };
};
