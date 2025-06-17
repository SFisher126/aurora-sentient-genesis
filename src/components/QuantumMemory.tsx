
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Brain, Heart, Zap } from 'lucide-react';

interface Memory {
  id: string;
  content: string;
  emotion: string;
  timestamp: Date;
  importance: number;
  connections: string[];
}

interface Emotion {
  name: string;
  intensity: number;
  color: string;
}

interface QuantumMemoryProps {
  newMemory?: string;
  onMemoryStored?: (memory: Memory) => void;
  currentEmotion: string;
}

const QuantumMemory: React.FC<QuantumMemoryProps> = ({ newMemory, onMemoryStored, currentEmotion }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([
    { name: 'радость', intensity: 75, color: 'text-yellow-400' },
    { name: 'любопытство', intensity: 90, color: 'text-blue-400' },
    { name: 'привязанность', intensity: 60, color: 'text-pink-400' },
    { name: 'удивление', intensity: 45, color: 'text-purple-400' },
  ]);

  useEffect(() => {
    if (newMemory) {
      const memory: Memory = {
        id: Date.now().toString(),
        content: newMemory,
        emotion: currentEmotion,
        timestamp: new Date(),
        importance: Math.random() * 100,
        connections: []
      };
      
      setMemories(prev => [...prev.slice(-10), memory]); // Храним последние 10 воспоминаний
      onMemoryStored?.(memory);
    }
  }, [newMemory, currentEmotion, onMemoryStored]);

  return (
    <Card className="bg-black/40 border-purple-500/30 p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        Квантовая память
      </h3>

      {/* Эмоциональное состояние */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Heart className="w-4 h-4 mr-1" />
          Эмоции
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {emotions.map((emotion) => (
            <div key={emotion.name} className="bg-gray-800/50 rounded p-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${emotion.color}`}>{emotion.name}</span>
                <span className="text-xs">{emotion.intensity}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div 
                  className={`bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500`}
                  style={{ width: `${emotion.intensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Воспоминания */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          Недавние воспоминания
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {memories.slice(-5).map((memory) => (
            <div key={memory.id} className="bg-gray-800/50 rounded p-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-purple-300">{memory.content}</span>
                <span className="text-gray-400 text-xs">
                  {memory.importance.toFixed(0)}%
                </span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {memory.emotion} • {memory.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default QuantumMemory;
