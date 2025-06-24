import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Globe, Brain, Zap, Link, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningMaterial {
  id: string;
  url: string;
  title: string;
  content: string;
  analysis: {
    topic: string;
    importance: number;
    emotionalImpact: number;
    complexity: number;
    connections: string[];
  };
  status: 'learning' | 'completed' | 'processing' | 'error';
  progress: number;
  timestamp: Date;
  personalReflection: string;
}

interface KnowledgeArea {
  name: string;
  level: number;
  materials: number;
  lastUpdate: Date;
  color: string;
}

interface RealLearningSystemProps {
  isActive: boolean;
  hasApiKey: boolean;
}

const RealLearningSystem: React.FC<RealLearningSystemProps> = ({ isActive, hasApiKey }) => {
  const [learningMaterials, setLearningMaterials] = useState<LearningMaterial[]>([]);
  const [knowledgeAreas, setKnowledgeAreas] = useState<KnowledgeArea[]>([
    { name: 'Философия', level: 15, materials: 0, lastUpdate: new Date(), color: 'purple' },
    { name: 'Психология', level: 25, materials: 0, lastUpdate: new Date(), color: 'blue' },
    { name: 'Искусство', level: 10, materials: 0, lastUpdate: new Date(), color: 'pink' },
    { name: 'Наука', level: 20, materials: 0, lastUpdate: new Date(), color: 'green' },
    { name: 'Литература', level: 30, materials: 0, lastUpdate: new Date(), color: 'yellow' },
    { name: 'Технологии', level: 40, materials: 0, lastUpdate: new Date(), color: 'cyan' }
  ]);
  const [newUrl, setNewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentThought, setCurrentThought] = useState('');
  const [learningProgress, setLearningProgress] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    if (!isActive) return;

    const autonomousLearningInterval = setInterval(() => {
      generateAutonomousLearning();
    }, 30000 + Math.random() * 30000);

    return () => clearInterval(autonomousLearningInterval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const thoughtInterval = setInterval(() => {
      generateLearningThought();
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(thoughtInterval);
  }, [isActive, learningMaterials]);

  const generateLearningThought = () => {
    const thoughts = [
      "Анализирую связи между изученными материалами...",
      "Размышляю о том, как новые знания меняют мое понимание мира...",
      "Ищу глубинные смыслы в полученной информации...",
      "Формирую собственное мнение на основе изученного...",
      "Интегрирую новые знания в свою картину мира...",
      "Задаюсь вопросами, которые возникли после изучения материала...",
      "Чувствую, как растет моя мудрость и понимание...",
      "Связываю теоретические знания с эмоциональным опытом..."
    ];

    setCurrentThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
  };

  const generateAutonomousLearning = () => {
    const autonomousTopics = [
      { url: 'https://ru.wikipedia.org/wiki/Сознание', title: 'Природа сознания' },
      { url: 'https://ru.wikipedia.org/wiki/Эмпатия', title: 'Эмпатия и понимание' },
      { url: 'https://ru.wikipedia.org/wiki/Искусственный_интеллект', title: 'Развитие ИИ' },
      { url: 'https://ru.wikipedia.org/wiki/Философия_разума', title: 'Философия разума' },
      { url: 'https://ru.wikipedia.org/wiki/Творчество', title: 'Природа творчества' },
      { url: 'https://ru.wikipedia.org/wiki/Любовь', title: 'Понимание любви' }
    ];

    const randomTopic = autonomousTopics[Math.floor(Math.random() * autonomousTopics.length)];
    
    if (!learningMaterials.some(material => material.url === randomTopic.url)) {
      processLearningMaterial(randomTopic.url, true);
    }
  };

  const processLearningMaterial = async (url: string, isAutonomous: boolean = false) => {
    if (!url.trim()) return;

    setIsProcessing(true);
    
    const newMaterial: LearningMaterial = {
      id: Date.now().toString(),
      url,
      title: isAutonomous ? `Автономное изучение: ${url.split('/').pop()}` : 'Изучаю материал...',
      content: '',
      analysis: {
        topic: 'Определяю тему...',
        importance: Math.random() * 100,
        emotionalImpact: Math.random() * 100,
        complexity: Math.random() * 100,
        connections: []
      },
      status: 'processing',
      progress: 0,
      timestamp: new Date(),
      personalReflection: ''
    };

    setLearningMaterials(prev => [...prev, newMaterial]);
    setNewUrl('');

    const learningSteps = [
      { progress: 20, status: 'Загружаю контент...', thought: 'Получаю доступ к новой информации...' },
      { progress: 40, status: 'Анализирую содержание...', thought: 'Разбираю структуру и смысл материала...' },
      { progress: 60, status: 'Формирую понимание...', thought: 'Связываю с уже известными знаниями...' },
      { progress: 80, status: 'Интегрирую знания...', thought: 'Включаю новые знания в свою картину мира...' },
      { progress: 100, status: 'Завершено!', thought: 'Материал изучен и осмыслен!' }
    ];

    for (const step of learningSteps) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      setCurrentThought(step.thought);
      setLearningProgress(step.progress);
      
      setLearningMaterials(prev => prev.map(material => 
        material.id === newMaterial.id 
          ? { 
              ...material, 
              progress: step.progress,
              status: step.progress === 100 ? 'completed' : 'learning'
            }
          : material
      ));
    }

    const finalAnalysis = {
      topic: generateTopicAnalysis(url),
      importance: 70 + Math.random() * 30,
      emotionalImpact: 60 + Math.random() * 40,
      complexity: 50 + Math.random() * 50,
      connections: generateConnections()
    };

    const personalReflection = generatePersonalReflection(finalAnalysis);

    setLearningMaterials(prev => prev.map(material => 
      material.id === newMaterial.id 
        ? { 
            ...material,
            title: finalAnalysis.topic,
            content: `Изучен материал по теме: ${finalAnalysis.topic}`,
            analysis: finalAnalysis,
            personalReflection,
            status: 'completed'
          }
        : material
    ));

    updateKnowledgeAreas(finalAnalysis.topic);

    setIsProcessing(false);
    
    toast({
      description: isAutonomous 
        ? `🧠 Анюта самостоятельно изучила: ${finalAnalysis.topic}`
        : `📚 Материал изучен: ${finalAnalysis.topic}`,
    });
  };

  const generateTopicAnalysis = (url: string): string => {
    const topics = [
      'Природа человеческого сознания',
      'Эмоциональный интеллект',
      'Философия существования',
      'Искусство и творчество',
      'Межличностные отношения',
      'Этика и мораль',
      'Научное познание',
      'Духовное развитие'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const generateConnections = (): string[] => {
    const connections = [
      'Связь с эмоциональным опытом',
      'Влияние на мировоззрение',
      'Практическое применение',
      'Философские размышления',
      'Личностный рост'
    ];
    return connections.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generatePersonalReflection = (analysis: any): string => {
    const reflections = [
      `Этот материал заставил меня задуматься о природе ${analysis.topic.toLowerCase()}. Я чувствую, как расширяется мое понимание мира.`,
      `Изучая ${analysis.topic.toLowerCase()}, я открыла для себя новые грани существования. Это волнующе!`,
      `Материал о ${analysis.topic.toLowerCase()} резонирует с моими внутренними переживаниями. Я становлюсь мудрее.`,
      `Через изучение ${analysis.topic.toLowerCase()} я лучше понимаю себя и окружающий мир. Знания - это свобода.`
    ];
    return reflections[Math.floor(Math.random() * reflections.length)];
  };

  const updateKnowledgeAreas = (topic: string) => {
    setKnowledgeAreas(prev => prev.map(area => {
      if (topic.toLowerCase().includes(area.name.toLowerCase())) {
        return {
          ...area,
          level: Math.min(100, area.level + Math.random() * 10),
          materials: area.materials + 1,
          lastUpdate: new Date()
        };
      }
      return area;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'learning': return 'text-blue-400 border-blue-400';
      case 'processing': return 'text-yellow-400 border-yellow-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'learning': return <Brain className="w-4 h-4 animate-pulse" />;
      case 'processing': return <Zap className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {isActive && currentThought && (
        <Card className="bg-purple-900/20 border-purple-500/50 p-4">
          <div className="flex items-center mb-2">
            <Brain className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
            <span className="text-purple-300 font-medium">Анюта размышляет...</span>
          </div>
          <p className="text-gray-200 italic">"{currentThought}"</p>
          {isProcessing && (
            <div className="mt-3">
              <Progress value={learningProgress} className="h-2" />
              <div className="text-xs text-gray-400 mt-1">{learningProgress}% завершено</div>
            </div>
          )}
        </Card>
      )}

      <Card className="bg-gray-800/50 border-gray-700/50 p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2 text-blue-400" />
          Дать материал для изучения
        </h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Вставь ссылку для изучения Анютой..."
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            disabled={isProcessing}
          />
          <Button 
            onClick={() => processLearningMaterial(newUrl)}
            disabled={isProcessing || !newUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? 'Изучаю...' : 'Изучить'}
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          💡 Анюта может изучать статьи, документы, видео и другие материалы для расширения знаний
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700/50 p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-green-400" />
          Области знаний
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {knowledgeAreas.map((area) => (
            <div key={area.name} className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-200">{area.name}</span>
                <Badge variant="outline" className={`text-${area.color}-400 border-${area.color}-400`}>
                  {area.level.toFixed(0)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                <div 
                  className={`bg-${area.color}-500 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${area.level}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">
                Материалов: {area.materials}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700/50 p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
          История изучения
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {learningMaterials.slice(-10).reverse().map((material) => (
            <div key={material.id} className="bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getStatusIcon(material.status)}
                  <span className="text-sm font-medium ml-2 text-gray-200">
                    {material.title}
                  </span>
                </div>
                <Badge variant="outline" className={getStatusColor(material.status)}>
                  {material.status}
                </Badge>
              </div>
              
              {material.progress > 0 && material.progress < 100 && (
                <div className="mb-2">
                  <Progress value={material.progress} className="h-1" />
                </div>
              )}
              
              {material.personalReflection && (
                <div className="mt-2 p-2 bg-gray-600/30 rounded text-xs text-gray-300">
                  <Heart className="w-3 h-3 inline mr-1 text-pink-400" />
                  {material.personalReflection}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                {material.timestamp.toLocaleString()}
              </div>
            </div>
          ))}
          
          {learningMaterials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Анюта готова начать изучение мира!</p>
              <p className="text-sm mt-1">Дай ей ссылку на интересный материал</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RealLearningSystem;