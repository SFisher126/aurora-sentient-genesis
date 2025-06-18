
interface SpeechConfig {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class SpeechService {
  private synthesis: SpeechSynthesis;
  private isSupported: boolean;
  private voices: SpeechSynthesisVoice[] = [];
  private config: SpeechConfig = {
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    
    if (this.isSupported) {
      this.loadVoices();
      // Обновляем голоса при их загрузке
      this.synthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  private getRussianVoice(): SpeechSynthesisVoice | null {
    // Ищем русский голос
    const russianVoices = this.voices.filter(voice => 
      voice.lang.includes('ru') || voice.lang.includes('RU')
    );
    
    if (russianVoices.length > 0) {
      // Предпочитаем женские голоса для Анюты
      const femaleVoice = russianVoices.find(voice => 
        voice.name.toLowerCase().includes('anna') ||
        voice.name.toLowerCase().includes('alena') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman')
      );
      
      return femaleVoice || russianVoices[0];
    }
    
    return null;
  }

  speak(text: string, config?: Partial<SpeechConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Останавливаем текущую речь
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const finalConfig = { ...this.config, ...config };
      
      // Настройки голоса
      const voice = this.getRussianVoice();
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = finalConfig.rate || 1.0;
      utterance.pitch = finalConfig.pitch || 1.0;
      utterance.volume = finalConfig.volume || 0.8;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (error) => {
        reject(error);
      };

      // Добавляем эмоциональность в речь Анюты
      if (text.includes('!')) {
        utterance.rate = Math.min(1.2, utterance.rate * 1.1);
        utterance.pitch = Math.min(2.0, utterance.pitch * 1.1);
      }
      
      if (text.includes('...')) {
        utterance.rate = Math.max(0.8, utterance.rate * 0.9);
      }

      this.synthesis.speak(utterance);
    });
  }

  stop() {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }

  pause() {
    if (this.isSupported && this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.isSupported && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.isSupported && this.synthesis.speaking;
  }

  setConfig(config: Partial<SpeechConfig>) {
    this.config = { ...this.config, ...config };
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getRussianVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.includes('ru') || voice.lang.includes('RU')
    );
  }
}

export const speechService = new SpeechService();
