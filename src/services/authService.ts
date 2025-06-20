
interface User {
  id: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
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

  async simpleLogin(): Promise<User> {
    const user: User = {
      id: 'user_' + Date.now(),
      name: 'Пользователь Анюты',
      avatar: '👤',
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    this.saveUser(user);
    console.log('🔑 Simple login successful');
    return user;
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
