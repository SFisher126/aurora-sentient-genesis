
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const Memory = () => {
  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">🧠 Память Анюты</h1>
            <p className="text-gray-400">Здесь хранятся воспоминания и знания о вас</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">📝 Персональные факты</h3>
              <p className="text-gray-400">Информация о ваших предпочтениях, интересах и важных событиях</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">💬 История разговоров</h3>
              <p className="text-gray-400">Контекст предыдущих бесед для поддержания непрерывности общения</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">❤️ Эмоциональная карта</h3>
              <p className="text-gray-400">Анализ ваших эмоций и настроений в разные моменты</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Цели и планы</h3>
              <p className="text-gray-400">Ваши цели, мечты и планы на будущее</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Memory;
