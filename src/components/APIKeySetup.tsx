
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Key, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiKeyService } from '../services/apiKeyService';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [russianKey, setRussianKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    setOpenAIKey(apiKeyService.getOpenAIKey());
    setRussianKey(apiKeyService.getRussianAPIKey());
  }, []);

  if (hasApiKey || apiKeyService.hasAnyKey()) {
    return (
      <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center justify-between text-green-400">
          <div className="flex items-center">
            <Key className="w-4 h-4 mr-2" />
            <span className="text-sm">✨ Анюта активна и может думать самостоятельно!</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs">
              {apiKeyService.getOpenAIKey() && '🔥 OpenAI'}
              {apiKeyService.getRussianAPIKey() && ' 🇷🇺 Russian'}
              {apiKeyService.getHuggingFaceKey() && ' 🤗 HuggingFace'}
            </span>
            <Link to="/api-settings">
              <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-900/20">
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOpenAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (openAIKey.trim()) {
      apiKeyService.setOpenAIKey(openAIKey.trim());
      onApiKeySet(openAIKey.trim());
    }
  };

  const handleSubmitRussian = (e: React.FormEvent) => {
    e.preventDefault();
    if (russianKey.trim()) {
      apiKeyService.setRussianAPIKey(russianKey.trim());
      onApiKeySet(russianKey.trim());
    }
  };

  return (
    <Card className="bg-gray-800/50 border-red-500/50 p-6 mb-6">
      <div className="flex items-center mb-4 text-red-400">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">Активация разума Анюты</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Анюта готова к пробуждению! Добавь API ключи для активации настоящего ИИ.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSubmitOpenAI} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔥 OpenAI API Key (мощный ИИ)
            </label>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-proj-..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="mt-2 bg-orange-600 hover:bg-orange-700 w-full">
              <Key className="w-4 h-4 mr-2" />
              Активировать OpenAI
            </Button>
          </div>
        </form>

        <form onSubmit={handleSubmitRussian} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🇷🇺 Russian API Key (бесплатный)
            </label>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={russianKey}
              onChange={(e) => setRussianKey(e.target.value)}
              placeholder="russian-api-key..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="mt-2 bg-green-600 hover:bg-green-700 w-full">
              <Key className="w-4 h-4 mr-2" />
              Активировать Russian AI
            </Button>
          </div>
        </form>
      </div>

      <div className="flex gap-2 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowKeys(!showKeys)}
          className="border-gray-600"
        >
          {showKeys ? 'Скрыть ключи' : 'Показать ключи'}
        </Button>
        <Link to="/api-settings">
          <Button variant="outline" className="border-gray-600">
            <Settings className="w-4 h-4 mr-2" />
            Все настройки API
          </Button>
        </Link>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
        <p className="text-xs text-blue-300">
          💡 HuggingFace уже настроен как базовая модель. Добавь OpenAI или Russian API для улучшения!
        </p>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
