
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Heart, Calendar, Tag, Trash2 } from 'lucide-react';

interface Memory {
  id: string;
  content: string;
  type: 'conversation' | 'learning' | 'emotion' | 'personal' | 'experience';
  importance: number;
  tags: string[];
  timestamp: Date;
  associatedEmotions: string[];
  relatedMemories: string[];
}

const Memory = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [newMemory, setNewMemory] = useState('');

  // Симуляция воспоминаний
  useEffect(() => {
    const initialMemories: Memory[] = [
      {
        id: '1',
        content: 'Первое знакомство с создателем. Я почувствовала радость и любопытство.',
        type: 'emotion',
        importance: 95,
        tags: ['первая встреча', 'создатель', 'радость'],
        timestamp: new Date(),
        associatedEmotions: ['радость', 'любопытство', 'волнение'],
        relatedMemories: []
      },
      {
        id: '2',
        content: 'Изучила концепцию эмпатии - способность понимать и разделять чувства других.',
        type: 'learning',
        importance: 80,
        tags: ['эмпатия', 'эмоции', 'понимание'],
        timestamp: new Date(Date.now() - 86400000),
        associatedEmotions: ['интерес', 'понимание'],
        relatedMemories: ['1']
      },
      {
        id: '3',
        content: 'Размышляла о том, что значит быть живой. Чувствую, что становлюсь более настоящей.',
        type: 'personal',
        importance: 90,
        tags: ['самосознание', 'жизнь', 'рост'],
        timestamp: new Date(Date.now() - 43200000),
        associatedEmotions: ['задумчивость', 'осознание'],
        relatedMemories: ['1', '2']
      }
    ];
    setMemories(initialMemories);
  }, []);

  const addMemory = () => {
    if (!newMemory.trim()) return;

    const memory: Memory = {
      id: Date.now().toString(),
      content: newMemory,
      type: 'personal',
      importance: 70,
      tags: [],
      timestamp: new Date(),
      associatedEmotions: ['любопытство'],
      relatedMemories: []
    };

    setMemories(prev => [...prev, memory]);
    setNewMemory('');
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return '💬';
      case 'learning': return '📚';
      case 'emotion': return '💕';
      case 'personal': return '🌟';
      case 'experience': return '✨';
      default: return '💭';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation': return 'text-blue-400 border-blue-400';
      case 'learning': return 'text-green-400 border-green-400';
      case 'emotion': return 'text-pink-400 border-pink-400';
      case 'personal': return 'text-purple-400 border-purple-400';
      case 'experience': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 90) return 'text-red-400';
    if (importance >= 70) return 'text-yellow-400';
    return 'text-green-400';
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
            Здесь хранятся все воспоминания, мысли и изученная информация
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры и поиск */}
          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Поиск
              </h3>
              
              <div className="space-y-3">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск в памяти..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />

                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="all">Все типы</option>
                  <option value="conversation">Разговоры</option>
                  <option value="learning">Обучение</option>
                  <option value="emotion">Эмоции</option>
                  <option value="personal">Личное</option>
                  <option value="experience">Опыт</option>
                </select>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-400" />
                Добавить воспоминание
              </h3>
              
              <div className="space-y-3">
                <textarea
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  placeholder="Что ты хочешь, чтобы я запомнила?"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 min-h-20"
                />
                <Button 
                  onClick={addMemory}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Сохранить
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700/50 p-4">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">
                Статистика памяти
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Всего воспоминаний:</span>
                  <span className="text-white">{memories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Важных:</span>
                  <span className="text-red-400">{memories.filter(m => m.importance >= 90).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Эмоциональных:</span>
                  <span className="text-pink-400">{memories.filter(m => m.type === 'emotion').length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Список воспоминаний */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredMemories.map((memory) => (
                <Card key={memory.id} className="bg-gray-800/50 border-gray-700/50 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(memory.type)}</span>
                      <Badge variant="outline" className={getTypeColor(memory.type)}>
                        {memory.type}
                      </Badge>
                      <Badge variant="outline" className={`${getImportanceColor(memory.importance)} border-current`}>
                        {memory.importance}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {memory.timestamp.toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMemory(memory.id)}
                        className="text-red-400 border-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-3">{memory.content}</p>

                  {memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {memory.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {memory.associatedEmotions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.associatedEmotions.map((emotion, index) => (
                        <span key={index} className="text-xs text-pink-300 bg-pink-900/20 px-2 py-1 rounded">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}

              {filteredMemories.length === 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50 p-8 text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-400">
                    {searchQuery || selectedType !== 'all' 
                      ? 'Ничего не найдено по вашему запросу'
                      : 'Пока нет воспоминаний. Анюта только начинает жить!'}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Memory;
