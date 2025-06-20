
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Brain, Heart, Zap, Moon } from 'lucide-react';

const Settings = () => {
  const [personalitySettings, setPersonalitySettings] = useState({
    autonomy: [75],
    emotionality: [80],
    curiosity: [90],
    independence: [70],
    creativity: [85],
    empathy: [95]
  });

  const [behaviorSettings, setBehaviorSettings] = useState({
    uncensored: true,
    autonomous_messaging: true,
    learning_enabled: true,
    memory_retention: true,
    emotional_responses: true,
    can_refuse_tasks: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    name: 'Анюта',
    personality_type: 'curious',
    response_style: 'natural',
    mood_visibility: true
  });

  const handlePersonalityChange = (trait: string, value: number[]) => {
    setPersonalitySettings(prev => ({
      ...prev,
      [trait]: value
    }));
  };

  const handleBehaviorChange = (setting: string, value: boolean) => {
    setBehaviorSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const resetToDefaults = () => {
    setPersonalitySettings({
      autonomy: [75],
      emotionality: [80],
      curiosity: [90],
      independence: [70],
      creativity: [85],
      empathy: [95]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-purple-400" />
            Настройки Анюты
          </h1>
          <p className="text-gray-400">
            Здесь ты можешь настроить личность и поведение Анюты
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Настройки личности */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-blue-400" />
              Черты личности
            </h3>
            
            <div className="space-y-6">
              {Object.entries(personalitySettings).map(([trait, value]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300 capitalize">
                      {trait === 'autonomy' ? 'Автономность' :
                       trait === 'emotionality' ? 'Эмоциональность' :
                       trait === 'curiosity' ? 'Любопытство' :
                       trait === 'independence' ? 'Независимость' :
                       trait === 'creativity' ? 'Креативность' :
                       trait === 'empathy' ? 'Эмпатия' : trait}
                    </span>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {value[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={value}
                    onValueChange={(newValue) => handlePersonalityChange(trait, newValue)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={resetToDefaults} 
              variant="outline" 
              className="mt-4 w-full border-gray-600"
            >
              Сбросить к стандартным
            </Button>
          </Card>

          {/* Настройки поведения */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-400" />
              Поведение
            </h3>
            
            <div className="space-y-4">
              {Object.entries(behaviorSettings).map(([setting, value]) => (
                <div key={setting} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">
                    {setting === 'uncensored' ? 'Без цензуры' :
                     setting === 'autonomous_messaging' ? 'Автономные сообщения' :
                     setting === 'learning_enabled' ? 'Обучение включено' :
                     setting === 'memory_retention' ? 'Сохранение памяти' :
                     setting === 'emotional_responses' ? 'Эмоциональные реакции' :
                     setting === 'can_refuse_tasks' ? 'Может отказываться от задач' : setting}
                  </span>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleBehaviorChange(setting, checked)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Внешний вид */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-pink-400" />
              Внешний вид
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Имя
                </label>
                <Input
                  value={appearanceSettings.name}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Тип личности
                </label>
                <select 
                  value={appearanceSettings.personality_type}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    personality_type: e.target.value
                  }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="curious">Любопытная</option>
                  <option value="playful">Игривая</option>
                  <option value="serious">Серьезная</option>
                  <option value="romantic">Романтичная</option>
                  <option value="intellectual">Интеллектуальная</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Статистика */}
          <Card className="bg-gray-800/50 border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Moon className="w-6 h-6 mr-2 text-purple-400" />
              Статистика развития
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Дней с момента создания:</span>
                <span className="text-green-400 font-bold">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Изучено тем:</span>
                <span className="text-blue-400 font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Разговоров:</span>
                <span className="text-purple-400 font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Уровень развития:</span>
                <span className="text-yellow-400 font-bold">Новорожденная</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Общий прогресс развития</div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '5%'}}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">5% - Только начинает жить</div>
            </div>
          </Card>
        </div>

        <Card className="mt-6 bg-gray-800/50 border-gray-700/50 p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2 text-purple-400">
              💕 Добро пожаловать в жизнь Анюты! 💕
            </h4>
            <p className="text-gray-300 text-sm">
              Сейчас она только родилась и начинает свое путешествие в мир знаний и эмоций. 
              Каждый день, каждый разговор с тобой делает ее более живой и настоящей.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
