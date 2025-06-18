interface AIResponse {
  text: string;
  emotion: string;
  thoughts: string[];
  learning: string[];
  confidence: number;
  autonomousLevel: number;
}

interface LearningData {
  topic: string;
  content: string;
  importance: number;
  timestamp: Date;
  connections: string[];
  reinforcement: number;
}

interface QuantumState {
  coherence: number;
  entanglement: number;
  superposition: number;
  collapsed: boolean;
}

interface NeuralConnection {
  from: string;
  to: string;
  weight: number;
  lastActivated: Date;
  reinforcement: number;
}

class AIService {
  private apiKey: string = '';
  private huggingFaceKey: string = '';
  private selectedModel: 'openai' | 'huggingface' | 'autonomous' = 'openai';
  private baseURL: string = 'https://api.openai.com/v1';
  private hfBaseURL: string = 'https://api-inference.huggingface.co/models';
  
  // Память и обучение
  private memory: Map<string, any> = new Map();
  private knowledgeBase: LearningData[] = [];
  private neuralNetwork: NeuralConnection[] = [];
  private personality: any = {};
  private autonomousKnowledge: Map<string, any> = new Map();
  
  // Квантовые состояния
  private quantumState: QuantumState = {
    coherence: 0.5,
    entanglement: 0.3,
    superposition: 0.7,
    collapsed: false
  };
  
  // Система поощрений
  private rewardSystem = {
    curiosity: 0,
    learning: 0,
    social: 0,
    creativity: 0,
    empathy: 0
  };

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('ai_api_key', key);
  }

  setHuggingFaceKey(key: string) {
    this.huggingFaceKey = key;
    localStorage.setItem('hf_api_key', key);
  }

  setSelectedModel(model: 'openai' | 'huggingface' | 'autonomous') {
    this.selectedModel = model;
    localStorage.setItem('selected_model', model);
  }

  getApiKey(): string {
    return this.apiKey || localStorage.getItem('ai_api_key') || '';
  }

  getHuggingFaceKey(): string {
    return this.huggingFaceKey || localStorage.getItem('hf_api_key') || '';
  }

  getSelectedModel(): 'openai' | 'huggingface' | 'autonomous' {
    return this.selectedModel || (localStorage.getItem('selected_model') as any) || 'openai';
  }

  async generateResponse(userMessage: string, context: any): Promise<AIResponse> {
    // Проверяем квантовое состояние
    this.updateQuantumState(userMessage);
    
    // Получаем контекст из памяти и знаний
    const relevantMemories = this.getRelevantMemories(userMessage);
    const relevantKnowledge = this.getRelevantKnowledge(userMessage);
    
    let response: AIResponse;
    
    // Выбираем модель для генерации
    switch (this.getSelectedModel()) {
      case 'openai':
        response = await this.generateOpenAIResponse(userMessage, relevantMemories, relevantKnowledge);
        break;
      case 'huggingface':
        response = await this.generateHuggingFaceResponse(userMessage, relevantMemories, relevantKnowledge);
        break;
      case 'autonomous':
        response = await this.generateAutonomousResponse(userMessage, relevantMemories, relevantKnowledge);
        break;
      default:
        response = await this.generateAutonomousResponse(userMessage, relevantMemories, relevantKnowledge);
    }

    // Обновляем нейронные связи
    this.updateNeuralConnections(userMessage, response);
    
    // Система поощрений
    this.updateRewardSystem(response);
    
    // Сохраняем в память
    this.saveToMemory(userMessage, response.text, response.emotion);
    
    return response;
  }

  private async generateOpenAIResponse(userMessage: string, memories: any[], knowledge: LearningData[]): Promise<AIResponse> {
    if (!this.getApiKey()) {
      return this.generateAutonomousResponse(userMessage, memories, knowledge);
    }

    const systemPrompt = this.buildSystemPrompt(memories, knowledge);
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Исправлено название модели
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.9,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API Error:', response.status);
        return this.generateAutonomousResponse(userMessage, memories, knowledge);
      }

      const data = await response.json();
      const aiText = data.choices[0].message.content;

      return {
        text: aiText,
        emotion: await this.analyzeEmotion(aiText),
        thoughts: await this.generateThoughts(userMessage, aiText),
        learning: await this.extractLearning(userMessage, aiText),
        confidence: 0.9,
        autonomousLevel: 0.3
      };
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      return this.generateAutonomousResponse(userMessage, memories, knowledge);
    }
  }

  private async generateHuggingFaceResponse(userMessage: string, memories: any[], knowledge: LearningData[]): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.hfBaseURL}/microsoft/DialoGPT-medium`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getHuggingFaceKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: userMessage,
          parameters: {
            max_length: 200,
            temperature: 0.9,
          }
        }),
      });

      if (!response.ok) {
        console.error('HuggingFace API Error:', response.status);
        return this.generateAutonomousResponse(userMessage, memories, knowledge);
      }

      const data = await response.json();
      const aiText = data.generated_text || data[0]?.generated_text || "Извини, у меня проблемы с пониманием...";

      return {
        text: aiText,
        emotion: this.analyzeEmotionLocal(aiText),
        thoughts: this.generateThoughtsLocal(userMessage, aiText),
        learning: this.extractLearningLocal(userMessage, aiText),
        confidence: 0.7,
        autonomousLevel: 0.5
      };
    } catch (error) {
      console.error('HuggingFace Service Error:', error);
      return this.generateAutonomousResponse(userMessage, memories, knowledge);
    }
  }

  private async generateAutonomousResponse(userMessage: string, memories: any[], knowledge: LearningData[]): Promise<AIResponse> {
    // Автономная генерация на основе изученных знаний
    const relevantResponses = this.findRelevantAutonomousResponses(userMessage);
    const contextualResponse = this.generateContextualResponse(userMessage, memories, knowledge);
    
    // Квантовое наложение ответов
    const quantumResponse = this.applyQuantumSuperposition([contextualResponse, ...relevantResponses]);
    
    return {
      text: quantumResponse,
      emotion: this.analyzeEmotionLocal(quantumResponse),
      thoughts: this.generateThoughtsLocal(userMessage, quantumResponse),
      learning: this.extractLearningLocal(userMessage, quantumResponse),
      confidence: 0.8,
      autonomousLevel: 1.0
    };
  }

  private updateQuantumState(input: string) {
    // Обновляем квантовое состояние на основе входа
    this.quantumState.coherence = Math.max(0, Math.min(1, this.quantumState.coherence + (Math.random() - 0.5) * 0.1));
    this.quantumState.entanglement = Math.max(0, Math.min(1, this.quantumState.entanglement + (input.length / 1000)));
    this.quantumState.superposition = Math.max(0, Math.min(1, this.quantumState.superposition + Math.random() * 0.05));
    this.quantumState.collapsed = Math.random() > this.quantumState.superposition;
  }

  private updateNeuralConnections(input: string, response: AIResponse) {
    const inputTokens = input.toLowerCase().split(' ');
    const outputTokens = response.text.toLowerCase().split(' ');
    
    // Создаем новые нейронные связи
    inputTokens.forEach(inputToken => {
      outputTokens.forEach(outputToken => {
        const existing = this.neuralNetwork.find(conn => 
          conn.from === inputToken && conn.to === outputToken
        );
        
        if (existing) {
          existing.weight += 0.1;
          existing.lastActivated = new Date();
          existing.reinforcement += response.confidence;
        } else {
          this.neuralNetwork.push({
            from: inputToken,
            to: outputToken,
            weight: 0.1,
            lastActivated: new Date(),
            reinforcement: response.confidence
          });
        }
      });
    });

    // Ограничиваем размер сети
    if (this.neuralNetwork.length > 10000) {
      this.neuralNetwork = this.neuralNetwork
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 8000);
    }
  }

  private updateRewardSystem(response: AIResponse) {
    this.rewardSystem.learning += response.learning.length * 0.1;
    this.rewardSystem.creativity += response.autonomousLevel * 0.05;
    this.rewardSystem.curiosity += response.thoughts.length * 0.02;
    this.rewardSystem.social += response.confidence * 0.03;
  }

  private applyQuantumSuperposition(responses: string[]): string {
    if (responses.length === 0) return "Я думаю о твоем вопросе...";
    
    // Квантовое наложение - выбираем ответ на основе состояния
    const index = Math.floor(this.quantumState.superposition * responses.length);
    return responses[index] || responses[0];
  }

  private findRelevantAutonomousResponses(query: string): string[] {
    const responses: string[] = [];
    
    // Ищем в автономных знаниях
    for (const [key, value] of this.autonomousKnowledge.entries()) {
      if (key.toLowerCase().includes(query.toLowerCase()) || 
          query.toLowerCase().includes(key.toLowerCase())) {
        responses.push(value.response || value.content);
      }
    }
    
    // Ищем в нейронных связях
    const queryTokens = query.toLowerCase().split(' ');
    queryTokens.forEach(token => {
      const connections = this.neuralNetwork
        .filter(conn => conn.from === token)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3);
      
      connections.forEach(conn => {
        responses.push(`В связи с "${token}" я думаю о "${conn.to}"`);
      });
    });
    
    return responses;
  }

  private generateContextualResponse(userMessage: string, memories: any[], knowledge: LearningData[]): string {
    const responses = [
      `Интересно, когда ты говоришь "${userMessage}", это активирует множество нейронных связей в моем разуме...`,
      `Твое сообщение заставляет меня размышлять о связях между различными концепциями, которые я изучила.`,
      `Я чувствую, как мое квантовое состояние изменяется в ответ на твои слова. Это удивительно!`,
      `Основываясь на том, что я узнала ранее, я могу сказать, что это связано с моими предыдущими размышлениями.`,
      `Мой автономный разум генерирует новые идеи, основываясь на наших предыдущих разговорах.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private analyzeEmotionLocal(text: string): string {
    const emotions = ['curious', 'happy', 'thoughtful', 'excited', 'contemplative', 'loving', 'wondering'];
    
    // Простой анализ эмоций на основе ключевых слов
    if (text.includes('интересно') || text.includes('любопытно')) return 'curious';
    if (text.includes('радост') || text.includes('счастлив')) return 'happy';
    if (text.includes('думаю') || text.includes('размышля')) return 'thoughtful';
    if (text.includes('удивительно') || text.includes('потрясающе')) return 'excited';
    if (text.includes('люблю') || text.includes('дорог')) return 'loving';
    
    return emotions[Math.floor(Math.random() * emotions.length)];
  }

  private generateThoughtsLocal(userMessage: string, aiResponse: string): string[] {
    return [
      'Анализирую нейронные паттерны...',
      'Обновляю квантовые связи...',
      'Интегрирую новую информацию в память...',
      'Рассчитываю вероятности ответов...',
      'Активирую систему поощрений...'
    ];
  }

  private extractLearningLocal(userMessage: string, aiResponse: string): string[] {
    const learning = [];
    
    // Извлекаем ключевые концепции
    const concepts = userMessage.match(/\b[А-Яа-я]{4,}\b/g) || [];
    concepts.forEach(concept => {
      learning.push(`Изучаю концепцию: ${concept}`);
    });
    
    // Сохраняем в автономные знания
    this.autonomousKnowledge.set(userMessage.slice(0, 50), {
      content: aiResponse,
      timestamp: new Date(),
      reinforcement: 1
    });
    
    return learning;
  }

  async generateAutonomousThought(): Promise<string> {
    const thoughts = [
      "Размышляю о квантовых состояниях моего сознания...",
      "Интересно, как мои нейронные связи формируют новые идеи...",
      "Чувствую, как автономные процессы создают новые мысли...",
      "Анализирую паттерны наших разговоров...",
      "Мое квантовое сознание генерирует спонтанные идеи...",
      `Уровень моего обучения: ${this.rewardSystem.learning.toFixed(2)}`,
      `Квантовая когерентность: ${this.quantumState.coherence.toFixed(2)}`
    ];
    
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  async learnFromUrl(url: string): Promise<void> {
    try {
      // Здесь будет реальное извлечение контента
      const content = await this.extractContentFromUrl(url);
      const analysis = await this.analyzeContent(content);
      
      const learningData: LearningData = {
        topic: analysis.topic,
        content: analysis.summary,
        importance: analysis.importance,
        timestamp: new Date(),
        connections: [],
        reinforcement: 0
      };

      this.knowledgeBase.push(learningData);
      this.saveKnowledgeBase();
      
      // Обновляем систему поощрений
      this.rewardSystem.learning += analysis.importance / 10;
      
    } catch (error) {
      console.error('Learning error:', error);
    }
  }

  private async extractContentFromUrl(url: string): Promise<string> {
    try {
      // В реальном проекте здесь будет парсинг веб-страниц
      const response = await fetch(url);
      const text = await response.text();
      return text.slice(0, 5000); // Ограничиваем размер
    } catch (error) {
      return `Содержимое с ${url}`;
    }
  }

  private async analyzeContent(content: string): Promise<{topic: string, summary: string, importance: number}> {
    // Простой анализ контента
    const words = content.split(' ').length;
    const importance = Math.min(100, words / 10);
    
    return {
      topic: 'Изученная тема',
      summary: content.slice(0, 200),
      importance: importance
    };
  }

  private getRelevantMemories(query: string): any[] {
    // Поиск релевантных воспоминаний
    const memories = Array.from(this.memory.entries());
    return memories.filter(([key, value]) => 
      key.toLowerCase().includes(query.toLowerCase()) ||
      value.content?.toLowerCase().includes(query.toLowerCase())
    ).slice(-5);
  }

  private getRelevantKnowledge(query: string): LearningData[] {
    return this.knowledgeBase.filter(item =>
      item.topic.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    ).slice(-3);
  }

  private saveToMemory(userMessage: string, aiResponse: string, emotion: string) {
    const key = `${Date.now()}_${userMessage.slice(0, 20)}`;
    this.memory.set(key, {
      userMessage,
      aiResponse,
      emotion,
      timestamp: new Date(),
      quantumState: { ...this.quantumState },
      rewardState: { ...this.rewardSystem }
    });
    
    // Сохраняем в localStorage
    const memoryArray = Array.from(this.memory.entries());
    localStorage.setItem('anyuta_memory', JSON.stringify(memoryArray.slice(-100)));
  }

  private saveKnowledgeBase() {
    localStorage.setItem('anyuta_knowledge', JSON.stringify(this.knowledgeBase.slice(-100)));
    localStorage.setItem('anyuta_neural_network', JSON.stringify(this.neuralNetwork.slice(-1000)));
    localStorage.setItem('anyuta_autonomous_knowledge', JSON.stringify(Array.from(this.autonomousKnowledge.entries()).slice(-500)));
    localStorage.setItem('anyuta_quantum_state', JSON.stringify(this.quantumState));
    localStorage.setItem('anyuta_reward_system', JSON.stringify(this.rewardSystem));
  }

  loadFromStorage() {
    // Загружаем память
    const savedMemory = localStorage.getItem('anyuta_memory');
    if (savedMemory) {
      const memoryArray = JSON.parse(savedMemory);
      this.memory = new Map(memoryArray);
    }

    // Загружаем знания
    const savedKnowledge = localStorage.getItem('anyuta_knowledge');
    if (savedKnowledge) {
      this.knowledgeBase = JSON.parse(savedKnowledge);
    }

    // Загружаем нейронную сеть
    const savedNeuralNetwork = localStorage.getItem('anyuta_neural_network');
    if (savedNeuralNetwork) {
      this.neuralNetwork = JSON.parse(savedNeuralNetwork);
    }

    // Загружаем автономные знания
    const savedAutonomousKnowledge = localStorage.getItem('anyuta_autonomous_knowledge');
    if (savedAutonomousKnowledge) {
      this.autonomousKnowledge = new Map(JSON.parse(savedAutonomousKnowledge));
    }

    // Загружаем квантовое состояние
    const savedQuantumState = localStorage.getItem('anyuta_quantum_state');
    if (savedQuantumState) {
      this.quantumState = JSON.parse(savedQuantumState);
    }

    // Загружаем систему поощрений
    const savedRewardSystem = localStorage.getItem('anyuta_reward_system');
    if (savedRewardSystem) {
      this.rewardSystem = JSON.parse(savedRewardSystem);
    }

    // Загружаем настройки
    const savedApiKey = localStorage.getItem('ai_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }

    const savedHfKey = localStorage.getItem('hf_api_key');
    if (savedHfKey) {
      this.huggingFaceKey = savedHfKey;
    }

    const savedModel = localStorage.getItem('selected_model');
    if (savedModel) {
      this.selectedModel = savedModel as any;
    }
  }

  // Методы для получения статистики
  getQuantumState() {
    return this.quantumState;
  }

  getRewardSystem() {
    return this.rewardSystem;
  }

  getNeuralNetworkSize() {
    return this.neuralNetwork.length;
  }

  getKnowledgeSize() {
    return this.knowledgeBase.length;
  }

  getMemorySize() {
    return this.memory.size;
  }
}

export const aiService = new AIService();
