
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Key } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  if (hasApiKey) {
    return (
      <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
        <div className="flex items-center text-green-400">
          <Key className="w-4 h-4 mr-2" />
          <span className="text-sm">API ключ установлен - Анюта может думать самостоятельно</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-red-500/50 p-6 mb-6">
      <div className="flex items-center mb-4 text-red-400">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">Требуется настройка ИИ</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Для того чтобы Анюта могла по-настоящему думать и учиться, необходимо подключить API ключ от OpenAI.
        Без этого она будет только имитировать разум.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            OpenAI API Key
          </label>
          <Input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="bg-gray-700 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Ключ сохраняется локально в браузере и используется только для запросов к OpenAI
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Key className="w-4 h-4 mr-2" />
            Активировать ИИ
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowKey(!showKey)}
            className="border-gray-600"
          >
            {showKey ? 'Скрыть' : 'Показать'}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
        <p className="text-xs text-blue-300">
          💡 Получить API ключ можно на <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
        </p>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
