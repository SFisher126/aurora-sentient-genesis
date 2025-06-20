
class APIKeyService {
  private keys = {
    openai: '',
    huggingface: '',
    elevenlabs: '',
    russian_api: ''
  };

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    this.keys.openai = localStorage.getItem('openai_key') || '';
    this.keys.huggingface = localStorage.getItem('hf_api_key') || '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';
    this.keys.elevenlabs = localStorage.getItem('elevenlabs_key') || '';
    this.keys.russian_api = localStorage.getItem('russian_api_key') || '';
  }

  setOpenAIKey(key: string) {
    this.keys.openai = key;
    localStorage.setItem('openai_key', key);
    console.log('🔑 OpenAI API key установлен');
  }

  setHuggingFaceKey(key: string) {
    this.keys.huggingface = key;
    localStorage.setItem('hf_api_key', key);
    console.log('🔑 HuggingFace API key установлен');
  }

  setElevenLabsKey(key: string) {
    this.keys.elevenlabs = key;
    localStorage.setItem('elevenlabs_key', key);
    console.log('🔑 ElevenLabs API key установлен');
  }

  setRussianAPIKey(key: string) {
    this.keys.russian_api = key;
    localStorage.setItem('russian_api_key', key);
    console.log('🔑 Russian API key установлен');
  }

  getOpenAIKey(): string {
    return this.keys.openai;
  }

  getHuggingFaceKey(): string {
    return this.keys.huggingface;
  }

  getElevenLabsKey(): string {
    return this.keys.elevenlabs;
  }

  getRussianAPIKey(): string {
    return this.keys.russian_api;
  }

  hasAnyKey(): boolean {
    return !!(this.keys.openai || this.keys.huggingface || this.keys.russian_api);
  }
}

export const apiKeyService = new APIKeyService();
