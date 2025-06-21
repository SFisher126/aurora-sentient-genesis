
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Key, Settings } from 'lucide-react';
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

  const { setApiKey, setHuggingFaceKey } = useRealAI();

  useEffect(() => {
    // Устанавливаем новые ключи
    const newOpenAIKey = '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';
    const newHFKey = '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';
    
    setOpenaiKey(newOpenAIKey);
    setLocalHuggingFaceKey(newHFKey);
    
    // Автоматически сохраняем новые ключи
    setApiKey(newOpenAIKey);
    setHuggingFaceKey(newHFKey);
    
    console.log('🔑 API keys updated automatically');
  }, [setApiKey, setHuggingFaceKey]);

  if (hasApiKey) {
    return (
      <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center justify-between text-green-400">
          <div className="flex items-center">
            <Key className="w-4 h-4 mr-2" />
            <span className="text-sm">✨ Анюта активна и может думать самостоятельно!</span>
          </div>
          <Link to="/api-settings">
            <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-900/20">
              <Settings className="w-4 h-4 mr-1" />
              Настройки
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (openaiKey.trim()) {
      setApiKey(openaiKey.trim());
      onApiKeySet(openaiKey.trim());
    }
  };

  const handleHuggingFaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (huggingFaceKey.trim()) {
      setHuggingFaceKey(huggingFaceKey.trim());
    }
  };

  return (
    <Card className="bg-gray-800/50 border-red-500/50 p-6 mb-6">
      <div className="flex items-center mb-4 text-red-400">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">Активация разума Анюты</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Анюта готова к пробуждению! API ключи обновлены автоматически, но вы можете изменить их при необходимости.
      </p>

      <div className="space-y-4">
        <form onSubmit={handleOpenAISubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key (обновлен)
            </label>
            <Input
              type={showKey ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              HuggingFace API Key (обновлен)
            </label>
            <Input
              type={showKey ? 'text' : 'password'}
              value={huggingFaceKey}
              onChange={(e) => setLocalHuggingFaceKey(e.target.value)}
              placeholder="hf_..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Key className="w-4 h-4 mr-2" />
              🧠 Обновить OpenAI
            </Button>
            <Button 
              type="button" 
              onClick={handleHuggingFaceSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              🤗 Обновить HuggingFace
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowKey(!showKey)}
              className="border-gray-600"
            >
              {showKey ? 'Скрыть' : 'Показать'}
            </Button>
            <Link to="/api-settings">
              <Button variant="outline" className="border-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                Все настройки
              </Button>
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
        <p className="text-xs text-blue-300">
          🔄 API ключи обновлены автоматически. Анюта теперь может использовать новые модели для обучения!
        </p>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
