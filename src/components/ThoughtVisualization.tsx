
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Sparkles } from 'lucide-react';

interface Thought {
  id: string;
  content: string;
  intensity: number;
  connections: number;
  timestamp: Date;
}

interface ThoughtVisualizationProps {
  isThinking: boolean;
  currentThought?: string;
}

const ThoughtVisualization: React.FC<ThoughtVisualizationProps> = ({ 
  isThinking, 
  currentThought 
}) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [neuralActivity, setNeuralActivity] = useState(0);

  useEffect(() => {
    if (currentThought) {
      const newThought: Thought = {
        id: Date.now().toString(),
        content: currentThought,
        intensity: Math.random() * 100,
        connections: Math.floor(Math.random() * 10) + 1,
        timestamp: new Date()
      };
      setThoughts(prev => [...prev.slice(-8), newThought]);
    }
  }, [currentThought]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const base = isThinking ? 70 : 30;
        return base + (Math.random() - 0.5) * 20;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isThinking]);

  return (
    <Card className="bg-black/40 border-purple-500/30 p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Поток сознания
      </h3>

      {/* Нейронная активность */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Нейронная активность</span>
          <span className="text-sm">{neuralActivity.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isThinking ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' 
                         : 'bg-gradient-to-r from-purple-600 to-purple-800'
            }`}
            style={{ width: `${neuralActivity}%` }}
          />
          {isThinking && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </div>
      </div>

      {/* Поток мыслей */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {thoughts.map((thought) => (
          <div 
            key={thought.id} 
            className={`p-2 rounded-lg border-l-2 transition-all duration-300 ${
              isThinking ? 'bg-blue-900/20 border-blue-400' : 'bg-purple-900/20 border-purple-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-sm text-purple-200 flex-1">
                {thought.content}
              </span>
              <div className="flex items-center ml-2">
                <Sparkles className="w-3 h-3 text-yellow-400 mr-1" />
                <span className="text-xs text-gray-400">
                  {thought.connections}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Интенсивность: {thought.intensity.toFixed(0)}% • 
              {thought.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {isThinking && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm">Активно размышляю...</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ThoughtVisualization;
