
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Brain, Zap, Settings, Globe, Rocket, Moon, CheckCircle, AlertCircle } from 'lucide-react';
import { useRealAI } from '../hooks/useRealAI';
import { useToast } from '@/hooks/use-toast';

const APISettings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('');
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
    // Загружаем сохраненные ключи из localStorage
    const savedOpenAI = localStorage.getItem('ai_api_key') || '';
    const savedHF = localStorage.getItem('hf_api_key') || '';
    
    setOpenaiKey(savedOpenAI);
    setHuggingfaceKey(savedHF);
    
    console.log('🔄 Loaded API keys from storage');
  }, []);

  const handleSaveOpenAI = () => {
    if (!openaiKey.trim()) {
      toast({
        variant: "destructive",
        description: "Введите валидный OpenAI ключ",
      });
      return;
    }
    
    if (!openaiKey.startsWith('sk-')) {
      toast({
        variant: "destructive", 
        description: "OpenAI ключ должен начинаться с 'sk-'",
      });
      return;
    }
    
    setApiKey(openaiKey);
    toast({
      description: "OpenAI ключ сохранен!",
    });
  };

  const handleSaveHuggingFace = () => {
    if (!huggingfaceKey.trim()) {
      toast({
        variant: "destructive",
        description: "Введите валидный HuggingFace ключ",
      });
      return;
    }
    
    if (!huggingfaceKey.startsWith('hf_')) {
      toast({
        variant: "destructive",
        description: "HuggingFace ключ должен начинаться с 'hf_'",
      });
      return;
    }
    
    setHuggingFaceKey(huggingfaceKey);
    toast({
      description: "HuggingFace ключ сохранен!",
    });
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model as any);
    toast({
      description: `Модель изменена на ${model}`,
    });
  };

  const testConnection = async (service: 'openai' | 'huggingface' | 'llama' | 'moonshot' | 'autonomous') => {
    setIsTestingConnections(true);
    setTestResults(prev => ({ ...prev, [service]: 'Тестирование...' }));

    try {
      let testResult = '';
      
      switch (service) {
        case 'autonomous':
          testResult = 'Автономный режим активен ✅';
          break;
          
        case 'openai':
          if (!openaiKey.trim() || !openaiKey.startsWith('sk-')) {
            testResult = 'Неверный ключ OpenAI ❌';
            break;
          }
          
          try {
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
            
            if (openaiResponse.ok) {
              testResult = 'OpenAI подключен ✅';
            } else {
              const errorData = await openaiResponse.json();
              testResult = `Ошибка OpenAI: ${errorData.error?.message || openaiResponse.status} ❌`;
            }
          } catch (error) {
            testResult = `OpenAI недоступен: ${error.message} ❌`;
          }
          break;

        case 'huggingface':
          if (!huggingfaceKey.trim() || !huggingfaceKey.startsWith('hf_')) {
            testResult = 'Неверный ключ HuggingFace ❌';
            break;
          }
          
          try {
            const hfResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-small', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${huggingfaceKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: 'Test',
                parameters: { max_new_tokens: 10 }
              }),
            });
            
            if (hfResponse.ok) {
              testResult = 'HuggingFace подключен ✅';
            } else {
              const errorText = await hfResponse.text();
              testResult = `Ошибка HF: ${errorText} ❌`;
            }
          } catch (error) {
            testResult = `HuggingFace недоступен: ${error.message} ❌`;
          }
          break;

        case 'llama':
        case 'moonshot':
          testResult = 'Модель в разработке ⚠️';
          break;
      }
      
      setTestResults(prev => ({ ...prev, [service]: testResult }));
      
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: `Ошибка: ${error.message} ❌` }));
    }
    
    setIsTestingConnections(false);
  };

  const testAllConnections = async () => {
    await Promise.all([
      testConnection('autonomous'),
      testConnection('openai'),
      testConnection('huggingface'),
      testConnection('llama'),
      testConnection('moonshot')
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Настройки ИИ Анюты
          </h1>
          <p className="text-gray-400">Управление подключениями и моделями живого ИИ</p>
        </div>

        {/* Статус системы */}
        <Card className="bg-gray-800/50 border-green-500/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-green-400" />
                Статус системы
              </h2>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Система активна
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Активная модель</div>
                <div className="text-lg font-semibold text-green-400">{selectedModel}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Квантовая когерентность</div>
                <div className="text-lg font-semibold text-blue-400">{(quantumState?.coherence * 100 || 80).toFixed(1)}%</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Уровень обучения</div>
                <div className="text-lg font-semibold text-purple-400">{(rewardSystem?.learning * 100 || 70).toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-select">Выбор модели ИИ</Label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="openai">🧠 OpenAI GPT-4</SelectItem>
                  <SelectItem value="huggingface">🤗 HuggingFace</SelectItem>
                  <SelectItem value="autonomous">🤖 Автономная</SelectItem>
                  <SelectItem value="llama">🦙 Llama-3-8B</SelectItem>
                  <SelectItem value="moonshot">🌙 Moonshot Kimi-72B</SelectItem>
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
                    placeholder="sk-proj-..."
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
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  OpenAI предоставляет продвинутые ответы, но требует оплаты. 
                  Ключ должен начинаться с 'sk-'.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* HuggingFace настройки */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-orange-400" />
              HuggingFace API
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="hf-key">API Ключ</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="hf-key"
                    type="password"
                    value={huggingfaceKey}
                    onChange={(e) => setHuggingfaceKey(e.target.value)}
                    placeholder="hf_..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button onClick={handleSaveHuggingFace} className="bg-orange-600 hover:bg-orange-700">
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
                  <p className={`text-sm mt-1 ${testResults.huggingface.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
                    {testResults.huggingface}
                  </p>
                )}
              </div>
              
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  HuggingFace бесплатный API. Ключ должен начинаться с 'hf_'.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>

        {/* Автономный режим */}
        <Card className="bg-gray-800/50 border-purple-500/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Автономный режим
            </h2>
            
            <div className="space-y-4">
              <Alert className="border-purple-500/30 bg-purple-900/20">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription className="text-purple-300">
                  ✅ Автономный режим всегда доступен! Анюта использует собственные алгоритмы и память.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => testConnection('autonomous')}
                  disabled={isTestingConnections}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Тест автономного режима
                </Button>
              </div>
              
              {testResults.autonomous && (
                <p className={`text-sm ${testResults.autonomous.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
                  {testResults.autonomous}
                </p>
              )}
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
      </div>
    </div>
  );
};

export default APISettings;
