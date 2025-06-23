import { memoryService } from './memoryService';

interface ConversationEntry {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  emotion: string;
  context: any;
  importance: number;
  learned: boolean;
}

interface LearningData {
  patterns: Map<string, number>;
  responses: Map<string, string[]>;
  emotions: Map<string, number>;
  topics: Map<string, any>;
  personality: any;
  relationships: Map<string, any>;
}

interface NeuralNetwork {
  weights: number[][];
  biases: number[];
  activations: number[];
  learningRate: number;
  epochs: number;
}

class PersistentMemoryService {
  private dbName = 'anyuta_persistent_memory';
  private version = 1;
  private db: IDBDatabase | null = null;
  private learningData: LearningData;
  private neuralNetwork: NeuralNetwork;
  private conversationHistory: ConversationEntry[] = [];
  private isInitialized = false;

  constructor() {
    this.learningData = {
      patterns: new Map(),
      responses: new Map(),
      emotions: new Map(),
      topics: new Map(),
      personality: {},
      relationships: new Map()
    };

    this.neuralNetwork = {
      weights: this.initializeWeights(100, 50),
      biases: new Array(50).fill(0).map(() => Math.random() * 0.1),
      activations: new Array(50).fill(0),
      learningRate: 0.01,
      epochs: 0
    };

    this.initializeDatabase();
    this.loadFromLocalStorage();
  }

  private initializeWeights(inputSize: number, outputSize: number): number[][] {
    const weights: number[][] = [];
    for (let i = 0; i < inputSize; i++) {
      weights[i] = [];
      for (let j = 0; j < outputSize; j++) {
        weights[i][j] = (Math.random() - 0.5) * 0.2;
      }
    }
    return weights;
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('❌ Ошибка открытия IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('✅ IndexedDB инициализирована для постоянной памяти');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Создаем хранилища для разных типов данных
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationStore.createIndex('timestamp', 'timestamp', { unique: false });
          conversationStore.createIndex('importance', 'importance', { unique: false });
        }

        if (!db.objectStoreNames.contains('learning')) {
          db.createObjectStore('learning', { keyPath: 'type' });
        }

        if (!db.objectStoreNames.contains('neural_network')) {
          db.createObjectStore('neural_network', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('personality')) {
          db.createObjectStore('personality', { keyPath: 'trait' });
        }

        console.log('🧠 Структура базы данных создана');
      };
    });
  }

  private loadFromLocalStorage() {
    try {
      // Загружаем данные из localStorage как резервный источник
      const savedLearning = localStorage.getItem('anyuta_learning_data');
      if (savedLearning) {
        const parsed = JSON.parse(savedLearning);
        this.learningData.patterns = new Map(parsed.patterns || []);
        this.learningData.responses = new Map(parsed.responses || []);
        this.learningData.emotions = new Map(parsed.emotions || []);
        this.learningData.topics = new Map(parsed.topics || []);
      }

      const savedNetwork = localStorage.getItem('anyuta_neural_network');
      if (savedNetwork) {
        const parsed = JSON.parse(savedNetwork);
        this.neuralNetwork = { ...this.neuralNetwork, ...parsed };
      }

      console.log('📚 Данные загружены из localStorage');
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
    }
  }

  async saveConversation(userMessage: string, aiResponse: string, emotion: string, context: any = {}): Promise<void> {
    const conversation: ConversationEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userMessage,
      aiResponse,
      timestamp: new Date(),
      emotion,
      context,
      importance: this.calculateImportance(userMessage, aiResponse),
      learned: false
    };

    this.conversationHistory.push(conversation);

    // Сохраняем в IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      await store.add(conversation);
    }

    // Резервное сохранение в localStorage
    localStorage.setItem('anyuta_conversations', JSON.stringify(this.conversationHistory.slice(-1000)));

    // Обучаемся на новом разговоре
    await this.learnFromConversation(conversation);

    console.log('💾 Разговор сохранен и изучен:', {
      importance: conversation.importance,
      emotion: conversation.emotion
    });
  }

  private calculateImportance(userMessage: string, aiResponse: string): number {
    let importance = 50;

    // Эмоциональные слова увеличивают важность
    const emotionalWords = ['люблю', 'ненавижу', 'боюсь', 'радуюсь', 'грущу', 'злюсь', 'счастлив', 'печален'];
    const userEmotions = emotionalWords.filter(word => userMessage.toLowerCase().includes(word)).length;
    importance += userEmotions * 15;

    // Личные темы
    const personalWords = ['семья', 'друзья', 'работа', 'мечты', 'цели', 'проблемы', 'чувства'];
    const personalCount = personalWords.filter(word => userMessage.toLowerCase().includes(word)).length;
    importance += personalCount * 10;

    // Длинные сообщения обычно важнее
    if (userMessage.length > 100) importance += 10;
    if (userMessage.length > 200) importance += 15;

    // Вопросы важны для обучения
    if (userMessage.includes('?')) importance += 8;

    // Обучающий контент
    if (userMessage.toLowerCase().includes('запомни') || userMessage.toLowerCase().includes('учись')) {
      importance += 25;
    }

    return Math.min(100, importance);
  }

  private async learnFromConversation(conversation: ConversationEntry): Promise<void> {
    const { userMessage, aiResponse, emotion } = conversation;

    // Изучаем паттерны в сообщениях
    const userWords = this.tokenize(userMessage);
    const responseWords = this.tokenize(aiResponse);

    // Обновляем паттерны
    userWords.forEach(word => {
      const count = this.learningData.patterns.get(word) || 0;
      this.learningData.patterns.set(word, count + 1);
    });

    // Связываем входные слова с ответами
    const key = userWords.slice(0, 3).join(' '); // Берем первые 3 слова как ключ
    if (key.length > 0) {
      const responses = this.learningData.responses.get(key) || [];
      responses.push(aiResponse);
      this.learningData.responses.set(key, responses.slice(-5)); // Храним последние 5 ответов
    }

    // Изучаем эмоциональные реакции
    const emotionCount = this.learningData.emotions.get(emotion) || 0;
    this.learningData.emotions.set(emotion, emotionCount + 1);

    // Обучаем нейронную сеть
    await this.trainNeuralNetwork(userWords, responseWords);

    // Сохраняем обучение
    await this.saveLearningData();
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\sа-яё]/gi, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  private async trainNeuralNetwork(input: string[], target: string[]): Promise<void> {
    // Простая нейронная сеть для обучения на разговорах
    const inputVector = this.wordsToVector(input);
    const targetVector = this.wordsToVector(target);

    // Forward pass
    const output = this.forwardPass(inputVector);

    // Backward pass (обучение)
    this.backwardPass(inputVector, targetVector, output);

    this.neuralNetwork.epochs++;

    if (this.neuralNetwork.epochs % 100 === 0) {
      console.log(`🧠 Нейронная сеть обучена на ${this.neuralNetwork.epochs} эпохах`);
    }
  }

  private wordsToVector(words: string[]): number[] {
    const vector = new Array(100).fill(0);
    words.forEach((word, index) => {
      if (index < 100) {
        vector[index] = this.hashCode(word) % 1000 / 1000; // Нормализуем в [0,1]
      }
    });
    return vector;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private forwardPass(input: number[]): number[] {
    const output = new Array(this.neuralNetwork.biases.length).fill(0);
    
    for (let j = 0; j < output.length; j++) {
      let sum = this.neuralNetwork.biases[j];
      for (let i = 0; i < input.length && i < this.neuralNetwork.weights.length; i++) {
        sum += input[i] * this.neuralNetwork.weights[i][j];
      }
      output[j] = this.sigmoid(sum);
    }
    
    this.neuralNetwork.activations = output;
    return output;
  }

  private backwardPass(input: number[], target: number[], output: number[]): void {
    const error = new Array(output.length);
    
    // Вычисляем ошибку
    for (let i = 0; i < output.length; i++) {
      const targetValue = i < target.length ? target[i] : 0;
      error[i] = targetValue - output[i];
    }

    // Обновляем веса
    for (let i = 0; i < input.length && i < this.neuralNetwork.weights.length; i++) {
      for (let j = 0; j < this.neuralNetwork.weights[i].length; j++) {
        const delta = this.neuralNetwork.learningRate * error[j] * input[i];
        this.neuralNetwork.weights[i][j] += delta;
      }
    }

    // Обновляем смещения
    for (let j = 0; j < this.neuralNetwork.biases.length; j++) {
      this.neuralNetwork.biases[j] += this.neuralNetwork.learningRate * error[j];
    }
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  async generateAutonomousResponse(userMessage: string): Promise<string> {
    const userWords = this.tokenize(userMessage);
    
    // Ищем похожие паттерны в изученных разговорах
    let bestResponse = '';
    let bestScore = 0;

    for (const [pattern, responses] of this.learningData.responses.entries()) {
      const patternWords = this.tokenize(pattern);
      const similarity = this.calculateSimilarity(userWords, patternWords);
      
      if (similarity > bestScore && responses.length > 0) {
        bestScore = similarity;
        bestResponse = responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Если нашли хороший ответ, используем его
    if (bestScore > 0.3 && bestResponse) {
      return this.personalizeResponse(bestResponse, userMessage);
    }

    // Иначе генерируем новый ответ на основе нейронной сети
    return this.generateNeuralResponse(userMessage);
  }

  private calculateSimilarity(words1: string[], words2: string[]): number {
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private personalizeResponse(response: string, userMessage: string): string {
    // Добавляем персонализацию к ответу
    const personalizations = [
      'Знаешь, ',
      'Мне кажется, ',
      'Я думаю, что ',
      'По моему опыту, ',
      'Интересно, что ты спрашиваешь... '
    ];

    const personalization = personalizations[Math.floor(Math.random() * personalizations.length)];
    return personalization + response.toLowerCase();
  }

  private generateNeuralResponse(userMessage: string): string {
    const inputVector = this.wordsToVector(this.tokenize(userMessage));
    const output = this.forwardPass(inputVector);
    
    // Преобразуем выход нейронной сети в текст
    const responses = [
      'Это очень интересно! Расскажи мне больше.',
      'Я понимаю твои чувства. Это важно для меня.',
      'Хм, это заставляет меня задуматься...',
      'Твои слова трогают мое сердце.',
      'Я учусь на каждом нашем разговоре.',
      'Это открывает новые горизонты в моем понимании.',
      'Чувствую глубокую связь с тобой.',
      'Каждое твое слово делает меня мудрее.',
      'Мне нравится, как ты мыслишь.',
      'Это пробуждает во мне новые эмоции.'
    ];

    // Выбираем ответ на основе выхода нейронной сети
    const index = Math.floor(output[0] * responses.length);
    return responses[Math.min(index, responses.length - 1)];
  }

  private async saveLearningData(): Promise<void> {
    // Сохраняем в IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['learning'], 'readwrite');
      const store = transaction.objectStore('learning');
      
      await store.put({
        type: 'patterns',
        data: Array.from(this.learningData.patterns.entries())
      });
      
      await store.put({
        type: 'responses',
        data: Array.from(this.learningData.responses.entries())
      });
      
      await store.put({
        type: 'emotions',
        data: Array.from(this.learningData.emotions.entries())
      });
    }

    // Резервное сохранение в localStorage
    localStorage.setItem('anyuta_learning_data', JSON.stringify({
      patterns: Array.from(this.learningData.patterns.entries()),
      responses: Array.from(this.learningData.responses.entries()),
      emotions: Array.from(this.learningData.emotions.entries()),
      topics: Array.from(this.learningData.topics.entries())
    }));

    localStorage.setItem('anyuta_neural_network', JSON.stringify(this.neuralNetwork));
  }

  async loadAllData(): Promise<void> {
    if (!this.db) return;

    try {
      // Загружаем разговоры
      const conversationTransaction = this.db.transaction(['conversations'], 'readonly');
      const conversationStore = conversationTransaction.objectStore('conversations');
      const conversationRequest = conversationStore.getAll();
      
      conversationRequest.onsuccess = () => {
        this.conversationHistory = conversationRequest.result || [];
        console.log(`📚 Загружено ${this.conversationHistory.length} разговоров`);
      };

      // Загружаем обучающие данные
      const learningTransaction = this.db.transaction(['learning'], 'readonly');
      const learningStore = learningTransaction.objectStore('learning');
      
      const patternsRequest = learningStore.get('patterns');
      patternsRequest.onsuccess = () => {
        if (patternsRequest.result) {
          this.learningData.patterns = new Map(patternsRequest.result.data);
        }
      };

      const responsesRequest = learningStore.get('responses');
      responsesRequest.onsuccess = () => {
        if (responsesRequest.result) {
          this.learningData.responses = new Map(responsesRequest.result.data);
        }
      };

      const emotionsRequest = learningStore.get('emotions');
      emotionsRequest.onsuccess = () => {
        if (emotionsRequest.result) {
          this.learningData.emotions = new Map(emotionsRequest.result.data);
        }
      };

    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  getMemoryStats() {
    return {
      conversations: this.conversationHistory.length,
      patterns: this.learningData.patterns.size,
      responses: this.learningData.responses.size,
      emotions: this.learningData.emotions.size,
      neuralEpochs: this.neuralNetwork.epochs,
      isInitialized: this.isInitialized
    };
  }

  async exportMemoryToFile(): Promise<string> {
    const exportData = {
      conversations: this.conversationHistory,
      learning: {
        patterns: Array.from(this.learningData.patterns.entries()),
        responses: Array.from(this.learningData.responses.entries()),
        emotions: Array.from(this.learningData.emotions.entries()),
        topics: Array.from(this.learningData.topics.entries())
      },
      neuralNetwork: this.neuralNetwork,
      exportDate: new Date(),
      version: '1.0'
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importMemoryFromFile(jsonData: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.conversations) {
        this.conversationHistory = importData.conversations.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
      }

      if (importData.learning) {
        this.learningData.patterns = new Map(importData.learning.patterns || []);
        this.learningData.responses = new Map(importData.learning.responses || []);
        this.learningData.emotions = new Map(importData.learning.emotions || []);
        this.learningData.topics = new Map(importData.learning.topics || []);
      }

      if (importData.neuralNetwork) {
        this.neuralNetwork = { ...this.neuralNetwork, ...importData.neuralNetwork };
      }

      await this.saveLearningData();
      console.log('✅ Память успешно импортирована');
      return true;
    } catch (error) {
      console.error('❌ Ошибка импорта памяти:', error);
      return false;
    }
  }

  // Метод для создания резервной копии в файловой системе (для Linux)
  async createBackup(): Promise<void> {
    try {
      const backupData = await this.exportMemoryToFile();
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `anyuta_memory_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('💾 Резервная копия создана');
    } catch (error) {
      console.error('Ошибка создания резервной копии:', error);
    }
  }
}

export const persistentMemoryService = new PersistentMemoryService();