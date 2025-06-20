
class EnhancedElevenLabsService {
  private apiKey = 'sk_812f7d7ea6623a533ddab8b7d39cfe44fbe2243dd83d1268';
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private currentVoiceId = '9BWtsMINqrJLrRacOk9x'; // Aria - женский голос
  
  // Голосовые модели для разных эмоций
  private emotionalVoices = {
    радость: { voiceId: '9BWtsMINqrJLrRacOk9x', stability: 0.8, similarity: 0.8 },
    грусть: { voiceId: 'EXAVITQu4vr4xnSDxMaL', stability: 0.6, similarity: 0.9 },
    злость: { voiceId: 'cgSgspJ2msm6clMCkdW9', stability: 0.9, similarity: 0.7 },
    нейтральность: { voiceId: '9BWtsMINqrJLrRacOk9x', stability: 0.75, similarity: 0.8 }
  };

  async speak(text: string, emotion: string = 'нейтральность'): Promise<void> {
    try {
      const voiceConfig = this.emotionalVoices[emotion as keyof typeof this.emotionalVoices] 
                         || this.emotionalVoices.нейтральность;

      // Добавляем эмоциональные модификации к тексту
      const emotionalText = this.addEmotionalInflection(text, emotion);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: emotionalText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarity,
            style: emotion === 'радость' ? 0.3 : 0.1,
            use_speaker_boost: true
          }
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
        console.log(`🎤 Анюта говорит с эмоцией: ${emotion}`);
      } else {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка синтеза речи:', error);
      // Fallback на браузерный TTS
      this.fallbackSpeak(text);
    }
  }

  private addEmotionalInflection(text: string, emotion: string): string {
    switch (emotion) {
      case 'радость':
        return text.replace(/\./g, '!').replace(/[,;]/g, ', ');
      case 'грусть':
        return text.replace(/!/g, '...').replace(/\?/g, '...');
      case 'злость':
        return text.toUpperCase().replace(/\./g, '!');
      default:
        return text;
    }
  }

  private fallbackSpeak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const russianVoice = voices.find(voice => voice.lang.includes('ru'));
    
    if (russianVoice) {
      utterance.voice = russianVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }

  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.voices;
      }
    } catch (error) {
      console.error('Ошибка получения голосов:', error);
    }
    return [];
  }

  setVoice(voiceId: string): void {
    this.currentVoiceId = voiceId;
  }

  async createPersonalVoice(name: string, audioSamples: Blob[]): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      
      audioSamples.forEach((sample, index) => {
        formData.append(`files`, sample, `sample_${index}.wav`);
      });

      const response = await fetch(`${this.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`🎭 Создан персональный голос: ${name}`);
        return data.voice_id;
      }
    } catch (error) {
      console.error('Ошибка создания персонального голоса:', error);
    }
    return null;
  }
}

export const enhancedElevenLabsService = new EnhancedElevenLabsService();
