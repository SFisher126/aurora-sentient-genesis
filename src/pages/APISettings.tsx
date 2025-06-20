
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const APISettings = () => {
  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">🔧 API Настройки</h1>
            <p className="text-gray-400">Настройка подключений к внешним сервисам</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎤 ElevenLabs API</h3>
              <p className="text-gray-400">Настройка реалистичного голосового синтеза</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🧠 OpenAI API</h3>
              <p className="text-gray-400">Подключение к GPT для улучшенного мышления</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📱 SMS API</h3>
              <p className="text-gray-400">Настройка отправки SMS для авторизации</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🌐 Веб-скрапинг</h3>
              <p className="text-gray-400">Настройка автоматического изучения информации</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default APISettings;
