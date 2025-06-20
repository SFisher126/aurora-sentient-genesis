
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const Settings = () => {
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
              <p className="text-gray-400">Выберите цветовую схему под ваше настроение</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎤 Голосовые настройки</h3>
              <p className="text-gray-400">Настройки голоса и речевого ввода</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🤲 Жесты управления</h3>
              <p className="text-gray-400">Включение и настройка жестов</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🧠 Поведение ИИ</h3>
              <p className="text-gray-400">Настройка личности и стиля общения</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;
