
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
      // Создаем окно для Google OAuth
      const googleOAuthURL = `https://accounts.google.com/oauth/authorize?` +
        `client_id=YOUR_GOOGLE_CLIENT_ID&` +
        `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
        `response_type=token&` +
        `scope=email profile`;

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

      // Слушаем сообщения от окна OAuth
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
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageListener);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);

      // Для демонстрации - эмулируем успешный вход через 2 секунды
      // В реальном проекте это будет обрабатываться через redirect_uri
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
        console.log('🔑 Google login successful');
        resolve(mockUser);
      }, 2000);
    });
  }

  async loginWithYandex(): Promise<User> {
    return new Promise((resolve, reject) => {
      // Создаем окно для Yandex OAuth
      const yandexOAuthURL = `https://oauth.yandex.ru/authorize?` +
        `response_type=token&` +
        `client_id=YOUR_YANDEX_CLIENT_ID&` +
        `redirect_uri=${encodeURIComponent(window.location.origin)}`;

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

      // Слушаем сообщения от окна OAuth
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'YANDEX_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageListener);
          
          const user: User = {
            id: 'yandex_' + event.data.user.id,
            email: event.data.user.default_email,
            name: event.data.user.display_name,
            avatar: `https://avatars.yandex.net/get-yapic/${event.data.user.default_avatar_id}/islands-200`,
            provider: 'yandex',
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          this.saveUser(user);
          console.log('🔑 Yandex login successful');
          resolve(user);
        } else if (event.data.type === 'YANDEX_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup?.close();
          window.removeEventListener('message', messageListener);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);

      // Для демонстрации - эмулируем успешный вход через 2 секунды
      // В реальном проекте это будет обрабатываться через redirect_uri
      setTimeout(() => {
        clearInterval(checkClosed);
        popup?.close();
        window.removeEventListener('message', messageListener);
        
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

  async loginWithPhone(phone: string, code: string): Promise<User> {
    // Эмуляция SMS аутентификации
    if (code === '1234') {
      const user: User = {
        id: 'phone_' + Date.now(),
        phone: phone,
        name: `Пользователь ${phone.slice(-4)}`,
        provider: 'phone',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      this.saveUser(user);
      console.log('🔑 Phone login successful');
      return user;
    } else {
      throw new Error('Неверный код подтверждения');
    }
  }

  async sendSmsCode(phone: string): Promise<boolean> {
    // Эмуляция отправки SMS
    console.log('📱 SMS код отправлен на:', phone);
    return true;
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
    // Немедленно вызываем с текущим состоянием
    callback(this.currentUser);
    
    // Возвращаем функцию отписки
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  getUserStorageKey(): string {
    return this.currentUser ? `anyuta_${this.currentUser.id}` : 'anyuta_guest';
  }
}

export const authService = new AuthService();
