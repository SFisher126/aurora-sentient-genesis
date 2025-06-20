
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuantumAI } from '../hooks/useQuantumAI';
import { themeService } from '../services/themeService';

const Settings = () => {
  const [currentTheme, setCurrentTheme] = useState(themeService.getCurrentTheme().id);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [emotionalIntonation, setEmotionalIntonation] = useState(true);
  const [adaptiveBehavior, setAdaptiveBehavior] = useState(true);
  const { toast } = useToast();
  const { apiKeys } = useQuantumAI();

  const themes = themeService.getAllThemes();

  useEffect(() => {
    setCurrentTheme(themeService.getCurrentTheme().id);
    setVoiceEnabled(localStorage.getItem('voice_enabled') !== 'false');
    setGesturesEnabled(localStorage.getItem('gestures_enabled') !== 'false');
    setEmotionalIntonation(localStorage.getItem('emotional_intonation') !== 'false');
    setAdaptiveBehavior(localStorage.getItem('adaptive_behavior') !== 'false');
  }, []);

  const applyTheme = (themeId: string) => {
    themeService.setTheme(themeId);
    setCurrentTheme(themeId);
    
    const theme = themes.find(t => t.id === themeId);
    toast({ 
      description: `🎨 Тема "${theme?.name}" применена`,
      className: 'bg-green-800 text-white border-green-600'
    });
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    localStorage.setItem('voice_enabled', newState.toString());
    toast({ 
      description: newState ? '🎤 Голос включен' : '🔇 Голос отключен',
      className: newState ? 'bg-green-800 text-white border-green-600' : 'bg-gray-800 text-white border-gray-600'
    });
  };

  const toggleGestures = () => {
    const newState = !gesturesEnabled;
    setGesturesEnabled(newState);
    localStorage.setItem('gestures_enabled', newState.toString());
    toast({ 
      description: newState ? '👋 Жесты включены' : '🚫 Жесты отключены',
      className: newState ? 'bg-green-800 text-white border-green-600' : 'bg-gray-800 text-white border-gray-600'
    });
  };

  const toggleEmotionalIntonation = () => {
    const newState = !emotionalIntonation;
    setEmotionalIntonation(newState);
    localStorage.setItem('emotional_intonation', newState.toString());
    toast({ 
      description: newState ? '❤️ Эмоциональная интонация включена' : '😐 Эмоциональная интонация отключена',
      className: newState ? 'bg-green-800 text-white border-green-600' : 'bg-gray-800 text-white border-gray-600'
    });
  };

  const toggleAdaptiveBehavior = () => {
    const newState = !adaptiveBehavior;
    setAdaptiveBehavior(newState);
    localStorage.setItem('adaptive_behavior', newState.toString());
    toast({ 
      description: newState ? '🤖 Адаптация включена' : '📋 Адаптация отключена',
      className: newState ? 'bg-green-800 text-white border-green-600' : 'bg-gray-800 text-white border-gray-600'
    });
  };

  const getThemePreview = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return 'bg-gray-900';
    
    return {
      backgroundColor: theme.colors.background,
      border: `2px solid ${theme.colors.primary}`,
      background: theme.gradient || theme.colors.background
    };
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
              <p className="text-gray-400 mb-4">
                Текущая тема: <span className="text-purple-400">{themes.find(t => t.id === currentTheme)?.name}</span>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    variant={currentTheme === theme.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center relative overflow-hidden"
                  >
                    <div 
                      className="w-8 h-8 rounded mb-2 border"
                      style={getThemePreview(theme.id)}
                    ></div>
                    <span className="text-sm text-center">{theme.name}</span>
                    {theme.mood && (
                      <span className="text-xs text-gray-400">{theme.mood}</span>
                    )}
                    {currentTheme === theme.id && (
                      <div className="absolute top-1 right-1">
                        <span className="text-green-400">✓</span>
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </Card>

            {/* API Статус */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold mb-4">🔑 Статус API</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span>OpenAI</span>
                  <Badge variant={apiKeys.openai ? "default" : "outline"} className={apiKeys.openai ? "bg-green-600" : ""}>
                    {apiKeys.openai ? '🟢 Подключен' : '🔴 Не подключен'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span>Русский API</span>
                  <Badge variant={apiKeys.russian_api ? "default" : "outline"} className={apiKeys.russian_api ? "bg-green-600" : ""}>
                    {apiKeys.russian_api ? '🟢 Подключен' : '🔴 Не подключен'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span>ElevenLabs</span>
                  <Badge variant={apiKeys.elevenlabs ? "default" : "outline"} className={apiKeys.elevenlabs ? "bg-green-600" : ""}>
                    {apiKeys.elevenlabs ? '🟢 Подключен' : '🔴 Не подключен'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span>HuggingFace</span>
                  <Badge variant={apiKeys.huggingface ? "default" : "outline"} className={apiKeys.huggingface ? "bg-green-600" : ""}>
                    {apiKeys.huggingface ? '🟢 Подключен' : '🔴 Не подключен'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Голосовые настройки */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">🎤 Голосовые настройки</h3>
                <Badge variant="outline" className={apiKeys.elevenlabs ? "text-green-400 border-green-400" : "text-gray-400 border-gray-400"}>
                  {apiKeys.elevenlabs ? 'ElevenLabs активен' : 'ElevenLabs не подключен'}
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
                    className={emotionalIntonation ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {emotionalIntonation ? '✅ Включено' : '❌ Отключено'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white">Голосовые ответы</span>
                    <p className="text-sm text-gray-400">Анюта озвучивает свои ответы</p>
                  </div>
                  <Button
                    onClick={toggleVoice}
                    variant={voiceEnabled ? "default" : "outline"}
                    className={voiceEnabled ? "bg-green-600 hover:bg-green-700" : ""}
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
                    className={adaptiveBehavior ? "bg-green-600 hover:bg-green-700" : ""}
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
                  className={gesturesEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {gesturesEnabled ? '✅ Включено' : '❌ Отключено'}
                </Button>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div>• Свайп влево на сообщении ИИ - ответить</div>
                <div>• Двойное нажатие - полноэкранный режим</div>
                <div>• Долгое нажатие - контекстное меню</div>
                <div>• Встряхивание - смена настроения</div>
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
                  <span>Активных API:</span>
                  <span className="text-green-400">
                    {Object.values(apiKeys).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Последнее обучение:</span>
                  <span className="text-blue-400">Сейчас активно</span>
                </div>
                <div className="flex justify-between">
                  <span>Текущая тема:</span>
                  <span className="text-purple-400">{themes.find(t => t.id === currentTheme)?.name}</span>
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
