
import { useState, useCallback, useEffect } from 'react';
import { realAIService } from '../services/realAIService';

interface UseRealAIReturn {
  generateResponse: (message: string, userId?: string) => Promise<{ text: string; emotion: string; thoughts: string[] }>;
  analyzeEmotion: (text: string) => Promise<string>;
  learnFromUrl: (url: string) => Promise<void>;
  getPersonalMemory: (userId: string) => any;
  getLearningProgress: () => any;
  isThinking: boolean;
  setHuggingFaceKey: (key: string) => void;
  hasApiKey: boolean;
}

export const useRealAI = (): UseRealAIReturn => {
  const [isThinking, setIsThinking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const setHuggingFaceKey = useCallback((key: string) => {
    // Сохраняем ключ в localStorage для демонстрации
    localStorage.setItem('huggingface_key', key);
    setHasApiKey(!!key);
    console.log('🔑 HuggingFace API key установлен');
  }, []);

  useEffect(() => {
    // Проверяем наличие сохраненного ключа
    const savedKey = localStorage.getItem('huggingface_key');
    setHasApiKey(!!savedKey);
  }, []);

  const generateResponse = useCallback(async (message: string, userId: string = 'default') => {
    setIsThinking(true);
    try {
      const response = await realAIService.generateContextualResponse(message, userId);
      // Возвращаем объект с нужными полями
      return {
        text: response,
        emotion: 'curious',
        thoughts: [`Анализирую сообщение: "${message}"`, 'Формирую персональный ответ', 'Учитываю контекст диалога']
      };
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
    isThinking,
    setHuggingFaceKey,
    hasApiKey
  };
};
