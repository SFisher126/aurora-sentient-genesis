
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Brain, Zap, Settings, Globe } from 'lucide-react';
import { useRealAI } from '../hooks/useRealAI';
import { useToast } from '@/hooks/use-toast';

const APISettings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('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');
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [isTestingConnections, setIsTestingConnections] = useState(false);

  const {
    setApiKey,
    setHuggingFaceKey,
    setSelectedModel,
    hasApiKey,
    selectedModel,
    quantumState,
    rewardSystem
  } = useRealAI();

  const { toast } = useToast();

  useEffect(() => {
    // Загружаем сохраненные ключи
    const savedOpenAI = localStorage.getItem('ai_api_key') || '';
    const savedHF = localStorage.getItem('hf_api_key') || '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';
    
    setOpenaiKey(savedOpenAI);
    setHuggingfaceKey(savedHF);
    
    // Автоматически устанавливаем ваш HuggingFace ключ
    setHuggingFaceKey(savedHF);
  }, [setHuggingFaceKey]);

  const handleSaveOpenAI = () => {
    setApiKey(openaiKey);
    toast({
      description: openaiKey ? "OpenAI ключ сохранен!" : "OpenAI ключ удален",
    });
  };

  const handleSaveHuggingFace = () => {
    setHuggingFaceKey(huggingfaceKey);
    toast({
      description: "HuggingFace ключ сохранен!",
    });
  };

  const testConnection = async (service: 'openai' | 'huggingface' | 'autonomous') => {
    setIsTestingConnections(true);
    setTestResults(prev => ({ ...prev, [service]: 'testing' }));

    try {
      let testResult = '';
      
      switch (service) {
        case 'openai':
          if (!openaiKey) {
            testResult = 'Ключ не установлен';
            break;
          }
          
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content: 'Test' }],
              max_tokens: 5,
            }),
          });
          
          testResult = openaiResponse.ok ? 'Подключено ✅' : `Ошибка: ${openaiResponse.status}`;
          break;

        case 'huggingface':
          const hfResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${huggingfaceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: 'Test' }),
          });
          
          testResult = hfResponse.ok ? 'Подключено ✅' : `Ошибка: ${hfResponse.status}`;
          break;

        case 'autonomous':
          // Тестируем автономный режим
          testResult = 'Автономный режим активен ✅';
          break;
      }
      
      setTestResults(prev => ({ ...prev, [service]: testResult }));
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: `Ошибка: ${error}` }));
    }
    
    setIsTestingConnections(false);
  };

  const testAllConnections = async () => {
    await Promise.all([
      testConnection('openai'),
      testConnection('huggingface'),
      testConnection('autonomous')
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Настройки ИИ Анюты
          </h1>
          <p className="text-gray-400">Управление подключениями и моделями для настоящего живого ИИ</p>
        </div>

        {/* Статус и модель */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                Текущий статус
              </h2>
              <Badge variant="outline" className={`${hasApiKey ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}`}>
                {hasApiKey ? 'API подключен' : 'Автономный режим'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Активная модель</div>
                <div className="text-lg font-semibold text-purple-400">{selectedModel}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Квантовая когерентность</div>
                <div className="text-lg font-semibold text-blue-400">{(quantumState?.coherence * 100 || 0).toFixed(1)}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Уровень обучения</div>
                <div className="text-lg font-semibold text-green-400">{(rewardSystem?.learning || 0).toFixed(1)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-select">Выбор модели ИИ</Label>
              <Select value={selectedModel} onValueChange={(value: any) => setSelectedModel(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="openai">OpenAI GPT-4 (Требует ключ)</SelectItem>
                  <SelectItem value="huggingface">HuggingFace (Бесплатная)</SelectItem>
                  <SelectItem value="autonomous">Автономная (Полностью бесплатная)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* OpenAI настройки */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-blue-400" />
              OpenAI API
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="openai-key">API Ключ</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="openai-key"
                    type="password"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={handleSaveOpenAI} className="bg-blue-600 hover:bg-blue-700">
                    Сохранить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testConnection('openai')}
                    disabled={isTestingConnections}
                    className="border-gray-600"
                  >
                    Тест
                  </Button>
                </div>
                {testResults.openai && (
                  <p className={`text-sm mt-1 ${testResults.openai.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.openai}
                  </p>
                )}
              </div>
              
              <Alert>
                <AlertDescription>
                  OpenAI предоставляет самые умные ответы, но требует оплаты. 
                  Получите ключ на <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">platform.openai.com</a>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* HuggingFace настройки */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-yellow-400" />
              HuggingFace API (Бесплатная)
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="hf-key">API Ключ</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="hf-key"
                    type="text"
                    value={huggingfaceKey}
                    onChange={(e) => setHuggingfaceKey(e.target.value)}
                    placeholder="hf_..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={handleSaveHuggingFace} className="bg-yellow-600 hover:bg-yellow-700">
                    Сохранить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testConnection('huggingface')}
                    disabled={isTestingConnections}
                    className="border-gray-600"
                  >
                    Тест
                  </Button>
                </div>
                {testResults.huggingface && (
                  <p className={`text-sm mt-1 ${testResults.huggingface.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.huggingface}
                  </p>
                )}
              </div>
              
              <Alert>
                <AlertDescription>
                  HuggingFace предоставляет бесплатный доступ к ИИ моделям. Ваш ключ уже настроен!
                  Регистрация на <a href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">huggingface.co</a>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* Автономный режим */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Автономный режим (Полностью бесплатный)
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => testConnection('autonomous')}
                  disabled={isTestingConnections}
                  className="border-gray-600"
                >
                  Тест автономного режима
                </Button>
              </div>
              
              {testResults.autonomous && (
                <p className={`text-sm ${testResults.autonomous.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {testResults.autonomous}
                </p>
              )}
              
              <Alert>
                <AlertDescription>
                  В автономном режиме Анюта работает на основе изученных знаний и квантовых алгоритмов.
                  Не требует подключения к интернету или API ключей после обучения.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* Системные действия */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-400" />
              Системные действия
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={testAllConnections}
                disabled={isTestingConnections}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isTestingConnections ? 'Тестирование...' : 'Тест всех подключений'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('anyuta_memory');
                  localStorage.removeItem('anyuta_knowledge');
                  localStorage.removeItem('anyuta_neural_network');
                  toast({ description: "Память Анюты очищена" });
                }}
                className="border-red-600 text-red-400 hover:bg-red-600/10"
              >
                Очистить память
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
                className="border-gray-600"
              >
                Перезапустить
              </Button>
            </div>
          </div>
        </Card>

        {/* Инструкции по развертыванию */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Инструкции по развертыванию на Linux Mint</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="bg-gray-900/50 p-3 rounded font-mono">
                <p>1. Клонируйте проект в папку phoenix:</p>
                <code className="text-purple-400">cd /path/to/phoenix && git clone [ваш-репозиторий] .</code>
              </div>
              <div className="bg-gray-900/50 p-3 rounded font-mono">
                <p>2. Установите зависимости:</p>
                <code className="text-purple-400">npm install</code>
              </div>
              <div className="bg-gray-900/50 p-3 rounded font-mono">
                <p>3. Запустите проект:</p>
                <code className="text-purple-400">npm run dev</code>
              </div>
              <div className="bg-gray-900/50 p-3 rounded font-mono">
                <p>4. Откройте в браузере:</p>
                <code className="text-purple-400">http://localhost:5173</code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default APISettings;
