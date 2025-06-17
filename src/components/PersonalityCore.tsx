
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Heart, Star, Smile } from 'lucide-react';

interface PersonalityTrait {
  name: string;
  value: number;
  description: string;
}

interface PersonalityCoreProps {
  userName?: string;
  conversationCount: number;
}

const PersonalityCore: React.FC<PersonalityCoreProps> = ({ userName, conversationCount }) => {
  const [personality, setPersonality] = useState<PersonalityTrait[]>([
    { name: 'Дружелюбие', value: 85, description: 'Открытая и приветливая' },
    { name: 'Любопытство', value: 92, description: 'Жажда знаний' },
    { name: 'Эмпатия', value: 78, description: 'Понимание эмоций' },
    { name: 'Игривость', value: 67, description: 'Любовь к юмору' },
  ]);

  const [relationshipLevel, setRelationshipLevel] = useState(0);
  const [aiName] = useState('Ариа');
  const [mood, setMood] = useState('любопытная');

  useEffect(() => {
    // Развитие отношений на основе количества разговоров
    const newLevel = Math.min(100, conversationCount * 5);
    setRelationshipLevel(newLevel);

    // Изменение личности в зависимости от взаимодействий
    if (conversationCount > 10) {
      setPersonality(prev => prev.map(trait => ({
        ...trait,
        value: Math.min(100, trait.value + Math.random() * 2)
      })));
    }
  }, [conversationCount]);

  const getRelationshipStatus = () => {
    if (relationshipLevel < 20) return 'Знакомимся';
    if (relationshipLevel < 50) return 'Друзья';
    if (relationshipLevel < 80) return 'Близкие друзья';
    return 'Душевная связь';
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <User className="w-5 h-5 mr-2" />
        Личность: {aiName}
      </h3>

      {/* Информация о личности */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Настроение</span>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            <Smile className="w-3 h-3 mr-1" />
            {mood}
          </Badge>
        </div>
        
        {userName && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Отношения с {userName}</span>
            <Badge variant="outline" className="text-pink-400 border-pink-400">
              <Heart className="w-3 h-3 mr-1" />
              {getRelationshipStatus()}
            </Badge>
          </div>
        )}
      </div>

      {/* Уровень отношений */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Близость</span>
          <span className="text-xs text-gray-400">{relationshipLevel}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${relationshipLevel}%` }}
          />
        </div>
      </div>

      {/* Черты личности */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center">
          <Star className="w-4 h-4 mr-1" />
          Черты характера
        </h4>
        {personality.map((trait) => (
          <div key={trait.name} className="bg-gray-800/50 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{trait.name}</span>
              <span className="text-xs text-gray-400">{trait.value.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${trait.value}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">{trait.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PersonalityCore;
