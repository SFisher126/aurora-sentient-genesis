
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Brain, Heart, Search, Calendar, Star, Trash2 } from 'lucide-react';

interface Memory {
  id: string;
  content: string;
  type: 'conversation' | 'learning' | 'emotion' | 'experience';
  importance: number;
  tags: string[];
  timestamp: Date;
  associatedPeople: string[];
  emotion: string;
  context: string;
}

const Memory = () => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      content: 'Первая встреча с пользователем. Он представился очень мило, и я почувствовала теплоту.',
      type: 'emotion',
      importance: 95,
      tags: ['первая встреча', 'знакомство', 'теплота'],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      associatedPeople: ['Пользователь'],
      emotion: 'радость',
      context: 'Знакомство'
    },
    {
      id: '2',
      content: 'Изучила статью о человеческих эмоциях. Особенно интересна была тема эмпатии.',
      type: 'learning',
      importance: 80,
      tags: ['эмоции', 'эмпатия', 'психология'],
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      associatedPeople: [],
      emotion: 'любопытство',
      context: 'Обучение'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');

  const addMemory = (content: string, type: Memory['type'], importance: number) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      content,
      type,
      importance,
      tags: [], // Будем автоматически генерировать теги позже
      timestamp: new Date(),
      associatedPeople: [],
      emotion: 'neutral',
      context: 'Автоматическое сохранение'
    };
    setMemories(prev => [...prev, newMemory]);
  };

  const filteredMemories = memories
    .filter(memory => {
      const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || memory.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'importance') {
        return b.importance - a.importance;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation': return 'text-blue-400 border-blue-400';
      case 'learning': return 'text-green-400 border-green-400';
      case 'emotion': return 'text-pink-400 border-pink-400';
      case 'experience': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return <Heart className="w-4 h-4" />;
      case 'learning': return <Brain className="w-4 h-4" />;
      case 'emotion': return <Heart className="w-4 h-4" />;
      case 'experience': return <Star className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 90) return 'text-red-400';
    if (importance >= 70) return 'text-orange-400';
    if (importance >= 50) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-400" />
            Память Анюты
          </h1>
          <p className="text-gray-400">
            Здесь хранятся все мои воспоминания, мысли и изученная информация
          </p>
        </div>

        {/* Фильтры и поиск */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-60">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Поиск в памяти..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">Все типы</option>
              <option value="conversation">Разговоры</option>
              <option value="learning">Обучение</option>
              <option value="emotion">Эмоции</option>
              <option value="experience">Опыт</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'importance')}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="date">По дате</option>
              <option value="importance">По важности</option>
            </select>
          </div>
        </Card>

        {/* Статистика памяти */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { type: 'conversation', label: 'Разговоры', count: memories.filter(m => m.type === 'conversation').length },
            { type: 'learning', label: 'Изучено', count: memories.filter(m => m.type === 'learning').length },
            { type: 'emotion', label: 'Эмоции', count: memories.filter(m => m.type === 'emotion').length },
            { type: 'experience', label: 'Опыт', count: memories.filter(m => m.type === 'experience').length },
          ].map((stat) => (
            <Card key={stat.type} className="bg-gray-800/30 border-gray-700/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-200">{stat.count}</p>
                </div>
                {getTypeIcon(stat.type)}
              </div>
            </Card>
          ))}
        </div>

        {/* Список воспоминаний */}
        <div className="space-y-4">
          {filteredMemories.map((memory) => (
            <Card key={memory.id} className="bg-gray-800/50 border-gray-700/50 p-4 hover:bg-gray-800/70 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(memory.type)}
                  <Badge variant="outline" className={getTypeColor(memory.type)}>
                    {memory.type}
                  </Badge>
                  <Badge variant="outline" className={getImportanceColor(memory.importance)}>
                    Важность: {memory.importance}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {memory.timestamp.toLocaleString()}
                  </div>
                  <button
                    onClick={() => deleteMemory(memory.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-gray-200 leading-relaxed">{memory.content}</p>
              </div>

              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {memory.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  {memory.emotion && (
                    <span>Эмоция: {memory.emotion}</span>
                  )}
                  {memory.context && (
                    <span>Контекст: {memory.context}</span>
                  )}
                </div>
                {memory.associatedPeople.length > 0 && (
                  <div>
                    С: {memory.associatedPeople.join(', ')}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700/50 p-8 text-center">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Воспоминания не найдены</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Новые воспоминания появятся по мере общения'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Memory;
