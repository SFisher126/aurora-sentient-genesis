
import { useCallback } from 'react';
import { useRealAI } from './useRealAI';

export const useChat = () => {
  const { generateResponse, isThinking } = useRealAI();

  const generateChatResponse = useCallback(async (message: string, temperature: number = 0.7) => {
    try {
      const response = await generateResponse(message);
      return {
        text: response.text || response,
        emotion: response.emotion || 'neutral',
        thoughts: response.thoughts || [],
        learning: response.learning || [],
        confidence: response.confidence || 0.8
      };
    } catch (error) {
      console.error('Error in useChat:', error);
      return {
        text: "Извини, у меня возникла проблема с обработкой твоего сообщения.",
        emotion: 'confused',
        thoughts: ['Обнаружена ошибка в системе...'],
        learning: ['Анализирую причину ошибки'],
        confidence: 0.3
      };
    }
  }, [generateResponse]);

  return {
    generateResponse: generateChatResponse,
    isThinking
  };
};
