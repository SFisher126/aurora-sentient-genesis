
interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  gradient?: string;
  mood?: string;
}

class ThemeService {
  private currentTheme: Theme;
  private themes: Theme[] = [
    {
      id: 'dark',
      name: 'Темная тема',
      mood: 'calm',
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#9ca3af'
      }
    },
    {
      id: 'light',
      name: 'Светлая тема',
      mood: 'cheerful',
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280'
      }
    },
    {
      id: 'romantic',
      name: 'Романтическая',
      mood: 'loving',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      colors: {
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#fbbf24',
        background: '#1f1129',
        surface: '#2a1f3d',
        text: '#fdf2f8',
        textSecondary: '#d8b4fe'
      }
    },
    {
      id: 'nature',
      name: 'Природная',
      mood: 'peaceful',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      colors: {
        primary: '#10b981',
        secondary: '#34d399',
        accent: '#fbbf24',
        background: '#0f1419',
        surface: '#1a2e21',
        text: '#ecfdf5',
        textSecondary: '#86efac'
      }
    },
    {
      id: 'ocean',
      name: 'Океанская',
      mood: 'serene',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      colors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#f59e0b',
        background: '#0c1825',
        surface: '#1e293b',
        text: '#f0f9ff',
        textSecondary: '#7dd3fc'
      }
    },
    {
      id: 'sunset',
      name: 'Закатная',
      mood: 'warm',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      colors: {
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#fbbf24',
        background: '#1c1917',
        surface: '#292524',
        text: '#fffbeb',
        textSecondary: '#fdba74'
      }
    },
    {
      id: 'galaxy',
      name: 'Галактическая',
      mood: 'mysterious',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#fbbf24',
        background: '#0f0b1a',
        surface: '#1e1b31',
        text: '#f3e8ff',
        textSecondary: '#c4b5fd'
      }
    },
    {
      id: 'monochrome',
      name: 'Монохромная',
      mood: 'focused',
      colors: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#000000',
        surface: '#111111',
        text: '#ffffff',
        textSecondary: '#9ca3af'
      }
    }
  ];

  constructor() {
    this.currentTheme = this.loadTheme() || this.themes[0];
    this.applyTheme(this.currentTheme);
  }

  private loadTheme(): Theme | null {
    try {
      const saved = localStorage.getItem('anyuta_theme');
      if (saved) {
        const themeId = JSON.parse(saved);
        return this.themes.find(t => t.id === themeId) || null;
      }
    } catch (error) {
      console.error('Theme loading error:', error);
    }
    return null;
  }

  private saveTheme(theme: Theme) {
    localStorage.setItem('anyuta_theme', JSON.stringify(theme.id));
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--surface', theme.colors.surface);
    root.style.setProperty('--text', theme.colors.text);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    
    if (theme.gradient) {
      root.style.setProperty('--gradient', theme.gradient);
    }

    document.body.className = `theme-${theme.id}`;
  }

  setTheme(themeId: string) {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.saveTheme(theme);
      console.log('🎨 Theme changed to:', theme.name);
    }
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  getAllThemes(): Theme[] {
    return [...this.themes];
  }

  setAdaptiveTheme(mood: string, timeOfDay: 'morning' | 'day' | 'evening' | 'night') {
    let selectedTheme: Theme;

    // Адаптивный выбор темы по настроению и времени
    if (mood === 'happy' || mood === 'excited') {
      selectedTheme = timeOfDay === 'night' ? this.themes[4] : this.themes[1]; // Ocean или Light
    } else if (mood === 'sad' || mood === 'melancholic') {
      selectedTheme = this.themes[0]; // Dark
    } else if (mood === 'romantic' || mood === 'loving') {
      selectedTheme = this.themes[2]; // Romantic
    } else if (mood === 'calm' || mood === 'peaceful') {
      selectedTheme = timeOfDay === 'evening' ? this.themes[5] : this.themes[3]; // Sunset или Nature
    } else if (mood === 'mysterious' || mood === 'thoughtful') {
      selectedTheme = this.themes[6]; // Galaxy
    } else {
      selectedTheme = timeOfDay === 'night' ? this.themes[0] : this.themes[1]; // Default
    }

    this.setTheme(selectedTheme.id);
  }

  getTypographySize(mood: string): string {
    switch (mood) {
      case 'excited':
      case 'happy':
        return 'text-lg';
      case 'calm':
      case 'peaceful':
        return 'text-base';
      case 'sad':
      case 'melancholic':
        return 'text-sm';
      case 'mysterious':
        return 'text-base font-light';
      default:
        return 'text-base';
    }
  }
}

export const themeService = new ThemeService();
