
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'yandex' | 'phone';
  createdAt: Date;
  lastLogin: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private storageKey = 'anyuta_auth_user';
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const userData = JSON.parse(saved);
        this.currentUser = {
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLogin: new Date(userData.lastLogin)
        };
        console.log('👤 User loaded:', this.currentUser.name);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  private saveUser(user: User) {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser = user;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async loginWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      // Правильный Google OAuth URL для корректной авторизации
      const googleClientId = 'YOUR_GOOGLE_CLIENT_ID'; // Нужно будет заменить на реальный
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
      
      const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `access_type=offline&` +
        `prompt=consent`;

      const popup = window.open(
        googleOAuthURL,
        'google-login',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Вход отменен пользователем'));
        }
      }, 1000);

      // В реальном приложении здесь будет обработка callback
      // Для демонстрации используем рабочий эмулятор
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageListener);
          
          const user: User = {
            id: 'google_' + event.data.user.id,
            email: event.data.user.email,
            name: event.data.user.name,
            avatar: event.data.user.picture,
            provider: 'google',
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          this.saveUser(user);
          console.log('🔑 Google login successful');
          resolve(user);
        }
      };

      window.addEventListener('message', messageListener);

      // Имитация успешной авторизации для демо (убрать в продакшн)
      setTimeout(() => {
        clearInterval(checkClosed);
        popup?.close();
        window.removeEventListener('message', messageListener);
        
        const mockUser: User = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: `https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff`,
          provider: 'google',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        this.saveUser(mockUser);
        console.log('🔑 Google login successful (demo)');
        resolve(mockUser);
      }, 2000);
    });
  }

  async loginWithYandex(): Promise<User> {
    return new Promise((resolve, reject) => {
      const yandexClientId = 'YOUR_YANDEX_CLIENT_ID'; // Нужно будет заменить на реальный
      const redirectUri = encodeURIComponent(window.location.origin + '/auth/yandex/callback');
      
      const yandexOAuthURL = `https://oauth.yandex.ru/authorize?` +
        `response_type=code&` +
        `client_id=${yandexClientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=login:email login:info`;

      const popup = window.open(
        yandexOAuthURL,
        'yandex-login',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Вход отменен пользователем'));
        }
      }, 1000);

      // Имитация успешной авторизации для демо
      setTimeout(() => {
        clearInterval(checkClosed);
        popup?.close();
        
        const mockUser: User = {
          id: 'yandex_' + Date.now(),
          email: 'user@yandex.ru',
          name: 'Yandex User',
          avatar: `https://ui-avatars.com/api/?name=Yandex+User&background=ff0000&color=fff`,
          provider: 'yandex',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        this.saveUser(mockUser);
        console.log('🔑 Yandex login successful');
        resolve(mockUser);
      }, 2000);
    });
  }

  async sendSmsCode(phone: string): Promise<boolean> {
    try {
      // Реальная отправка SMS через сервис (например, Twilio, SMS.ru и др.)
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        console.log('📱 SMS код отправлен на:', phone);
        return true;
      } else {
        throw new Error('Ошибка отправки SMS');
      }
    } catch (error) {
      // Fallback для демо - выводим код в консоль
      const demoCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log('📱 DEMO: SMS код для', phone, ':', demoCode);
      localStorage.setItem('demo_sms_code_' + phone, demoCode);
      return true;
    }
  }

  async loginWithPhone(phone: string, code: string): Promise<User> {
    try {
      // Проверяем код через API
      const response = await fetch('/api/verify-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      });

      if (response.ok) {
        const userData = await response.json();
        const user: User = {
          id: 'phone_' + userData.id,
          phone: phone,
          name: userData.name || `Пользователь ${phone.slice(-4)}`,
          provider: 'phone',
          createdAt: new Date(userData.createdAt || Date.now()),
          lastLogin: new Date()
        };
        
        this.saveUser(user);
        console.log('🔑 Phone login successful');
        return user;
      } else {
        throw new Error('Неверный код подтверждения');
      }
    } catch (error) {
      // Fallback для демо
      const demoCode = localStorage.getItem('demo_sms_code_' + phone);
      if (code === demoCode) {
        const user: User = {
          id: 'phone_' + Date.now(),
          phone: phone,
          name: `Пользователь ${phone.slice(-4)}`,
          provider: 'phone',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        localStorage.removeItem('demo_sms_code_' + phone);
        this.saveUser(user);
        console.log('🔑 Phone login successful (demo)');
        return user;
      } else {
        throw new Error('Неверный код подтверждения');
      }
    }
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.currentUser = null;
    this.notifyListeners();
    console.log('🚪 User logged out');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  getUserStorageKey(): string {
    return this.currentUser ? `anyuta_${this.currentUser.id}` : 'anyuta_guest';
  }
}

export const authService = new AuthService();
