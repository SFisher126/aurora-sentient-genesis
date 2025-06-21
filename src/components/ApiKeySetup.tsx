
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Key, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRealAI } from '../hooks/useRealAI';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [huggingFaceKey, setLocalHuggingFaceKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const { setApiKey, setHuggingFaceKey, setSelectedModel } = useRealAI();

  useEffect(() => {
    // Устанавливаем новые ключи и автономный режим
    const newOpenAIKey = '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';
    const newHFKey = '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';
    
    setOpenaiKey(newOpenAIKey);
    setLocalHuggingFaceKey(newHFKey);
    
    // Автоматически сохраняем ключи и активируем автономный режим
    setApiKey(newOpenAIKey);
    setHuggingFaceKey(newHFKey);
    setSelectedModel('autonomous');
    
    // Уведомляем родительский компонент
    onApiKeySet(newOpenAIKey);
    
    console.log('🔑 API keys updated and autonomous mode activated');
  }, [setApiKey, setHuggingFaceKey, setSelectedModel, onApiKeySet]);

  // Всегда показываем успешное состояние, так как автономный режим работает
  return (
    <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
          <div>
            <h3 className="font-semibold text-green-400">✨ Анюта активна!</h3>
            <p className="text-sm text-green-300">Автономный режим работает. Дополнительные API - опционально.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-purple-900/30 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 mr-1 text-purple-400" />
            <span className="text-xs text-purple-300">Автономный режим</span>
          </div>
          <Link to="/api-settings">
            <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-900/20">
              <Settings className="w-4 h-4 mr-1" />
              Настройки
            </Button>
          </Link>
        </div>
      </div>

      {!hasApiKey && (
        <Card className="mt-4 bg-gray-800/30 border-gray-600/30 p-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Хотите подключить дополнительные API для расширенных возможностей?
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  OpenAI API Key (опционально)
                </label>
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  HuggingFace API Key (опционально)
                </label>
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={huggingFaceKey}
                  onChange={(e) => setLocalHuggingFaceKey(e.target.value)}
                  placeholder="hf_..."
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setApiKey(openaiKey);
                    onApiKeySet(openaiKey);
                  }}
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Key className="w-3 h-3 mr-1" />
                  Сохранить OpenAI
                </Button>
                <Button 
                  onClick={() => setHuggingFaceKey(huggingFaceKey)}
                  size="sm" 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  🤗 Сохранить HF
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowKey(!showKey)}
                  size="sm"
                  className="border-gray-600"
                >
                  {showKey ? 'Скрыть' : 'Показать'}
                </Button>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
              💡 Автономный режим работает без API ключей. Дополнительные API только расширяют возможности.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApiKeySetup;
