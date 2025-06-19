
interface VoiceModel {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

class ElevenLabsService {
  private config: ElevenLabsConfig | null = null;
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  private voices: VoiceModel[] = [
    { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', category: 'female', description: 'Нежный женский голос' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', category: 'female', description: 'Мягкий женский голос' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', category: 'female', description: 'Выразительный женский голос' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', category: 'female', description: 'Британский женский голос' },
    { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', category: 'female', description: 'Молодой женский голос' },
    { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', category: 'female', description: 'Спокойный женский голос' }
  ];

  private models = {
    'eleven_multilingual_v2': 'Многоязычная модель v2 - эмоциональная и живая',
    'eleven_turbo_v2_5': 'Turbo v2.5 - быстрая многоязычная модель',
    'eleven_turbo_v2': 'Turbo v2 - быстрая английская модель'
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('elevenlabs_config');
      if (saved) {
        this.config = JSON.parse(saved);
      }
    } catch (error) {
      console.error('ElevenLabs config loading error:', error);
    }
  }

  private saveConfig() {
    if (this.config) {
      localStorage.setItem('elevenlabs_config', JSON.stringify(this.config));
    }
  }

  setApiKey(apiKey: string) {
    if (!this.config) {
      this.config = {
        apiKey,
        voiceId: '9BWtsMINqrJLrRacOk9x', // Aria по умолчанию
        modelId: 'eleven_multilingual_v2',
        stability: 0.75,
        similarityBoost: 0.8,
        style: 0.5,
        speakerBoost: true
      };
    } else {
      this.config.apiKey = apiKey;
    }
    this.saveConfig();
  }

  setVoice(voiceId: string) {
    if (this.config) {
      this.config.voiceId = voiceId;
      this.saveConfig();
    }
  }

  setEmotionalSettings(emotion: string, intensity: number) {
    if (!this.config) return;

    // Настройка параметров в зависимости от эмоции
    switch (emotion) {
      case 'happy':
      case 'excited':
        this.config.stability = 0.85;
        this.config.style = 0.8;
        this.config.similarityBoost = 0.9;
        break;
      case 'sad':
      case 'melancholic':
        this.config.stability = 0.6;
        this.config.style = 0.3;
        this.config.similarityBoost = 0.7;
        break;
      case 'angry':
        this.config.stability = 0.9;
        this.config.style = 0.9;
        this.config.similarityBoost = 0.95;
        break;
      case 'calm':
      case 'peaceful':
        this.config.stability = 0.7;
        this.config.style = 0.4;
        this.config.similarityBoost = 0.75;
        break;
      case 'mysterious':
        this.config.stability = 0.65;
        this.config.style = 0.6;
        this.config.similarityBoost = 0.8;
        break;
      default:
        this.config.stability = 0.75;
        this.config.style = 0.5;
        this.config.similarityBoost = 0.8;
    }

    // Корректировка интенсивности
    this.config.style = Math.min(1, this.config.style * intensity);
    this.saveConfig();
  }

  async speak(text: string, emotion?: string): Promise<void> {
    if (!this.config?.apiKey) {
      console.warn('ElevenLabs API key not configured');
      return;
    }

    try {
      // Настраиваем эмоциональные параметры
      if (emotion) {
        this.setEmotionalSettings(emotion, 1.0);
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: this.config.modelId,
          voice_settings: {
            stability: this.config.stability,
            similarity_boost: this.config.similarityBoost,
            style: this.config.style,
            use_speaker_boost: this.config.speakerBoost
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Останавливаем предыдущее воспроизведение
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Воспроизводим новое аудио
      this.currentAudio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) return reject();
        
        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        this.currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        this.currentAudio.play().catch(reject);
      });

    } catch (error) {
      console.error('ElevenLabs speech error:', error);
      throw error;
    }
  }

  async generatePersonalVoice(audioSamples: Blob[], name: string): Promise<string> {
    if (!this.config?.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', `Персональный голос для ${name}`);
      
      audioSamples.forEach((sample, index) => {
        formData.append('files', sample, `sample_${index}.wav`);
      });

      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Voice generation error: ${response.status}`);
      }

      const result = await response.json();
      console.log('🎤 Personal voice created:', result.voice_id);
      return result.voice_id;

    } catch (error) {
      console.error('Personal voice generation error:', error);
      throw error;
    }
  }

  getAvailableVoices(): VoiceModel[] {
    return [...this.voices];
  }

  getCurrentVoice(): VoiceModel | null {
    if (!this.config) return null;
    return this.voices.find(v => v.id === this.config?.voiceId) || null;
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  isConfigured(): boolean {
    return !!this.config?.apiKey;
  }
}

export const elevenLabsService = new ElevenLabsService();
