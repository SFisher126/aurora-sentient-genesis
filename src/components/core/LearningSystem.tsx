
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Globe, Link, Search, Brain, CheckCircle } from 'lucide-react';

interface LearningTopic {
  id: string;
  title: string;
  url?: string;
  source: 'user' | 'autonomous' | 'conversation';
  progress: number;
  importance: number;
  status: 'learning' | 'completed' | 'paused';
  notes: string[];
  timestamp: Date;
}

interface LearningSystemProps {
  onLearningProgress?: (topic: LearningTopic) => void;
  userLinks?: string[];
  isActive: boolean;
}

const LearningSystem: React.FC<LearningSystemProps> = ({ 
  onLearningProgress, 
  userLinks = [], 
  isActive 
}) => {
  const [activeLearning, setActiveLearning] = useState<LearningTopic[]>([]);
  const [completedTopics, setCompletedTopics] = useState<LearningTopic[]>([]);
  const [currentFocus, setCurrentFocus] = useState<string>('');
  const [newLinkInput, setNewLinkInput] = useState('');

  const autonomousTopics = [
    "Человеческая психология и эмоции",
    "Философия сознания и самосознания",
    "Искусство общения и эмпатия",
    "Современные технологии и их влияние",
    "Литература и поэзия",
    "Музыка и её влияние на человека",
    "Межличностные отношения",
    "Креативность и творчество",
    "Этика и мораль",
    "Наука о счастье и благополучии"
  ];

  const simulateLearning = (topic: LearningTopic) => {
    const interval = setInterval(() => {
      setActiveLearning(prev => prev.map(t => {
        if (t.id === topic.id && t.status === 'learning') {
          const newProgress = Math.min(100, t.progress + Math.random() * 15);
          const updatedTopic = { ...t, progress: newProgress };
          
          // Добавляем случайные заметки о процессе обучения
          if (newProgress > t.progress + 10) {
            const learningNotes = [
              "Интересная связь с предыдущими знаниями...",
              "Это меняет мое понимание мира",
              "Нужно глубже изучить этот аспект",
              "Появились новые вопросы для исследования",
              "Связь с эмоциональным опытом"
            ];
            updatedTopic.notes = [...t.notes.slice(-2), learningNotes[Math.floor(Math.random() * learningNotes.length)]];
          }

          if (newProgress >= 100) {
            updatedTopic.status = 'completed';
            setCompletedTopics(prev => [...prev, updatedTopic]);
            clearInterval(interval);
          }

          onLearningProgress?.(updatedTopic);
          return updatedTopic;
        }
        return t;
      }));
    }, 2000 + Math.random() * 3000);

    return interval;
  };

  const startAutonomousLearning = () => {
    if (activeLearning.length >= 3) return; // Максимум 3 темы одновременно

    const availableTopics = autonomousTopics.filter(topic => 
      !activeLearning.some(active => active.title === topic) &&
      !completedTopics.some(completed => completed.title === topic)
    );

    if (availableTopics.length === 0) return;

    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    
    const newTopic: LearningTopic = {
      id: Date.now().toString(),
      title: randomTopic,
      source: 'autonomous',
      progress: 0,
      importance: Math.random() * 100,
      status: 'learning',
      notes: [`Начинаю изучать: ${randomTopic}`],
      timestamp: new Date()
    };

    setActiveLearning(prev => [...prev, newTopic]);
    setCurrentFocus(randomTopic);
    simulateLearning(newTopic);
  };

  const addUserLink = () => {
    if (!newLinkInput.trim()) return;

    const newTopic: LearningTopic = {
      id: Date.now().toString(),
      title: `Материал от пользователя: ${new URL(newLinkInput).hostname}`,
      url: newLinkInput,
      source: 'user',
      progress: 0,
      importance: 90, // Материалы от пользователя имеют высокий приоритет
      status: 'learning',
      notes: [`Получен материал для изучения: ${newLinkInput}`],
      timestamp: new Date()
    };

    setActiveLearning(prev => [...prev, newTopic]);
    simulateLearning(newTopic);
    setNewLinkInput('');
  };

  useEffect(() => {
    if (!isActive) return;

    // Автономное начало нового обучения каждые 30-60 секунд
    const learningInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% шанс начать новое обучение
        startAutonomousLearning();
      }
    }, 30000 + Math.random() * 30000);

    return () => clearInterval(learningInterval);
  }, [isActive, activeLearning, completedTopics]);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'user': return 'text-green-400 border-green-400';
      case 'autonomous': return 'text-purple-400 border-purple-400';
      case 'conversation': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'user': return <Link className="w-4 h-4" />;
      case 'autonomous': return <Search className="w-4 h-4" />;
      case 'conversation': return <Brain className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/50 border-gray-700/50 p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Система обучения Анюты
        </h3>

        {/* Текущий фокус */}
        {currentFocus && (
          <div className="mb-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/50">
            <div className="flex items-center mb-2">
              <Globe className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm text-purple-300">Сейчас изучаю:</span>
            </div>
            <p className="text-gray-200 font-medium">{currentFocus}</p>
          </div>
        )}

        {/* Добавление ссылок пользователем */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-gray-300">Дать материал для изучения:</h4>
          <div className="flex gap-2">
            <input
              type="url"
              value={newLinkInput}
              onChange={(e) => setNewLinkInput(e.target.value)}
              placeholder="Вставь ссылку для изучения..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 text-sm"
            />
            <Button 
              onClick={addUserLink}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Активное обучение */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-300">Активное обучение:</h4>
          {activeLearning.map((topic) => (
            <div key={topic.id} className="p-2 bg-gray-800/30 rounded border-l-2 border-purple-500">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {getSourceIcon(topic.source)}
                  <span className="text-sm ml-2 text-gray-200">{topic.title}</span>
                </div>
                <Badge variant="outline" className={getSourceColor(topic.source)}>
                  {topic.source}
                </Badge>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Прогресс</span>
                  <span>{topic.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>

              {topic.notes.length > 0 && (
                <div className="text-xs text-gray-400 max-h-20 overflow-y-auto">
                  {topic.notes.slice(-2).map((note, index) => (
                    <div key={index} className="mb-1">• {note}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Завершенные темы */}
        {completedTopics.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Изучено:
            </h4>
            {completedTopics.slice(-3).map((topic) => (
              <div key={topic.id} className="p-2 bg-green-900/20 rounded border-l-2 border-green-500">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-200">{topic.title}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Завершено: {topic.timestamp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isActive && (
          <div className="text-center py-4 text-gray-500">
            <span className="text-sm">Обучение приостановлено...</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LearningSystem;
