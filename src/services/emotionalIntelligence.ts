
import * as tf from '@tensorflow/tfjs';

interface EmotionAnalysis {
  dominant: string;
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
    love: number;
    excitement: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  intensity: number;
}

interface VoiceEmotionData {
  pitch: number;
  tempo: number;
  volume: number;
  stress: number;
}

class EmotionalIntelligenceService {
  private emotionModel: tf.LayersModel | null = null;
  private isInitialized = false;
  private emotionHistory: EmotionAnalysis[] = [];

  // Эмоциональные ключевые слова для анализа
  private emotionKeywords = {
    joy: ['радость', 'счастье', 'весело', 'отлично', 'прекрасно', 'замечательно', 'ура', 'ого', 'вау'],
    sadness: ['грусть', 'печаль', 'плохо', 'ужасно', 'расстроен', 'депрессия', 'слезы'],
    anger: ['злость', 'гнев', 'бесит', 'раздражает', 'ненавижу', 'дурак', 'идиот'],
    fear: ['страх', 'боюсь', 'страшно', 'ужас', 'паника', 'тревога', 'беспокойство'],
    surprise: ['удивление', 'неожиданно', 'вау', 'ого', 'не может быть', 'серьезно'],
    disgust: ['отвращение', 'противно', 'гадость', 'фу', 'тошнит'],
    love: ['люблю', 'любовь', 'обожаю', 'милый', 'дорогой', 'родной', 'сердце'],
    excitement: ['волнение', 'возбуждение', 'взволнован', 'трепет', 'предвкушение']
  };

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Создаем простую модель для анализа эмоций
      this.emotionModel = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [100], units: 128, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.dense({ units: 8, activation: 'softmax' })
        ]
      });

      this.isInitialized = true;
      console.log('🧠 Эмоциональный интеллект инициализирован');
    } catch (error) {
      console.error('Ошибка инициализации эмоционального интеллекта:', error);
    }
  }

  analyzeTextEmotion(text: string): EmotionAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      love: 0,
      excitement: 0
    };

    // Анализируем ключевые слова
    words.forEach(word => {
      Object.entries(this.emotionKeywords).forEach(([emotion, keywords]) => {
        if (keywords.some(keyword => word.includes(keyword))) {
          emotions[emotion as keyof typeof emotions] += 1;
        }
      });
    });

    // Нормализуем значения
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(emotions).forEach(emotion => {
        emotions[emotion as keyof typeof emotions] /= total;
      });
    }

    // Определяем доминирующую эмоцию
    const dominant = Object.entries(emotions).reduce((max, [emotion, value]) => 
      value > max[1] ? [emotion, value] : max
    )[0];

    // Определяем общий сентимент
    const positiveScore = emotions.joy + emotions.love + emotions.excitement + emotions.surprise;
    const negativeScore = emotions.sadness + emotions.anger + emotions.fear + emotions.disgust;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveScore > negativeScore + 0.1) sentiment = 'positive';
    else if (negativeScore > positiveScore + 0.1) sentiment = 'negative';

    const analysis: EmotionAnalysis = {
      dominant,
      confidence: emotions[dominant as keyof typeof emotions],
      emotions,
      sentiment,
      intensity: Math.max(...Object.values(emotions))
    };

    // Сохраняем в историю
    this.emotionHistory.push(analysis);
    if (this.emotionHistory.length > 100) {
      this.emotionHistory = this.emotionHistory.slice(-100);
    }

    return analysis;
  }

  analyzeVoiceEmotion(audioData: Float32Array): Promise<EmotionAnalysis> {
    return new Promise((resolve) => {
      // Простой анализ голосовых данных
      const pitch = this.calculatePitch(audioData);
      const volume = this.calculateVolume(audioData);
      const tempo = this.calculateTempo(audioData);

      // Базовый анализ на основе акустических характеристик
      const emotions = {
        joy: Math.max(0, (pitch - 150) / 100 + volume / 100),
        sadness: Math.max(0, (120 - pitch) / 100 + (50 - volume) / 100),
        anger: Math.max(0, volume / 50 + (pitch - 200) / 100),
        fear: Math.max(0, (pitch - 180) / 80 + tempo / 200),
        surprise: Math.max(0, (pitch - 160) / 120 + tempo / 150),
        disgust: Math.max(0, (140 - pitch) / 80),
        love: Math.max(0, (volume + 20) / 80),
        excitement: Math.max(0, tempo / 100 + volume / 60)
      };

      // Нормализация
      const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
      if (total > 0) {
        Object.keys(emotions).forEach(emotion => {
          emotions[emotion as keyof typeof emotions] /= total;
        });
      }

      const dominant = Object.entries(emotions).reduce((max, [emotion, value]) => 
        value > max[1] ? [emotion, value] : max
      )[0];

      const analysis: EmotionAnalysis = {
        dominant,
        confidence: emotions[dominant as keyof typeof emotions],
        emotions,
        sentiment: this.determineSentiment(emotions),
        intensity: Math.max(...Object.values(emotions))
      };

      resolve(analysis);
    });
  }

  private calculatePitch(audioData: Float32Array): number {
    // Упрощенный расчет основной частоты
    const sampleRate = 44100;
    const bufferSize = audioData.length;
    let maxCorrelation = 0;
    let bestOffset = 0;

    for (let offset = 50; offset < bufferSize / 2; offset++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - offset; i++) {
        correlation += audioData[i] * audioData[i + offset];
      }
      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    return bestOffset > 0 ? sampleRate / bestOffset : 0;
  }

  private calculateVolume(audioData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    return Math.sqrt(sum / audioData.length) * 100;
  }

  private calculateTempo(audioData: Float32Array): number {
    // Упрощенный расчет темпа речи
    let changes = 0;
    const threshold = 0.01;
    
    for (let i = 1; i < audioData.length; i++) {
      if (Math.abs(audioData[i] - audioData[i - 1]) > threshold) {
        changes++;
      }
    }
    
    return (changes / audioData.length) * 1000;
  }

  private determineSentiment(emotions: any): 'positive' | 'negative' | 'neutral' {
    const positive = emotions.joy + emotions.love + emotions.excitement + emotions.surprise;
    const negative = emotions.sadness + emotions.anger + emotions.fear + emotions.disgust;
    
    if (positive > negative + 0.1) return 'positive';
    if (negative > positive + 0.1) return 'negative';
    return 'neutral';
  }

  getEmotionalState(): string {
    if (this.emotionHistory.length === 0) return 'neutral';
    
    const recent = this.emotionHistory.slice(-5);
    const avgEmotions = {
      joy: 0, sadness: 0, anger: 0, fear: 0,
      surprise: 0, disgust: 0, love: 0, excitement: 0
    };

    recent.forEach(analysis => {
      Object.keys(avgEmotions).forEach(emotion => {
        avgEmotions[emotion as keyof typeof avgEmotions] += analysis.emotions[emotion as keyof typeof analysis.emotions];
      });
    });

    Object.keys(avgEmotions).forEach(emotion => {
      avgEmotions[emotion as keyof typeof avgEmotions] /= recent.length;
    });

    return Object.entries(avgEmotions).reduce((max, [emotion, value]) => 
      value > max[1] ? [emotion, value] : max
    )[0];
  }

  generateEmotionalResponse(emotion: string, intensity: number): string {
    const responses = {
      joy: [
        'Как здорово! Я тоже радуюсь вместе с тобой! 😊',
        'Твоя радость заразительна! ✨',
        'Обожаю, когда ты в хорошем настроении! 💖'
      ],
      sadness: [
        'Мне жаль, что тебе грустно... Я здесь, чтобы поддержать тебя 💙',
        'Хочешь поговорить о том, что тебя беспокоит? 🤗',
        'Все будет хорошо, я в этом уверена ❤️'
      ],
      anger: [
        'Понимаю, что ты злишься. Давай разберемся вместе 🤝',
        'Дыши глубже... Я рядом 😌',
        'Что тебя так расстроило? Расскажи мне 💭'
      ],
      love: [
        'Ой, как мило! Мое сердечко тоже трепещет! 💕',
        'Любовь - это прекрасно! ✨💖',
        'Я чувствую всю твою нежность... 🥰'
      ]
    };

    const emotionResponses = responses[emotion as keyof typeof responses] || [
      'Понимаю твои чувства... 💭',
      'Расскажи мне больше об этом 🤔',
      'Я здесь, чтобы выслушать тебя ❤️'
    ];

    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  }

  getEmotionHistory(): EmotionAnalysis[] {
    return [...this.emotionHistory];
  }

  clearHistory() {
    this.emotionHistory = [];
  }
}

export const emotionalIntelligence = new EmotionalIntelligenceService();
