
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Link, Search, Brain, CheckCircle, Globe } from 'lucide-react';
import { useRealAI } from '../../hooks/useRealAI';

interface LearningTopic {
  id: string;
  title: string;
  url?: string;
  source: 'user' | 'autonomous';
  progress: number;
  status: 'learning' | 'completed';
  timestamp: Date;
}

interface RealLearningSystemProps {
  isActive: boolean;
  hasApiKey: boolean;
}

const RealLearningSystem: React.FC<RealLearningSystemProps> = ({ isActive, hasApiKey }) => {
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [isLearning, setIsLearning] = useState(false);
  
  const { learnFromUrl } = useRealAI();

  const addLearningUrl = async () => {
    if (!newUrl.trim() || !hasApiKey) return;

    const newTopic: LearningTopic = {
      id: Date.now().toString(),
      title: `Изучаю: ${new URL(newUrl).hostname}`,
      url: newUrl,
      source: 'user',
      progress: 0,
      status: 'learning',
      timestamp: new Date()
    };

    setLearningTopics(prev => [...prev, newTopic]);
    setIsLearning(true);

    try {
      await learnFromUrl(newUrl);
      
      setLearningTopics(prev => prev.map(topic => 
        topic.id === newTopic.id 
          ? { ...topic, progress: 100, status: 'completed' as const }
          : topic
      ));
    } catch (error) {
      console.error('Ошибка обучения:', error);
    } finally {
      setIsLearning(false);
      setNewUrl('');
    }
  };

  if (!hasApiKey) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 p-6">
        <div className="text-center text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3" />
          <p>Система обучения недоступна без API ключа</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700/50 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        Настоящее обучение Анюты
      </h3>

      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2 text-gray-300">Дать материал для изучения:</h4>
        <div className="flex gap-2">
          <Input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Вставь ссылку на статью, блог..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
            disabled={isLearning}
          />
          <Button 
            onClick={addLearningUrl}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLearning || !newUrl.trim()}
          >
            {isLearning ? <Brain className="w-4 h-4 animate-pulse" /> : <Link className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Анюта изучит содержимое и запомнит его навсегда
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">История обучения:</h4>
        {learningTopics.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <span className="text-sm">Пока ничего не изучено</span>
          </div>
        ) : (
          learningTopics.map((topic) => (
            <div key={topic.id} className="p-2 bg-gray-800/30 rounded border-l-2 border-blue-500">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-200">{topic.title}</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {topic.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : 'обучается...'}
                </Badge>
              </div>
              {topic.url && (
                <div className="text-xs text-gray-400 break-all">{topic.url}</div>
              )}
              <div className="text-xs text-gray-500">
                {topic.timestamp.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {!isActive && (
        <div className="text-center py-4 text-gray-500">
          <span className="text-sm">Анюта спит... обучение приостановлено</span>
        </div>
      )}
    </Card>
  );
};

export default RealLearningSystem;
