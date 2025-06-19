
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  capabilities: string[];
  init: () => Promise<void>;
  destroy: () => Promise<void>;
  execute: (command: string, params: any) => Promise<any>;
}

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  capabilities: string[];
  entryPoint: string;
}

class PluginSystem {
  private plugins: Map<string, Plugin> = new Map();
  private enabledPlugins: Set<string> = new Set();

  constructor() {
    this.loadEnabledPlugins();
    this.initializeBuiltinPlugins();
  }

  private loadEnabledPlugins() {
    try {
      const saved = localStorage.getItem('anyuta_enabled_plugins');
      if (saved) {
        const enabled = JSON.parse(saved);
        this.enabledPlugins = new Set(enabled);
      }
    } catch (error) {
      console.error('Plugin settings loading error:', error);
    }
  }

  private saveEnabledPlugins() {
    localStorage.setItem('anyuta_enabled_plugins', JSON.stringify([...this.enabledPlugins]));
  }

  private async initializeBuiltinPlugins() {
    // Встроенный плагин для работы с погодой
    const weatherPlugin: Plugin = {
      id: 'weather',
      name: 'Погода',
      version: '1.0.0',
      description: 'Получение информации о погоде',
      author: 'Anyuta Team',
      enabled: this.enabledPlugins.has('weather'),
      capabilities: ['weather.get', 'weather.forecast'],
      
      init: async () => {
        console.log('🌤️ Weather plugin initialized');
      },
      
      destroy: async () => {
        console.log('🌤️ Weather plugin destroyed');
      },
      
      execute: async (command: string, params: any) => {
        switch (command) {
          case 'weather.get':
            return await this.getWeather(params.city);
          case 'weather.forecast':
            return await this.getForecast(params.city, params.days);
          default:
            throw new Error(`Unknown weather command: ${command}`);
        }
      }
    };

    // Встроенный плагин для переводов
    const translatorPlugin: Plugin = {
      id: 'translator',
      name: 'Переводчик',
      version: '1.0.0',
      description: 'Перевод текста между языками',
      author: 'Anyuta Team',
      enabled: this.enabledPlugins.has('translator'),
      capabilities: ['translate.text', 'translate.detect'],
      
      init: async () => {
        console.log('🌐 Translator plugin initialized');
      },
      
      destroy: async () => {
        console.log('🌐 Translator plugin destroyed');
      },
      
      execute: async (command: string, params: any) => {
        switch (command) {
          case 'translate.text':
            return await this.translateText(params.text, params.from, params.to);
          case 'translate.detect':
            return await this.detectLanguage(params.text);
          default:
            throw new Error(`Unknown translator command: ${command}`);
        }
      }
    };

    // Встроенный плагин для календаря
    const calendarPlugin: Plugin = {
      id: 'calendar',
      name: 'Календарь',
      version: '1.0.0',
      description: 'Управление событиями календаря',
      author: 'Anyuta Team',
      enabled: this.enabledPlugins.has('calendar'),
      capabilities: ['calendar.add', 'calendar.list', 'calendar.remove'],
      
      init: async () => {
        console.log('📅 Calendar plugin initialized');
      },
      
      destroy: async () => {
        console.log('📅 Calendar plugin destroyed');
      },
      
      execute: async (command: string, params: any) => {
        switch (command) {
          case 'calendar.add':
            return await this.addEvent(params.title, params.date, params.description);
          case 'calendar.list':
            return await this.listEvents(params.from, params.to);
          case 'calendar.remove':
            return await this.removeEvent(params.eventId);
          default:
            throw new Error(`Unknown calendar command: ${command}`);
        }
      }
    };

    await this.registerPlugin(weatherPlugin);
    await this.registerPlugin(translatorPlugin);
    await this.registerPlugin(calendarPlugin);
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    this.plugins.set(plugin.id, plugin);
    
    if (plugin.enabled) {
      try {
        await plugin.init();
        console.log(`🔌 Plugin ${plugin.name} enabled`);
      } catch (error) {
        console.error(`Plugin ${plugin.name} init error:`, error);
        plugin.enabled = false;
      }
    }
  }

  async enablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!plugin.enabled) {
      await plugin.init();
      plugin.enabled = true;
      this.enabledPlugins.add(pluginId);
      this.saveEnabledPlugins();
      console.log(`🔌 Plugin ${plugin.name} enabled`);
    }
  }

  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (plugin.enabled) {
      await plugin.destroy();
      plugin.enabled = false;
      this.enabledPlugins.delete(pluginId);
      this.saveEnabledPlugins();
      console.log(`🔌 Plugin ${plugin.name} disabled`);
    }
  }

  async executePlugin(pluginId: string, command: string, params: any = {}): Promise<any> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!plugin.enabled) {
      throw new Error(`Plugin ${pluginId} is disabled`);
    }

    return await plugin.execute(command, params);
  }

  getPlugins(): Plugin[] {
    return [...this.plugins.values()];
  }

  getEnabledPlugins(): Plugin[] {
    return [...this.plugins.values()].filter(p => p.enabled);
  }

  // Методы для встроенных плагинов
  private async getWeather(city: string): Promise<any> {
    // Здесь будет реальный API запрос к погодному сервису
    return {
      city,
      temperature: Math.round(Math.random() * 30 - 5),
      condition: 'Солнечно',
      humidity: Math.round(Math.random() * 100),
      windSpeed: Math.round(Math.random() * 20)
    };
  }

  private async getForecast(city: string, days: number): Promise<any> {
    const forecast = [];
    for (let i = 0; i < days; i++) {
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        temperature: Math.round(Math.random() * 30 - 5),
        condition: ['Солнечно', 'Облачно', 'Дождь', 'Снег'][Math.floor(Math.random() * 4)]
      });
    }
    return { city, forecast };
  }

  private async translateText(text: string, from: string, to: string): Promise<any> {
    // Здесь будет реальный API запрос к переводчику
    return {
      originalText: text,
      translatedText: `[Перевод с ${from} на ${to}]: ${text}`,
      fromLanguage: from,
      toLanguage: to
    };
  }

  private async detectLanguage(text: string): Promise<any> {
    // Простое определение языка
    const russianPattern = /[а-яё]/i;
    const detectedLanguage = russianPattern.test(text) ? 'ru' : 'en';
    
    return {
      text,
      language: detectedLanguage,
      confidence: 0.95
    };
  }

  private async addEvent(title: string, date: string, description: string): Promise<any> {
    const events = this.getStoredEvents();
    const newEvent = {
      id: Date.now().toString(),
      title,
      date: new Date(date),
      description,
      created: new Date()
    };
    
    events.push(newEvent);
    localStorage.setItem('anyuta_calendar_events', JSON.stringify(events));
    
    return newEvent;
  }

  private async listEvents(from?: string, to?: string): Promise<any> {
    const events = this.getStoredEvents();
    let filteredEvents = events;

    if (from || to) {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date(2099, 11, 31);
      
      filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }

    return filteredEvents;
  }

  private async removeEvent(eventId: string): Promise<any> {
    const events = this.getStoredEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem('anyuta_calendar_events', JSON.stringify(filteredEvents));
    
    return { success: true, removedEventId: eventId };
  }

  private getStoredEvents(): any[] {
    try {
      const saved = localStorage.getItem('anyuta_calendar_events');
      return saved ? JSON.parse(saved).map((e: any) => ({
        ...e,
        date: new Date(e.date),
        created: new Date(e.created)
      })) : [];
    } catch {
      return [];
    }
  }
}

export const pluginSystem = new PluginSystem();
