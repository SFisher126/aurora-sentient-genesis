
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const Learning = () => {
  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">📚 Обучение</h1>
            <p className="text-gray-400">Анюта постоянно учится и развивается</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🤖 Машинное обучение</h3>
              <p className="text-gray-400 mb-4">Локальное обучение с использованием TensorFlow</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🌐 Веб-скрапинг</h3>
              <p className="text-gray-400 mb-4">Автоматический поиск и изучение информации</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">❤️ Эмоциональный интеллект</h3>
              <p className="text-gray-400 mb-4">Распознавание эмоций по тексту и голосу</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-pink-600 h-2 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Learning;
