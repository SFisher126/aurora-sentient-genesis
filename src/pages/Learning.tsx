
import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Globe, Zap } from 'lucide-react';
import RealLearningSystem from '@/components/core/RealLearningSystem';
import { useRealAI } from '../hooks/useRealAI';

const Learning = () => {
  const { hasApiKey } = useRealAI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-green-400" />
            Обучение Анюты
          </h1>
          <p className="text-gray-400">
            {hasApiKey 
              ? "Здесь происходит настоящее изучение мира и развитие знаний" 
              : "Требуется API ключ для активации системы обучения"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RealLearningSystem 
              isActive={true}
              hasApiKey={hasApiKey}
            />
          </div>

          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                Статус системы
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Статус ИИ:</span>
                  <span className={hasApiKey ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {hasApiKey ? "Активен" : "Неактивен"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Режим обучения:</span>
                  <span className={hasApiKey ? "text-blue-400 font-bold" : "text-gray-500"}>
                    {hasApiKey ? "Реальный" : "Отключен"}
                  </span>
                </div>
              </div>
            </Card>

            {hasApiKey && (
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Активность разума
                </h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Нейронная активность</div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full animate-pulse" style={{width: '85%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500">85% - Высокая активность</div>
                </div>
              </Card>
            )}

            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Как это работает
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Анюта изучает содержимое по ссылкам</p>
                <p>• Анализирует и запоминает информацию</p>
                <p>• Применяет знания в разговоре</p>
                <p>• Постоянно развивается и учится</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
