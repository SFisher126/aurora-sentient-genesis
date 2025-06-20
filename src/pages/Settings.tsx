
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { advancedThemeService } from '../services/advancedThemeService';
import { enhancedGestureService } from '../services/enhancedGestureService';

const Settings = () => {
  const [themes, setThemes] = useState<any[]>([]);
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [gesturesEnabled, setGesturesEnabled] = useState(true);

  useEffect(() => {
    setThemes(advancedThemeService.getThemes());
    setCurrentTheme(advancedThemeService.getCurrentTheme());
    setGesturesEnabled(enhancedGestureService.isGestureEnabled());
  }, []);

  const handleThemeChange = (themeId: string) => {
    advancedThemeService.setTheme(themeId);
    setCurrentTheme(advancedThemeService.getCurrentTheme());
  };

  const toggleGestures = () => {
    const newState = !gesturesEnabled;
    enhancedGestureService.setEnabled(newState);
    setGesturesEnabled(newState);
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">⚙️ Настройки</h1>
            <p className="text-gray-400">Персонализация опыта общения с Анютой</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎨 Темы оформления</h3>
              <p className="text-gray-400 mb-4">Текущая тема: {currentTheme?.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`h-16 text-xs ${
                      currentTheme?.id === theme.id 
                        ? 'ring-2 ring-purple-400' 
                        : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      color: theme.colors.text
                    }}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎤 Голосовые настройки</h3>
              <p className="text-gray-400 mb-4">ElevenLabs интеграция активна</p>
              <div className="space-y-2">
                <p className="text-sm text-green-400">✅ Эмоциональная интонация</p>
                <p className="text-sm text-green-400">✅ Русский голос (Aria)</p>
                <p className="text-sm text-green-400">✅ Адаптация под настроение</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🤲 Жесты управления</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Активировать жесты</span>
                  <Button
                    onClick={toggleGestures}
                    className={gesturesEnabled ? 'bg-green-600' : 'bg-gray-600'}
                  >
                    {gesturesEnabled ? '✅ Включено' : '❌ Выключено'}
                  </Button>
                </div>
                {gesturesEnabled && (
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>• Свайп влево/вправо - навигация</p>
                    <p>• Встряхивание - смена темы</p>
                    <p>• Двойное нажатие - полноэкранный режим</p>
                    <p>• Долгое нажатие - контекстное меню</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🧠 Поведение ИИ</h3>
              <div className="space-y-2">
                <p className="text-sm text-green-400">✅ Эмоциональный анализ</p>
                <p className="text-sm text-green-400">✅ Персональная память</p>
                <p className="text-sm text-green-400">✅ Адаптивные ответы</p>
                <p className="text-sm text-green-400">✅ Машинное обучение</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
