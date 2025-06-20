
class EnhancedSpeechService {
  private synthesis: SpeechSynthesis;
  private elevenLabsApiKey = 'sk_812f7d7ea6623a533ddab8b7d39cfe44fbe2243dd83d1268';
  private isElevenLabsEnabled = true;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async speak(text: string, emotion: string = 'neutral'): Promise<void> {
    if (this.isElevenLabsEnabled && this.elevenLabsApiKey) {
      try {
        await this.speakWithElevenLabs(text, emotion);
        return;
      } catch (error) {
        console.error('ElevenLabs error, falling back to browser TTS:', error);
      }
    }
    
    // Fallback to browser speech
    this.speakWithBrowser(text);
  }

  private async speakWithElevenLabs(text: string, emotion: string): Promise<void> {
    const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = reject;
      audio.play().catch(reject);
    });
  }

  private speakWithBrowser(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.synthesis.getVoices();
    
    // Ищем русский женский голос
    const russianVoice = voices.find(voice => 
      voice.lang.includes('ru') && 
      (voice.name.includes('female') || voice.name.includes('Anna'))
    ) || voices.find(voice => voice.lang.includes('ru'));
    
    if (russianVoice) {
      utterance.voice = russianVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    this.synthesis.speak(utterance);
  }

  stop(): void {
    this.synthesis.cancel();
  }
}

export const enhancedSpeechService = new EnhancedSpeechService();
