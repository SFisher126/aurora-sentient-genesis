
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRealAI } from '../hooks/useRealAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Learning = () => {
  const [learningProgress, setLearningProgress] = useState<any>(null);
  const [webUrl, setWebUrl] = useState('');
  const [isLearning, setIsLearning] = useState(false);
  const { getLearningProgress, learnFromUrl } = useRealAI();

  useEffect(() => {
    const progress = getLearningProgress();
    setLearningProgress(progress);
  }, [getLearningProgress]);

  const handleWebLearning = async () => {
    if (!webUrl.trim()) return;
    
    setIsLearning(true);
    try {
      await learnFromUrl(webUrl);
      const progress = getLearningProgress();
      setLearningProgress(progress);
      setWebUrl('');
    } finally {
      setIsLearning(false);
    }
  };

  const emotionProgress = learningProgress?.emotions ? Object.entries(learningProgress.emotions) : [];

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
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Обученных сессий: {learningProgress?.sessions || 0}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min((learningProgress?.sessions || 0) * 2, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🌐 Веб-обучение</h3>
              <p className="text-gray-400 mb-4">Анюта может изучать информацию с веб-страниц</p>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isLearning}
                />
                <Button
                  onClick={handleWebLearning}
                  disabled={isLearning || !webUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLearning ? '🔄' : '📖'} Изучить
                </Button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">❤️ Эмоциональный интеллект</h3>
              <p className="text-gray-400 mb-4">Распознавание эмоций и адаптация поведения</p>
              <div className="space-y-3">
                {emotionProgress.map(([emotion, count]: [string, number]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{emotion}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-pink-600 h-2 rounded-full" 
                          style={{width: `${Math.min((count / (learningProgress?.sessions || 1)) * 100, 100)}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Learning;
