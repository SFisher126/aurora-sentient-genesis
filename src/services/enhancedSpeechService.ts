
interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voiceIndex: number;
}

class EnhancedSpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: any;
  private isSupported: boolean;
  private voices: SpeechSynthesisVoice[] = [];
  private config: VoiceConfig = {
    rate: 0.95,
    pitch: 1.1,
    volume: 0.9,
    voiceIndex: -1
  };
  private isSpeaking: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    
    if (this.isSupported) {
      this.loadVoices();
      this.synthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }

    this.initializeSpeechRecognition();
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
    console.log('🎤 Available voices loaded:', this.voices.length);
    
    // Ищем лучший русский женский голос для Анюты
    const russianVoices = this.voices.filter(voice => 
      voice.lang.includes('ru') || voice.lang.includes('RU')
    );
    
    if (russianVoices.length > 0) {
      const femaleVoice = russianVoices.find(voice => 
        voice.name.toLowerCase().includes('anna') ||
        voice.name.toLowerCase().includes('alena') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('maria')
      );
      
      if (femaleVoice) {
        this.config.voiceIndex = this.voices.indexOf(femaleVoice);
        console.log('👩 Selected voice for Anuta:', femaleVoice.name);
      }
    }
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ru-RU';
      this.recognition.maxAlternatives = 1;
      
      console.log('🎙️ Speech recognition initialized');
    } else {
      console.warn('Speech recognition not supported');
    }
  }

  async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      // Останавливаем текущую речь
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Настройки голоса для Анюты
      if (this.config.voiceIndex >= 0 && this.voices[this.config.voiceIndex]) {
        utterance.voice = this.voices[this.config.voiceIndex];
      }
      
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;

      // Эмоциональность в речи
      if (text.includes('!') || text.includes('💕')) {
        utterance.rate = Math.min(1.1, utterance.rate * 1.05);
        utterance.pitch = Math.min(2.0, utterance.pitch * 1.05);
      }
      
      if (text.includes('...') || text.includes('думаю')) {
        utterance.rate = Math.max(0.8, utterance.rate * 0.95);
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('🗣️ Anuta started speaking:', text.slice(0, 50));
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log('🤐 Anuta finished speaking');
        resolve();
      };

      utterance.onerror = (error) => {
        this.isSpeaking = false;
        console.error('Speech error:', error);
        resolve(); // Не отклоняем, чтобы не ломать поток
      };

      this.synthesis.speak(utterance);
    });
  }

  startListening(onResult: (text: string) => void, onError?: (error: any) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not available';
        console.warn(error);
        onError?.(error);
        reject(error);
        return;
      }

      if (this.isListening) {
        console.log('Already listening...');
        resolve();
        return;
      }

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('🎙️ Started listening...');
        resolve();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          console.log('🎤 User said:', finalTranscript);
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('🔇 Stopped listening');
      };

      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        this.isListening = false;
        onError?.(error);
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('🔇 Manually stopped listening');
    }
  }

  stop() {
    if (this.isSupported) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
    this.stopListening();
  }

  getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  getListeningState(): boolean {
    return this.isListening;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  setVoiceConfig(config: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...config };
    console.log('🎛️ Voice config updated:', this.config);
  }
}

export const enhancedSpeechService = new EnhancedSpeechService();
