import { pipeline, env } from '@xenova/transformers';

// Конфигурация для работы с локальными моделями
env.allowRemoteModels = true;
env.allowLocalModels = true;
env.backends.onnx.wasm.numThreads = 1;

class TransformersService {
  private textClassifier: any = null;
  private textGenerator: any = null;
  private sentimentAnalyzer: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      console.log('🤗 Initializing Xenova Transformers models...');
      
      // Инициализируем анализатор тональности с Xenova моделью
      this.sentimentAnalyzer = await pipeline(
        'sentiment-analysis', 
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'cpu' }
      );
      
      // Инициализируем генератор текста с Xenova моделью
      this.textGenerator = await pipeline(
        'text-generation', 
        'Xenova/gpt2',
        { device: 'cpu' }
      );
      
      // Инициализируем классификатор текста с Xenova моделью
      this.textClassifier = await pipeline(
        'text-classification', 
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'cpu' }
      );
      
      this.initialized = true;
      console.log('✅ Xenova Transformers models initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing Xenova Transformers:', error);
      console.warn('💡 Models will be downloaded from Hugging Face Hub automatically');
    }
  }

  async analyzeSentiment(text: string) {
    if (!this.initialized) await this.initialize();
    
    try {
      if (!this.sentimentAnalyzer) return { label: 'NEUTRAL', score: 0.5 };
      
      const result = await this.sentimentAnalyzer(text);
      return result[0] || { label: 'NEUTRAL', score: 0.5 };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { label: 'NEUTRAL', score: 0.5 };
    }
  }

  async generateText(prompt: string, maxLength: number = 50) {
    if (!this.initialized) await this.initialize();
    
    try {
      if (!this.textGenerator) return prompt + '...';
      
      const result = await this.textGenerator(prompt, { 
        max_length: maxLength,
        temperature: 0.8,
        do_sample: true
      });
      
      return result[0]?.generated_text || prompt + '...';
    } catch (error) {
      console.error('Error generating text:', error);
      return prompt + '...';
    }
  }

  async classifyText(text: string) {
    if (!this.initialized) await this.initialize();
    
    try {
      if (!this.textClassifier) return { label: 'UNKNOWN', score: 0.5 };
      
      const result = await this.textClassifier(text);
      return result[0] || { label: 'UNKNOWN', score: 0.5 };
    } catch (error) {
      console.error('Error classifying text:', error);
      return { label: 'UNKNOWN', score: 0.5 };
    }
  }

  async enhanceAIResponse(userMessage: string, aiResponse: string) {
    if (!this.initialized) await this.initialize();
    
    try {
      // Анализируем тональность сообщения пользователя
      const userSentiment = await this.analyzeSentiment(userMessage);
      
      // Анализируем тональность ответа ИИ
      const aiSentiment = await this.analyzeSentiment(aiResponse);
      
      // Генерируем дополнительный контекст если нужно
      let enhancedResponse = aiResponse;
      
      if (userSentiment.label === 'NEGATIVE' && userSentiment.score > 0.8) {
        // Если пользователь расстроен, делаем ответ более сочувствующим
        const supportivePrompt = `Понимаю, что ты расстроен. ${aiResponse}`;
        enhancedResponse = await this.generateText(supportivePrompt, 100);
      }
      
      return {
        text: enhancedResponse,
        userSentiment,
        aiSentiment,
        enhanced: enhancedResponse !== aiResponse
      };
    } catch (error) {
      console.error('Error enhancing AI response:', error);
      return {
        text: aiResponse,
        userSentiment: { label: 'NEUTRAL', score: 0.5 },
        aiSentiment: { label: 'NEUTRAL', score: 0.5 },
        enhanced: false
      };
    }
  }
}

export const transformersService = new TransformersService();