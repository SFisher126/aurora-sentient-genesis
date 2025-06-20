
interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  mood: 'calm' | 'energetic' | 'romantic' | 'professional' | 'creative' | 'dark' | 'bright';
  typography: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
  };
}

class AdvancedThemeService {
  private themes: ThemeConfig[] = [
    {
      id: 'midnight-purple',
      name: 'Полночный пурпур',
      colors: {
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        background: '#0F0F23',
        surface: '#1A1A2E',
        text: '#FFFFFF',
        accent: '#F59E0B'
      },
      mood: 'calm',
      typography: { fontSize: 'medium', fontFamily: 'Inter' }
    },
    {
      id: 'rose-gold',
      name: 'Розовое золото',
      colors: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        background: '#1F1F1F',
        surface: '#2D2D2D',
        text: '#FFFFFF',
        accent: '#EC4899'
      },
      mood: 'romantic',
      typography: { fontSize: 'medium', fontFamily: 'Poppins' }
    },
    {
      id: 'ocean-depth',
      name: 'Глубина океана',
      colors: {
        primary: '#0EA5E9',
        secondary: '#38BDF8',
        background: '#0C1421',
        surface: '#1E293B',
        text: '#FFFFFF',
        accent: '#10B981'
      },
      mood: 'calm',
      typography: { fontSize: 'medium', fontFamily: 'Inter' }
    },
    {
      id: 'forest-green',
      name: 'Лесная зелень',
      colors: {
        primary: '#10B981',
        secondary: '#34D399',
        background: '#064E3B',
        surface: '#065F46',
        text: '#FFFFFF',
        accent: '#F59E0B'
      },
      mood: 'calm',
      typography: { fontSize: 'medium', fontFamily: 'Inter' }
    },
    {
      id: 'sunset-fire',
      name: 'Закатный огонь',
      colors: {
        primary: '#DC2626',
        secondary: '#EF4444',
        background: '#431407',
        surface: '#7C2D12',
        text: '#FFFFFF',
        accent: '#F59E0B'
      },
      mood: 'energetic',
      typography: { fontSize: 'medium', fontFamily: 'Inter' }
    },
    {
      id: 'cosmic-purple',
      name: 'Космический пурпур',
      colors: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        background: '#1E1B4B',
        surface: '#312E81',
        text: '#FFFFFF',
        accent: '#F472B6'
      },
      mood: 'creative',
      typography: { fontSize: 'medium', fontFamily: 'Inter' }
    },
    {
      id: 'monochrome',
      name: 'Монохром',
      colors: {
        primary: '#FFFFFF',
        secondary: '#D1D5DB',
        background: '#000000',
        surface: '#1F2937',
        text: '#FFFFFF',
        accent: '#6B7280'
      },
      mood: 'professional',
      typography: { fontSize: 'medium', fontFamily: 'Roboto Mono' }
    },
    {
      id: 'neon-cyber',
      name: 'Неоновый кибер',
      colors: {
        primary: '#00FF88',
        secondary: '#00CCFF',
        background: '#0A0A0A',
        surface: '#1A1A1A',
        text: '#00FF88',
        accent: '#FF0080'
      },
      mood: 'energetic',
      typography: { fontSize: 'medium', fontFamily: 'Orbitron' }
    }
  ];

  private currentTheme: ThemeConfig;
  private userMood: string = 'calm';

  constructor() {
    this.currentTheme = this.themes[0];
    this.loadTheme();
  }

  private loadTheme() {
    const saved = localStorage.getItem('anyuta_theme');
    if (saved) {
      const savedTheme = this.themes.find(t => t.id === saved);
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }
    }
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;
    const theme = this.currentTheme;

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);

    // Применяем типографику
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };

    root.style.setProperty('--font-size-base', fontSizes[theme.typography.fontSize]);
    root.style.setProperty('--font-family-base', theme.typography.fontFamily);

    console.log(`🎨 Применена тема: ${theme.name}`);
  }

  setTheme(themeId: string) {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentTheme = theme;
      localStorage.setItem('anyuta_theme', themeId);
      this.applyTheme();
    }
  }

  adaptToMood(emotion: string) {
    const moodThemeMap = {
      радость: 'sunset-fire',
      грусть: 'ocean-depth',
      злость: 'neon-cyber',
      спокойствие: 'midnight-purple',
      любовь: 'rose-gold',
      творчество: 'cosmic-purple'
    };

    const recommendedTheme = moodThemeMap[emotion as keyof typeof moodThemeMap];
    if (recommendedTheme && this.currentTheme.id !== recommendedTheme) {
      this.setTheme(recommendedTheme);
      return `Я поменяла тему на "${this.currentTheme.name}" под твое настроение! 🎨`;
    }
    return null;
  }

  getThemes() {
    return this.themes;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  createAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .anyuta-smooth-transition {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .anyuta-pulse {
        animation: anyuta-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes anyuta-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .anyuta-float {
        animation: anyuta-float 3s ease-in-out infinite;
      }
      
      @keyframes anyuta-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .anyuta-glow {
        box-shadow: 0 0 20px var(--color-primary);
        transition: box-shadow 0.3s ease;
      }
    `;
    
    if (!document.querySelector('#anyuta-animations')) {
      style.id = 'anyuta-animations';
      document.head.appendChild(style);
    }
  }
}

export const advancedThemeService = new AdvancedThemeService();
