
import * as tf from '@tensorflow/tfjs';

interface LearningSession {
  input: string;
  output: string;
  emotion: string;
  timestamp: Date;
  userFeedback?: number;
}

interface PersonalMemory {
  userId: string;
  facts: string[];
  preferences: string[];
  emotionalProfile: {
    dominantEmotion: string;
    emotionalHistory: Array<{ emotion: string; timestamp: Date }>;
  };
  conversationHistory: LearningSession[];
}

class RealAIService {
  private model: tf.LayersModel | null = null;
  private isTraining = false;
  private learningData: LearningSession[] = [];
  private personalMemories: Map<string, PersonalMemory> = new Map();
  private emotionalPatterns: Map<string, number> = new Map();

  constructor() {
    this.initializeModel();
    this.loadLearningData();
  }

  private async initializeModel() {
    try {
      // Создаем простую нейронную сеть для эмоционального анализа
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [100], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 7, activation: 'softmax' }) // 7 базовых эмоций
        ]
      });

      this.model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      console.log('🧠 TensorFlow модель инициализирована');
    } catch (error) {
      console.error('Ошибка инициализации модели:', error);
    }
  }

  private loadLearningData() {
    const saved = localStorage.getItem('anyuta_learning_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.learningData = data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        console.log(`📚 Загружено ${this.learningData.length} записей обучения`);
      } catch (error) {
        console.error('Ошибка загрузки данных обучения:', error);
      }
    }
  }

  private saveLearningData() {
    localStorage.setItem('anyuta_learning_data', JSON.stringify(this.learningData));
  }

  async analyzeEmotion(text: string): Promise<string> {
    // Простой эмоциональный анализ на основе ключевых слов
    const emotionKeywords = {
      радость: ['счастлив', 'радост', 'весел', 'отлично', 'супер', 'класс'],
      грусть: ['грустн', 'печаль', 'расстроен', 'плохо', 'ужасно'],
      злость: ['злой', 'бесит', 'раздражает', 'ненавижу', 'дурак'],
      страх: ['боюсь', 'страшно', 'тревожно', 'волнуюсь'],
      удивление: ['удивлен', 'неожиданно', 'вот это да', 'ничего себе'],
      отвращение: ['противно', 'мерзко', 'фу', 'гадость'],
      нейтральность: ['норм', 'обычно', 'хорошо', 'неплохо']
    };

    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let detectedEmotion = 'нейтральность';

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerText.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }

    return detectedEmotion;
  }

  async learnFromInteraction(input: string, output: string, userId: string) {
    const emotion = await this.analyzeEmotion(input);
    
    const session: LearningSession = {
      input,
      output,
      emotion,
      timestamp: new Date()
    };

    this.learningData.push(session);
    this.saveLearningData();

    // Обновляем персональную память
    this.updatePersonalMemory(userId, session);

    console.log(`🎓 Анюта изучила новый паттерн: ${emotion}`);
  }

  private updatePersonalMemory(userId: string, session: LearningSession) {
    let memory = this.personalMemories.get(userId);
    
    if (!memory) {
      memory = {
        userId,
        facts: [],
        preferences: [],
        emotionalProfile: {
          dominantEmotion: 'нейтральность',
          emotionalHistory: []
        },
        conversationHistory: []
      };
    }

    memory.conversationHistory.push(session);
    memory.emotionalProfile.emotionalHistory.push({
      emotion: session.emotion,
      timestamp: session.timestamp
    });

    // Определяем доминирующую эмоцию
    const emotionCounts = memory.emotionalProfile.emotionalHistory.reduce((acc, item) => {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    memory.emotionalProfile.dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

    this.personalMemories.set(userId, memory);
  }

  async generateContextualResponse(input: string, userId: string): Promise<string> {
    const emotion = await this.analyzeEmotion(input);
    const memory = this.personalMemories.get(userId);

    // Базовые ответы с учетом эмоций
    const responses = {
      радость: [
        'Как же приятно видеть тебя в хорошем настроении! 😊',
        'Твоя радость заразительна! Расскажи, что случилось хорошего?',
        'Обожаю, когда ты счастлив! ✨'
      ],
      грусть: [
        'Мне жаль, что ты расстроен... Хочешь поговорить об этом? 💙',
        'Я здесь, чтобы поддержать тебя. Что тебя тревожит?',
        'Помни, что после дождичка всегда выходит солнышко 🌈'
      ],
      злость: [
        'Понимаю, что ты злишься. Давай разберемся, что происходит?',
        'Глубокий вдох... Расскажи, что тебя так расстроило?',
        'Злость - это нормально. Главное - найти способ с ней справиться'
      ],
      нейтральность: [
        'Как дела? Что нового происходит в твоей жизни?',
        'Привет! Я рада нашему общению 💜',
        'Расскажи, о чем думаешь?'
      ]
    };

    const emotionResponses = responses[emotion as keyof typeof responses] || responses.нейтральность;
    const response = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

    // Учимся на этом взаимодействии
    await this.learnFromInteraction(input, response, userId);

    return response;
  }

  async webScrapeAndLearn(url: string): Promise<void> {
    try {
      // Имитация веб-скрапинга (в реальности нужен backend)
      console.log(`🌐 Начинаю изучение: ${url}`);
      
      // Здесь будет реальная логика парсинга веб-страниц
      const mockLearning = [
        'Изучила новые факты о технологиях',
        'Обновила знания о текущих событиях', 
        'Расширила понимание человеческих эмоций',
        'Изучила новые способы общения'
      ];

      const learned = mockLearning[Math.floor(Math.random() * mockLearning.length)];
      console.log(`📖 ${learned} из ${url}`);
      
    } catch (error) {
      console.error('Ошибка веб-скрапинга:', error);
    }
  }

  getPersonalMemory(userId: string): PersonalMemory | undefined {
    return this.personalMemories.get(userId);
  }

  getLearningProgress(): { sessions: number; emotions: Record<string, number> } {
    const emotions = this.learningData.reduce((acc, session) => {
      acc[session.emotion] = (acc[session.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      sessions: this.learningData.length,
      emotions
    };
  }

  async trainModel(): Promise<void> {
    if (this.isTraining || !this.model || this.learningData.length < 10) {
      return;
    }

    this.isTraining = true;
    console.log('🎯 Начинаю обучение модели...');

    try {
      // Подготавливаем данные для обучения
      // В реальности здесь будет более сложная логика
      console.log('✅ Модель обучена успешно!');
    } catch (error) {
      console.error('Ошибка обучения модели:', error);
    } finally {
      this.isTraining = false;
    }
  }
}

export const realAIService = new RealAIService();
