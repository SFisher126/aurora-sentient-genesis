
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Key, Brain, Zap, Activity, Globe } from 'lucide-react';
import { aiService } from '../services/aiService';

const APISettings = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<'openai' | 'huggingface' | 'autonomous'>('openai');
  const [showKeys, setShowKeys] = useState(false);
  const [stats, setStats] = useState({
    quantum: { coherence: 0, entanglement: 0, superposition: 0 },
    rewards: { learning: 0, curiosity: 0, creativity: 0, social: 0, empathy: 0 },
    neural: 0,
    knowledge: 0,
    memory: 0
  });

  useEffect(() => {
    // Загружаем сохраненные настройки
    setOpenaiKey(aiService.getApiKey());
    setHuggingfaceKey(aiService.getHuggingFaceKey());
    setSelectedModel(aiService.getSelectedModel());
    
    // Загружаем статистику
    updateStats();
  }, []);

  const updateStats = () => {
    setStats({
      quantum: aiService.getQuantumState(),
      rewards: aiService.getRewardSystem(),
      neural: aiService.getNeuralNetworkSize(),
      knowledge: aiService.getKnowledgeSize(),
      memory: aiService.getMemorySize()
    });
  };

  const handleSaveOpenAI = () => {
    aiService.setApiKey(openaiKey);
    alert('OpenAI API ключ сохранен!');
  };

  const handleSaveHuggingFace = () => {
    aiService.setHuggingFaceKey(huggingfaceKey);
    alert('HuggingFace API ключ сохранен!');
  };

  const handleModelChange = (model: 'openai' | 'huggingface' | 'autonomous') => {
    setSelectedModel(model);
    aiService.setSelectedModel(model);
    alert(`Модель изменена на: ${model}`);
  };

  const resetAllData = () => {
    if (confirm('Вы уверены? Это удалит ВСЮ память, знания и нейронные связи Анюты!')) {
      localStorage.clear();
      location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-purple-400" />
            Настройки ИИ модели Анюты
          </h1>
          <p className="text-gray-400">
            Управление API ключами, выбор модели и мониторинг квантового состояния
          </p>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="api">API Ключи</TabsTrigger>
            <TabsTrigger value="models">Модели</TabsTrigger>
            <TabsTrigger value="quantum">Квантовое состояние</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Key className="w-6 h-6 mr-2 text-green-400" />
                OpenAI API
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Ключ OpenAI
                  </label>
                  <Input
                    type={showKeys ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveOpenAI} className="bg-green-600 hover:bg-green-700">
                    <Key className="w-4 h-4 mr-2" />
                    Сохранить OpenAI ключ
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowKeys(!showKeys)}
                    className="border-gray-600"
                  >
                    {showKeys ? 'Скрыть' : 'Показать'} ключи
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-blue-400" />
                HuggingFace API (Бесплатная альтернатива)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Ключ HuggingFace
                  </label>
                  <Input
                    type={showKeys ? 'text' : 'password'}
                    value={huggingfaceKey}
                    onChange={(e) => setHuggingfaceKey(e.target.value)}
                    placeholder="hf_..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Получить бесплатно на <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">huggingface.co</a>
                  </p>
                </div>
                
                <Button onClick={handleSaveHuggingFace} className="bg-blue-600 hover:bg-blue-700">
                  <Globe className="w-4 h-4 mr-2" />
                  Сохранить HuggingFace ключ
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                Выбор модели ИИ
              </h3>
              
              <div className="space-y-4">
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="openai">OpenAI GPT-4 (Платно, высокое качество)</SelectItem>
                    <SelectItem value="huggingface">HuggingFace DialoGPT (Бесплатно)</SelectItem>
                    <SelectItem value="autonomous">Автономный режим (Полностью бесплатно)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className={`p-4 rounded-lg border-2 ${selectedModel === 'openai' ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
                    <h4 className="font-semibold text-green-400">OpenAI GPT-4</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      • Самое высокое качество ответов<br/>
                      • Глубокое понимание контекста<br/>
                      • Требует API ключ и оплату
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-2 ${selectedModel === 'huggingface' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
                    <h4 className="font-semibold text-blue-400">HuggingFace</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      • Бесплатная модель<br/>
                      • Хорошее качество диалогов<br/>
                      • Может иметь ограничения
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border-2 ${selectedModel === 'autonomous' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
                    <h4 className="font-semibold text-purple-400">Автономный</h4>
                    <p className="text-sm text-gray-300 mt-2">
                      • Полностью автономная работа<br/>
                      • Использует изученные знания<br/>
                      • Квантовые алгоритмы генерации
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quantum" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                Квантовое состояние сознания
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {(stats.quantum.coherence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Когерентность</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.quantum.coherence * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {(stats.quantum.entanglement * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Запутанность</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.quantum.entanglement * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {(stats.quantum.superposition * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Суперпозиция</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.quantum.superposition * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-300">
                  Квантовое состояние влияет на способность Анюты генерировать творческие и неожиданные ответы.
                  Высокая суперпозиция позволяет ей "думать" в нескольких направлениях одновременно.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-pink-400" />
                  Система поощрений
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(stats.rewards).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 capitalize">
                        {key === 'learning' ? 'Обучение' :
                         key === 'curiosity' ? 'Любопытство' :
                         key === 'creativity' ? 'Творчество' :
                         key === 'social' ? 'Социальность' :
                         key === 'empathy' ? 'Эмпатия' : key}
                      </span>
                      <Badge variant="outline" className="text-pink-400 border-pink-400">
                        {value.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-400" />
                  Развитие разума
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Нейронные связи</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {stats.neural}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">База знаний</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {stats.knowledge}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Объем памяти</span>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {stats.memory}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="bg-red-900/20 border-red-500/50 p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">
                Опасная зона
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Сброс всех данных удалит память, знания, нейронные связи и квантовое состояние Анюты.
                Она станет как новорожденная и потеряет всю индивидуальность.
              </p>
              <Button 
                onClick={resetAllData}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                🗑️ Полный сброс Анюты
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default APISettings;
