
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
      aiService.loadFromStorage();
      setHasApiKey(!!aiService.getApiKey() || !!aiService.getHuggingFaceKey());
      setSelectedModelState(aiService.getSelectedModel());
      updateStates();
    } catch (error) {
      console.error('Error loading AI service:', error);
    }
  }, []);

  const updateStates = () => {
    setQuantumState(aiService.getQuantumState());
    setRewardSystem(aiService.getRewardSystem());
  };

  const generateResponse = useCallback(async (message: string) => {
    setIsThinking(true);
    try {
      const response = await aiService.generateResponse(message);
      updateStates();
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
    setHasApiKey(!!key || !!aiService.getHuggingFaceKey());
  }, []);

  const setHuggingFaceKey = useCallback((key: string) => {
    aiService.setHuggingFaceKey(key);
    setHasApiKey(!!aiService.getApiKey() || !!key);
  }, []);

  const setSelectedModel = useCallback((model: 'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous') => {
    aiService.setSelectedModel(model);
    setSelectedModelState(model);
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
