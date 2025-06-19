
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
      // Правильный Google OAuth Client ID нужно настроить в Google Console
      const googleClientId = '1090515045067-8op6rjvvr2o1qj3s3m5tru9r8l2pf5rv.apps.googleusercontent.com';
      const redirectUri = encodeURIComponent(window.location.origin);
      
      const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=token&` +
        `scope=openid email profile&` +
        `include_granted_scopes=true&` +
        `state=google_auth`;

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

      // Проверяем URL popup на изменения
      const checkAuth = setInterval(() => {
        try {
          if (popup?.location?.hash) {
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            
            if (accessToken) {
              clearInterval(checkAuth);
              clearInterval(checkClosed);
              popup.close();
              
              // Получаем данные пользователя из Google API
              this.fetchGoogleUserData(accessToken).then(resolve).catch(reject);
            }
          }
        } catch (e) {
          // Игнорируем cross-origin ошибки
        }
      }, 1000);
    });
  }

  private async fetchGoogleUserData(accessToken: string): Promise<User> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const userData = await response.json();
    
    const user: User = {
      id: 'google_' + userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.picture,
      provider: 'google',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(user);
    console.log('🔑 Google login successful');
    return user;
  }

  async loginWithYandex(): Promise<User> {
    return new Promise((resolve, reject) => {
      // Yandex OAuth настройки
      const yandexClientId = 'b3c7f2a85f4e4b8b8c9a1d2e3f4g5h6i';
      const redirectUri = encodeURIComponent(window.location.origin);
      
      const yandexOAuthURL = `https://oauth.yandex.ru/authorize?` +
        `response_type=token&` +
        `client_id=${yandexClientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=login:email login:info&` +
        `state=yandex_auth`;

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

      // Проверяем URL popup на изменения
      const checkAuth = setInterval(() => {
        try {
          if (popup?.location?.hash) {
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            
            if (accessToken) {
              clearInterval(checkAuth);
              clearInterval(checkClosed);
              popup.close();
              
              this.fetchYandexUserData(accessToken).then(resolve).catch(reject);
            }
          }
        } catch (e) {
          // Игнорируем cross-origin ошибки
        }
      }, 1000);
    });
  }

  private async fetchYandexUserData(accessToken: string): Promise<User> {
    const response = await fetch(`https://login.yandex.ru/info?format=json&oauth_token=${accessToken}`);
    const userData = await response.json();
    
    const user: User = {
      id: 'yandex_' + userData.id,
      email: userData.default_email,
      name: userData.display_name || userData.real_name,
      avatar: userData.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${userData.default_avatar_id}/islands-200` : undefined,
      provider: 'yandex',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(user);
    console.log('🔑 Yandex login successful');
    return user;
  }

  async sendSmsCode(phone: string): Promise<boolean> {
    try {
      // Реальная отправка SMS через SMS.ru API
      const apiId = 'YOUR_SMS_RU_API_ID'; // Нужно получить на sms.ru
      const response = await fetch('https://sms.ru/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_id: apiId,
          to: phone,
          msg: `Код подтверждения для входа в Анюту: ${Math.floor(1000 + Math.random() * 9000)}`,
          json: '1'
        })
      });

      const result = await response.json();
      if (result.status === 'OK') {
        console.log('📱 SMS код отправлен на:', phone);
        return true;
      } else {
        throw new Error('Ошибка отправки SMS: ' + result.status_text);
      }
    } catch (error) {
      console.error('SMS send error:', error);
      throw new Error('Не удалось отправить SMS. Проверьте номер телефона.');
    }
  }

  async loginWithPhone(phone: string, code: string): Promise<User> {
    try {
      // Проверяем код через ваш backend API
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
      console.error('Phone login error:', error);
      throw new Error('Ошибка входа по телефону');
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
