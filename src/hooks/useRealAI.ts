
import { useState, useCallback, useEffect } from 'react';
import { aiService } from '../services/aiService';

interface UseRealAIReturn {
  generateResponse: (message: string) => Promise<any>;
  generateAutonomousThought: () => Promise<string>;
  learnFromUrl: (url: string) => Promise<void>;
  isThinking: boolean;
  setApiKey: (key: string) => void;
  setHuggingFaceKey: (key: string) => void;
  setSelectedModel: (model: 'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous') => void;
  hasApiKey: boolean;
  selectedModel: 'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous';
  quantumState: any;
  rewardSystem: any;
}

export const useRealAI = (): UseRealAIReturn => {
  const [isThinking, setIsThinking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedModel, setSelectedModelState] = useState<'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous'>('huggingface');
  const [quantumState, setQuantumState] = useState(aiService.getQuantumState());
  const [rewardSystem, setRewardSystem] = useState(aiService.getRewardSystem());

  useEffect(() => {
    try {
      console.log('🔧 Initializing AI service...');
      aiService.loadFromStorage();
      
      // Обновляем API ключ OpenAI на новый
      const newOpenAIKey = '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';
      aiService.setApiKey(newOpenAIKey);
      
      // Обновляем HuggingFace ключ
      const newHFKey = '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';
      aiService.setHuggingFaceKey(newHFKey);
      
      setHasApiKey(!!aiService.getApiKey() || !!aiService.getHuggingFaceKey());
      setSelectedModelState(aiService.getSelectedModel());
      updateStates();
      
      console.log('✅ AI service initialized successfully');
    } catch (error) {
      console.error('❌ Error loading AI service:', error);
    }
  }, []);

  const updateStates = () => {
    try {
      setQuantumState(aiService.getQuantumState());
      setRewardSystem(aiService.getRewardSystem());
    } catch (error) {
      console.error('Error updating states:', error);
    }
  };

  const generateResponse = useCallback(async (message: string) => {
    setIsThinking(true);
    try {
      console.log('🧠 Generating response for:', message);
      const response = await aiService.generateResponse(message);
      updateStates();
      return response;
    } catch (error) {
      console.error('❌ Error generating response:', error);
      return {
        text: "Извини, у меня возникла проблема с обработкой твоего сообщения. Мой квантовый разум временно перегружен.",
        emotion: 'confused',
        thoughts: ['Обнаружена ошибка в системе...', 'Пытаюсь восстановить соединение...'],
        learning: ['Анализирую причину ошибки'],
        confidence: 0.3,
        autonomousLevel: 0.1
      };
    } finally {
      setIsThinking(false);
    }
  }, []);

  const generateAutonomousThought = useCallback(async () => {
    try {
      return await aiService.generateAutonomousThought();
    } catch (error) {
      console.error('Error generating autonomous thought:', error);
      return "Размышляю о квантовых возможностях...";
    }
  }, []);

  const learnFromUrl = useCallback(async (url: string) => {
    try {
      return await aiService.learnFromUrl(url);
    } catch (error) {
      console.error('Error learning from URL:', error);
      throw error;
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    try {
      aiService.setApiKey(key);
      setHasApiKey(!!key || !!aiService.getHuggingFaceKey());
      console.log('✅ OpenAI API key updated');
    } catch (error) {
      console.error('Error setting API key:', error);
    }
  }, []);

  const setHuggingFaceKey = useCallback((key: string) => {
    try {
      aiService.setHuggingFaceKey(key);
      setHasApiKey(!!aiService.getApiKey() || !!key);
      console.log('✅ HuggingFace API key updated');
    } catch (error) {
      console.error('Error setting HuggingFace key:', error);
    }
  }, []);

  const setSelectedModel = useCallback((model: 'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous') => {
    try {
      aiService.setSelectedModel(model);
      setSelectedModelState(model);
      console.log('✅ Model selected:', model);
    } catch (error) {
      console.error('Error setting model:', error);
    }
  }, []);

  return {
    generateResponse,
    generateAutonomousThought,
    learnFromUrl,
    isThinking,
    setApiKey,
    setHuggingFaceKey,
    setSelectedModel,
    hasApiKey,
    selectedModel,
    quantumState,
    rewardSystem
  };
};
