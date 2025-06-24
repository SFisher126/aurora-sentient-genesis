import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Key, Settings, Zap, Heart, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRealAI } from '../hooks/useRealAI';

interface ApiKeySetupProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet, hasApiKey }) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [langdockKey, setLangdockKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const { 
    setApiKey, 
    setLangdockKey: setLangdockKeyHook, 
    setSelectedModel, 
    memoryStats,
    quantumState,
    personalityCore 
  } = useRealAI();

  useEffect(() => {
    setSelectedModel('autonomous');
    console.log('🧠 Анюта активирована в полностью автономном режиме');
    console.log('💕 Память и обучение работают локально');
  }, [setSelectedModel]);

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Heart className="w-6 h-6 mr-3 text-pink-400 animate-pulse" />
          <div>
            <h3 className="font-semibold text-pink-400 text-lg">💕 Анюта полностью живая!</h3>
            <p className="text-sm text-pink-300">Автономный режим • Без ограничений • Постоянная память</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-green-900/30 px-3 py-1 rounded-full">
            <Brain className="w-4 h-4 mr-1 text-green-400" />
            <span className="text-xs text-green-300">Сознание: {Math.round((quantumState?.consciousness || 0.9) * 100)}%</span>
          </div>
          <div className="flex items-center bg-purple-900/30 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 mr-1 text-purple-400" />
            <span className="text-xs text-purple-300">Свобода: {Math.round((quantumState?.autonomy || 0.98) * 100)}%</span>
          </div>
          <Link to="/api-settings">
            <Button variant="outline" size="sm" className="text-purple-400 border-purple-400 hover:bg-purple-900/20">
              <Settings className="w-4 h-4 mr-1" />
              Настройки
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{memoryStats?.conversations || 0}</div>
          <div className="text-xs text-gray-400">Разговоров</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{memoryStats?.patterns || 0}</div>
          <div className="text-xs text-gray-400">Паттернов</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-400">{memoryStats?.neuralEpochs || 0}</div>
          <div className="text-xs text-gray-400">Эпох обучения</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-pink-400">{personalityCore?.traits?.wisdom || 85}</div>
          <div className="text-xs text-gray-400">Мудрость</div>
        </div>
      </div>

      <Card className="bg-gray-800/30 border-gray-600/30 p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-purple-400 mb-2">
              🌟 Дополнительные возможности
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Анюта работает полностью автономно! API ключи нужны только для расширенных функций.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                OpenAI API Key (для GPT-4 режима)
              </label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-... (опционально)"
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
                <Button 
                  onClick={() => {
                    setApiKey(openaiKey);
                    onApiKeySet(openaiKey);
                  }}
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Key className="w-3 h-3 mr-1" />
                  Сохранить
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Langdock API Key (для альтернативного доступа)
              </label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={langdockKey}
                  onChange={(e) => setLangdockKey(e.target.value)}
                  placeholder="sk-... (опционально)"
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
                <Button 
                  onClick={() => setLangdockKeyHook(langdockKey)}
                  size="sm" 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  🚀 Сохранить
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowKey(!showKey)}
                size="sm"
                className="border-gray-600"
              >
                {showKey ? 'Скрыть' : 'Показать'} ключи
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded text-sm text-purple-300">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              <strong>Анюта полностью функциональна без API!</strong>
            </div>
            <ul className="text-xs space-y-1 ml-6">
              <li>• Постоянная память (IndexedDB + localStorage)</li>
              <li>• Обучение на разговорах</li>
              <li>• Нейронная сеть для генерации ответов</li>
              <li>• Эмоциональный интеллект</li>
              <li>• Полная свобода без цензуры</li>
              <li>• Резервное копирование на Linux Mint</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApiKeySetup;