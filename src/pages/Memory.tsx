
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRealAI } from '../hooks/useRealAI';
import { authService } from '../services/authService';

const Memory = () => {
  const [personalMemory, setPersonalMemory] = useState<any>(null);
  const { getPersonalMemory } = useRealAI();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const memory = getPersonalMemory(user.id);
      setPersonalMemory(memory);
    }
  }, [getPersonalMemory]);

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
              {personalMemory?.facts?.length > 0 ? (
                <ul className="space-y-2">
                  {personalMemory.facts.map((fact: string, index: number) => (
                    <li key={index} className="text-gray-300">• {fact}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Анюта еще изучает ваши предпочтения...</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">💬 История разговоров</h3>
              {personalMemory?.conversationHistory?.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-gray-300">Всего сессий: {personalMemory.conversationHistory.length}</p>
                  <p className="text-gray-300">Последний разговор: {new Date(personalMemory.conversationHistory[personalMemory.conversationHistory.length - 1]?.timestamp).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-gray-400">Начните общение, чтобы создать историю</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">❤️ Эмоциональная карта</h3>
              {personalMemory?.emotionalProfile ? (
                <div className="space-y-2">
                  <p className="text-gray-300">Доминирующая эмоция: <span className="text-purple-400">{personalMemory.emotionalProfile.dominantEmotion}</span></p>
                  <p className="text-gray-300">Записей: {personalMemory.emotionalProfile.emotionalHistory.length}</p>
                </div>
              ) : (
                <p className="text-gray-400">Анюта анализирует ваши эмоции в разговоре</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Цели и планы</h3>
              <p className="text-gray-400">Функция в разработке...</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Memory;
