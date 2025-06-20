
class APIKeyService {
  private keys = {
    openai: '',
    huggingface: '',
    elevenlabs: '',
    russian_api: ''
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    this.keys.openai = localStorage.getItem('openai_key') || '';
    this.keys.huggingface = localStorage.getItem('hf_api_key') || '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';
    this.keys.elevenlabs = localStorage.getItem('elevenlabs_key') || '';
    this.keys.russian_api = localStorage.getItem('russian_api_key') || '';
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setOpenAIKey(key: string) {
    this.keys.openai = key;
    localStorage.setItem('openai_key', key);
    this.notifyListeners();
    console.log('🔑 OpenAI API key установлен и обновлен');
  }

  setHuggingFaceKey(key: string) {
    this.keys.huggingface = key;
    localStorage.setItem('hf_api_key', key);
    this.notifyListeners();
    console.log('🔑 HuggingFace API key установлен и обновлен');
  }

  setElevenLabsKey(key: string) {
    this.keys.elevenlabs = key;
    localStorage.setItem('elevenlabs_key', key);
    this.notifyListeners();
    console.log('🔑 ElevenLabs API key установлен и обновлен');
  }

  setRussianAPIKey(key: string) {
    this.keys.russian_api = key;
    localStorage.setItem('russian_api_key', key);
    this.notifyListeners();
    console.log('🔑 Russian API key установлен и обновлен');
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

  hasElevenLabsKey(): boolean {
    return !!this.keys.elevenlabs;
  }

  getAllKeys() {
    return { ...this.keys };
  }
}

export const apiKeyService = new APIKeyService();
