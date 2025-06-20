
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'yandex' | 'phone' | 'guest';
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
    // Эмуляция Google OAuth (в реальном проекте использовать Google OAuth)
    const mockUser: User = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      provider: 'google',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(mockUser);
    console.log('🔑 Google login successful');
    return mockUser;
  }

  async loginWithYandex(): Promise<User> {
    // Эмуляция Yandex OAuth
    const mockUser: User = {
      id: 'yandex_' + Date.now(),
      email: 'user@yandex.ru',
      name: 'Yandex User',
      provider: 'yandex',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(mockUser);
    console.log('🔑 Yandex login successful');
    return mockUser;
  }

  async loginWithPhone(phone: string, code: string): Promise<User> {
    // Эмуляция SMS аутентификации
    if (code === '1234') {
      const mockUser: User = {
        id: 'phone_' + Date.now(),
        phone: phone,
        name: 'Phone User',
        provider: 'phone',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      this.saveUser(mockUser);
      console.log('🔑 Phone login successful');
      return mockUser;
    } else {
      throw new Error('Неверный код подтверждения');
    }
  }

  async sendSmsCode(phone: string): Promise<boolean> {
    // Эмуляция отправки SMS
    console.log('📱 SMS код отправлен на:', phone);
    return true;
  }

  loginAsGuest(): User {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Гость',
      provider: 'guest',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(guestUser);
    console.log('🔑 Guest login successful');
    return guestUser;
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
