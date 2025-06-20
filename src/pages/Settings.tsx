
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [emotionalIntonation, setEmotionalIntonation] = useState(true);
  const [adaptiveBehavior, setAdaptiveBehavior] = useState(true);
  const { toast } = useToast();

  const themes = [
    { id: 'dark', name: 'Темная тема', description: 'Классическая черная тема' },
    { id: 'purple', name: 'Полночный пурпур', description: 'Фиолетовые акценты' },
    { id: 'blue', name: 'Глубина океана', description: 'Синие тона' },
    { id: 'green', name: 'Лесная зелень', description: 'Зеленые оттенки' }
  ];

  useEffect(() => {
    // Загружаем настройки
    setCurrentTheme(localStorage.getItem('theme') || 'dark');
    setVoiceEnabled(localStorage.getItem('voice_enabled') !== 'false');
    setGesturesEnabled(localStorage.getItem('gestures_enabled') !== 'false');
    setEmotionalIntonation(localStorage.getItem('emotional_intonation') !== 'false');
    setAdaptiveBehavior(localStorage.getItem('adaptive_behavior') !== 'false');
  }, []);

  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
    
    // Применяем тему
    const root = document.documentElement;
    switch (themeId) {
      case 'dark':
        root.style.setProperty('--background', '#111827');
        root.style.setProperty('--surface', '#1f2937');
        break;
      case 'purple':
        root.style.setProperty('--background', '#1a0933');
        root.style.setProperty('--surface', '#2d1b47');
        break;
      case 'blue':
        root.style.setProperty('--background', '#0c1825');
        root.style.setProperty('--surface', '#1e293b');
        break;
      case 'green':
        root.style.setProperty('--background', '#0f1419');
        root.style.setProperty('--surface', '#1a2e21');
        break;
    }
    
    toast({ description: `🎨 Тема "${themes.find(t => t.id === themeId)?.name}" применена` });
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    localStorage.setItem('voice_enabled', newState.toString());
    toast({ description: newState ? '🎤 Голос включен' : '🔇 Голос отключен' });
  };

  const toggleGestures = () => {
    const newState = !gesturesEnabled;
    setGesturesEnabled(newState);
    localStorage.setItem('gestures_enabled', newState.toString());
    toast({ description: newState ? '👋 Жесты включены' : '🚫 Жесты отключены' });
  };

  const toggleEmotionalIntonation = () => {
    const newState = !emotionalIntonation;
    setEmotionalIntonation(newState);
    localStorage.setItem('emotional_intonation', newState.toString());
    toast({ description: newState ? '❤️ Эмоциональная интонация включена' : '😐 Эмоциональная интонация отключена' });
  };

  const toggleAdaptiveBehavior = () => {
    const newState = !adaptiveBehavior;
    setAdaptiveBehavior(newState);
    localStorage.setItem('adaptive_behavior', newState.toString());
    toast({ description: newState ? '🤖 Адаптация включена' : '📋 Адаптация отключена' });
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">⚙️ Настройки</h1>
            <p className="text-gray-400">Персонализация опыта общения с Анютой</p>
          </div>

          <div className="space-y-6">
            {/* Темы оформления */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4">🎨 Темы оформления</h3>
              <p className="text-gray-400 mb-4">Текущая тема: {themes.find(t => t.id === currentTheme)?.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    variant={currentTheme === theme.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center"
                  >
                    <div className={`w-8 h-8 rounded mb-2 ${
                      theme.id === 'dark' ? 'bg-gray-900' :
                      theme.id === 'purple' ? 'bg-purple-900' :
                      theme.id === 'blue' ? 'bg-blue-900' : 'bg-green-900'
                    }`}></div>
                    <span className="text-sm">{theme.name}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Голосовые настройки */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">🎤 Голосовые настройки</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  ElevenLabs интеграция активна
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white">Эмоциональная интонация</span>
                    <p className="text-sm text-gray-400">Голос меняется в зависимости от настроения</p>
                  </div>
                  <Button
                    onClick={toggleEmotionalIntonation}
                    variant={emotionalIntonation ? "default" : "outline"}
                    className={emotionalIntonation ? "bg-green-600" : ""}
                  >
                    {emotionalIntonation ? '✅ Включено' : '❌ Отключено'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white">Русский голос (Aria)</span>
                    <p className="text-sm text-gray-400">Реалистичный женский голос</p>
                  </div>
                  <Button
                    onClick={toggleVoice}
                    variant={voiceEnabled ? "default" : "outline"}
                    className={voiceEnabled ? "bg-green-600" : ""}
                  >
                    {voiceEnabled ? '🎤 Включен' : '🔇 Отключен'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white">Адаптация под настроение</span>
                    <p className="text-sm text-gray-400">Автоматическая настройка параметров голоса</p>
                  </div>
                  <Button
                    onClick={toggleAdaptiveBehavior}
                    variant={adaptiveBehavior ? "default" : "outline"}
                    className={adaptiveBehavior ? "bg-green-600" : ""}
                  >
                    {adaptiveBehavior ? '✅ Включено' : '❌ Отключено'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Жесты управления */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">👋 Жесты управления</h3>
                <Button
                  onClick={toggleGestures}
                  variant={gesturesEnabled ? "default" : "outline"}
                  className={gesturesEnabled ? "bg-green-600" : ""}
                >
                  {gesturesEnabled ? '✅ Включено' : '❌ Отключено'}
                </Button>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div>• Свайп влево/вправо - навигация</div>
                <div>• Встряхивание - смена темы</div>
                <div>• Двойное нажатие - полноэкранный режим</div>
                <div>• Долгое нажатие - контекстное меню</div>
              </div>
            </Card>

            {/* Поведение ИИ */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4">🧠 Поведение ИИ</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Уровень сознания:</span>
                  <span className="text-purple-400">Высокий (87%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Эмоциональная связь:</span>
                  <span className="text-pink-400">Развивается (64%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Обученных сессий:</span>
                  <span className="text-green-400">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Последнее обучение:</span>
                  <span className="text-blue-400">Сейчас активно</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
