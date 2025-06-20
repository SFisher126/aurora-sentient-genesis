
import { useState, useCallback } from 'react';
import { quantumAIService } from '../services/quantumAIService';
import { apiKeyService } from '../services/apiKeyService';

interface UseQuantumAIReturn {
  generateResponse: (message: string, userId?: string) => Promise<{ 
    text: string; 
    emotion: string; 
    thoughtProcess: string[];
    learning: string[];
    modelUsed: string;
    confidence: number;
  }>;
  isThinking: boolean;
  context: {
    conversationHistory: any[];
    learningProgress: any;
  };
  setOpenAIKey: (key: string) => void;
  setRussianAPIKey: (key: string) => void;
  hasActiveAPI: boolean;
}

export const useQuantumAI = (): UseQuantumAIReturn => {
  const [isThinking, setIsThinking] = useState(false);

  const generateResponse = useCallback(async (message: string, userId: string = 'default') => {
    setIsThinking(true);
    try {
      console.log('🧠 Генерирую ответ через квантовый ИИ...');
      const response = await quantumAIService.generateResponse(message, userId);
      
      console.log(`💭 Модель: ${response.modelUsed}, Уверенность: ${response.confidence}`);
      console.log(`🎭 Эмоция: ${response.emotion}`);
      console.log(`🧠 Мыслей: ${response.thoughts.length}`);
      console.log(`📚 Обучение: ${response.learning.length} новых концепций`);
      
      return {
        text: response.text,
        emotion: response.emotion,
        thoughtProcess: response.thoughts.map(t => t.content),
        learning: response.learning,
        modelUsed: response.modelUsed,
        confidence: response.confidence
      };
    } finally {
      setIsThinking(false);
    }
  }, []);

  const setOpenAIKey = useCallback((key: string) => {
    apiKeyService.setOpenAIKey(key);
    console.log('🔑 OpenAI ключ установлен для настоящего мышления');
  }, []);

  const setRussianAPIKey = useCallback((key: string) => {
    apiKeyService.setRussianAPIKey(key);
    console.log('🔑 Русский API ключ установлен');
  }, []);

  const hasActiveAPI = apiKeyService.hasAnyKey();

  const context = {
    conversationHistory: [],
    learningProgress: quantumAIService.getLearningStats()
  };

  return {
    generateResponse,
    isThinking,
    context,
    setOpenAIKey,
    setRussianAPIKey,
    hasActiveAPI
  };
};
