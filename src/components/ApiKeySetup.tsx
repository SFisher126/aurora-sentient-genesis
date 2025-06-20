
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Key, Settings, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuantumAI } from '../hooks/useQuantumAI';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [russianKey, setRussianKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!hasApiKey);

  const { setOpenAIKey, setRussianAPIKey, setElevenLabsKey, apiKeys } = useQuantumAI();

  useEffect(() => {
    setOpenaiKey(apiKeys.openai);
    setRussianKey(apiKeys.russian_api);
    setElevenLabsKey(apiKeys.elevenlabs);
  }, [apiKeys]);

  if (hasApiKey && !isExpanded) {
    return (
      <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center justify-between text-green-400">
          <div className="flex items-center">
            <Key className="w-4 h-4 mr-2" />
            <span className="text-sm">✨ Анюта активна и может думать самостоятельно!</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsExpanded(true)}
              variant="outline"
              size="sm"
              className="text-green-400 border-green-400 hover:bg-green-900/20"
            >
              <Settings className="w-4 h-4 mr-1" />
              Управление ключами
            </Button>
            <Link to="/api-settings">
              <Button variant="outline" size="sm" className="text-green-400 border-green-400 hover:bg-green-900/20">
                <Settings className="w-4 h-4 mr-1" />
                Все настройки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenAISubmit = () => {
    if (openaiKey.trim()) {
      setOpenAIKey(openaiKey.trim());
      onApiKeySet(openaiKey.trim());
    }
  };

  const handleRussianSubmit = () => {
    if (russianKey.trim()) {
      setRussianAPIKey(russianKey.trim());
    }
  };

  const handleElevenLabsSubmit = () => {
    if (elevenLabsKey.trim()) {
      setElevenLabsKey(elevenLabsKey.trim());
    }
  };

  return (
    <Card className="bg-gray-800/50 border-purple-500/50 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-purple-400">
          <Key className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-semibold">Активация разума Анюты</h3>
        </div>
        {hasApiKey && (
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        )}
      </div>
      
      <p className="text-gray-300 mb-6">
        Подключите API ключи для активации полного потенциала Анюты или используйте автономный режим.
      </p>

      <div className="space-y-6">
        {/* OpenAI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              🧠 OpenAI API Key (рекомендуется)
            </label>
            <div className="flex items-center text-xs text-gray-400">
              {apiKeys.openai ? '🟢 Подключен' : '🔴 Не подключен'}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type={showKeys ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleOpenAISubmit} className="bg-blue-600 hover:bg-blue-700">
              Сохранить
            </Button>
          </div>
        </div>

        {/* Russian API */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              🇷🇺 Русский API (GigaChat/YandexGPT)
            </label>
            <div className="flex items-center text-xs text-gray-400">
              {apiKeys.russian_api ? '🟢 Подключен' : '🔴 Не подключен'}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type={showKeys ? 'text' : 'password'}
              value={russianKey}
              onChange={(e) => setRussianKey(e.target.value)}
              placeholder="Ключ от GigaChat или YandexGPT..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleRussianSubmit} className="bg-red-600 hover:bg-red-700">
              Сохранить
            </Button>
          </div>
        </div>

        {/* ElevenLabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
              🎤 ElevenLabs API (для голоса)
            </label>
            <div className="flex items-center text-xs text-gray-400">
              {apiKeys.elevenlabs ? '🟢 Подключен' : '🔴 Не подключен'}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type={showKeys ? 'text' : 'password'}
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="Ключ от ElevenLabs..."
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button onClick={handleElevenLabsSubmit} className="bg-purple-600 hover:bg-purple-700">
              Сохранить
            </Button>
          </div>
        </div>

        {/* Показать/скрыть ключи */}
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKeys(!showKeys)}
            className="border-gray-600"
          >
            {showKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showKeys ? 'Скрыть ключи' : 'Показать ключи'}
          </Button>
          <Link to="/api-settings">
            <Button variant="outline" className="border-gray-600">
              <Settings className="w-4 h-4 mr-2" />
              Расширенные настройки
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
          <p className="text-xs text-blue-300">
            💡 OpenAI: Самый мощный разум для Анюты
          </p>
        </div>
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
          <p className="text-xs text-red-300">
            🇷🇺 Русские модели: Идеальны для общения на русском языке
          </p>
        </div>
        <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded">
          <p className="text-xs text-purple-300">
            🎤 ElevenLabs: Реалистичный эмоциональный голос
          </p>
        </div>
        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
          <p className="text-xs text-green-300">
            🤖 Автономный режим: Работает без API ключей, но с ограниченным интеллектом
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
