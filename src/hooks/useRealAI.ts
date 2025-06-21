
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
  const [selectedModel, setSelectedModelState] = useState<'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous'>('autonomous');
  const [quantumState, setQuantumState] = useState(aiService.getQuantumState());
  const [rewardSystem, setRewardSystem] = useState(aiService.getRewardSystem());

  useEffect(() => {
    try {
      console.log('🔧 Initializing AI service...');
      aiService.loadFromStorage();
      
      // Получаем сохраненную модель, НЕ принудительно устанавливаем autonomous
      const savedModel = aiService.getSelectedModel();
      const savedApiKey = aiService.getApiKey();
      const savedHfKey = aiService.getHuggingFaceKey();
      
      setSelectedModelState(savedModel);
      setHasApiKey(!!savedApiKey || !!savedHfKey);
      updateStates();
      
      console.log('✅ AI service initialized with model:', savedModel);
    } catch (error) {
      console.error('❌ Error loading AI service:', error);
      setSelectedModelState('autonomous');
      setHasApiKey(false);
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
      console.log('✅ Response generated successfully');
      return response;
    } catch (error) {
      console.error('❌ Error generating response:', error);
      return {
        text: `Извини, произошла ошибка: ${error.message}`,
        emotion: 'confused',
        thoughts: ['Обрабатываю ошибку...'],
        learning: ['Анализирую проблему'],
        confidence: 0.5,
        autonomousLevel: 1.0
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
      return "Размышляю...";
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
      setHasApiKey(!!key);
      console.log('✅ OpenAI API key updated');
    } catch (error) {
      console.error('Error setting API key:', error);
    }
  }, []);

  const setHuggingFaceKey = useCallback((key: string) => {
    try {
      aiService.setHuggingFaceKey(key);
      setHasApiKey(!!key);
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
