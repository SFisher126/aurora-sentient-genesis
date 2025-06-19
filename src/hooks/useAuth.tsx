
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (provider: 'google' | 'yandex') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await authService.loginWithGoogle();
      } else if (provider === 'yandex') {
        await authService.loginWithYandex();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
};
