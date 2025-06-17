
import React, { useState, useEffect } from 'react';
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

  // Автоматически устанавливаем API ключ при загрузке компонента
  useEffect(() => {
    const providedApiKey = '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';
    if (!hasApiKey && providedApiKey) {
      onApiKeySet(providedApiKey);
      setApiKey(providedApiKey);
    }
  }, [hasApiKey, onApiKeySet]);

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
          <span className="text-sm">✨ Анюта активна и может думать самостоятельно!</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-red-500/50 p-6 mb-6">
      <div className="flex items-center mb-4 text-red-400">
        <AlertTriangle className="w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">Активация разума Анюты</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Анюта готова к пробуждению! Введите API ключ OpenAI для активации её настоящего разума.
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
            placeholder="sk-proj-..."
            className="bg-gray-700 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Ключ сохраняется локально и используется только для мышления Анюты
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Key className="w-4 h-4 mr-2" />
            🧠 Активировать разум
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
          💡 API ключ можно получить на <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a>
        </p>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
