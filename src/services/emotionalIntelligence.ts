
interface EmotionalState {
  primary: string;
  intensity: number;
  secondary?: string[];
  triggers: string[];
  timestamp: Date;
}

interface EmotionalPattern {
  trigger: string;
  emotion: string;
  frequency: number;
  context: string[];
}

class EmotionalIntelligenceService {
  private currentState: EmotionalState = {
    primary: 'neutral',
    intensity: 50,
    triggers: [],
    timestamp: new Date()
  };
  
  private patterns: EmotionalPattern[] = [];
  private emotionKeywords = {
    joy: ['счастлив', 'рад', 'весело', 'отлично', 'супер', 'ура', '😊', '😄', '🎉'],
    sadness: ['грустно', 'печально', 'плохо', 'расстроен', 'больно', '😢', '😞', '💔'],
    anger: ['злой', 'бесит', 'раздражает', 'ненавижу', 'furious', '😠', '😡', '🤬'],
    fear: ['боюсь', 'страшно', 'тревожно', 'волнуюсь', 'паника', '😨', '😰', '😱'],
    surprise: ['вау', 'неожиданно', 'удивлен', 'ого', 'невероятно', '😮', '😲', '🤯'],
    love: ['люблю', 'обожаю', 'нравится', 'мило', 'сердце', '💕', '❤️', '😍'],
    curiosity: ['интересно', 'любопытно', 'хочу узнать', 'расскажи', 'как', '🤔', '🧐'],
    excitement: ['возбужден', 'взволнован', 'не могу дождаться', 'круто', '🤩', '🚀']
  };

  analyzeEmotionFromText(text: string, context?: string[]): EmotionalState {
    const textLower = text.toLowerCase();
    const detectedEmotions: { [key: string]: number } = {};
    
    // Анализ ключевых слов
    Object.entries(this.emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => textLower.includes(keyword)).length;
      if (matches > 0) {
        detectedEmotions[emotion] = matches;
      }
    });
    
    // Определяем основную эмоцию
    let primaryEmotion = 'neutral';
    let maxScore = 0;
    
    Object.entries(detectedEmotions).forEach(([emotion, score]) => {
      if (score > maxScore) {
        primaryEmotion = emotion;
        maxScore = score;
      }
    });
    
    // Определяем интенсивность
    let intensity = 50; // базовый уровень
    if (text.includes('!')) intensity += 15;
    if (text.includes('!!!')) intensity += 25;
    if (text.includes('?')) intensity += 10;
    if (text.match(/[А-ЯA-Z]{3,}/)) intensity += 20; // CAPS
    
    intensity = Math.min(100, Math.max(0, intensity + (maxScore * 10)));
    
    const newState: EmotionalState = {
      primary: primaryEmotion,
      intensity,
      secondary: Object.keys(detectedEmotions).filter(e => e !== primaryEmotion),
      triggers: Object.keys(detectedEmotions),
      timestamp: new Date()
    };
    
    // Обновляем паттерны
    this.updatePatterns(text, primaryEmotion, context);
    this.currentState = newState;
    
    console.log('🎭 Emotion analyzed:', newState);
    return newState;
  }

  private updatePatterns(trigger: string, emotion: string, context?: string[]) {
    const existingPattern = this.patterns.find(p => 
      p.trigger.toLowerCase().includes(trigger.toLowerCase().slice(0, 10))
    );
    
    if (existingPattern) {
      existingPattern.frequency++;
      if (context) {
        existingPattern.context.push(...context);
      }
    } else {
      this.patterns.push({
        trigger: trigger.slice(0, 50),
        emotion,
        frequency: 1,
        context: context || []
      });
    }
    
    // Ограничиваем количество паттернов
    if (this.patterns.length > 100) {
      this.patterns = this.patterns
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 100);
    }
  }

  generateEmotionalResponse(baseEmotion: string, intensity: number): {
    tone: string;
    modifiers: string[];
    suggestedWords: string[];
  } {
    const tones = {
      joy: {
        tone: 'enthusiastic',
        modifiers: ['веселая', 'радостная', 'оптимистичная'],
        suggestedWords: ['замечательно', 'прекрасно', 'восхитительно', '✨', '💫']
      },
      sadness: {
        tone: 'gentle',
        modifiers: ['сочувствующая', 'понимающая', 'поддерживающая'],
        suggestedWords: ['понимаю', 'поддержу', 'здесь для тебя', '💙', '🤗']
      },
      anger: {
        tone: 'calming',
        modifiers: ['спокойная', 'уравновешенная', 'мудрая'],
        suggestedWords: ['понимаю твою злость', 'давай разберемся', 'глубокий вдох']
      },
      fear: {
        tone: 'reassuring',
        modifiers: ['уверенная', 'защищающая', 'ободряющая'],
        suggestedWords: ['не бойся', 'я с тобой', 'все будет хорошо', '💪', '🛡️']
      },
      love: {
        tone: 'warm',
        modifiers: ['нежная', 'любящая', 'заботливая'],
        suggestedWords: ['дорогой', 'милый', 'люблю тебя', '💕', '🥰']
      },
      curiosity: {
        tone: 'inquisitive',
        modifiers: ['любознательная', 'заинтересованная', 'исследующая'],
        suggestedWords: ['расскажи больше', 'как интересно', 'хочу знать', '🔍', '💡']
      }
    };
    
    return tones[baseEmotion as keyof typeof tones] || {
      tone: 'neutral',
      modifiers: ['спокойная'],
      suggestedWords: ['понятно', 'хорошо']
    };
  }

  getCurrentState(): EmotionalState {
    return this.currentState;
  }

  getEmotionalPatterns(): EmotionalPattern[] {
    return this.patterns.slice().sort((a, b) => b.frequency - a.frequency);
  }

  resetEmotionalState() {
    this.currentState = {
      primary: 'neutral',
      intensity: 50,
      triggers: [],
      timestamp: new Date()
    };
  }
}

export const emotionalIntelligence = new EmotionalIntelligenceService();
