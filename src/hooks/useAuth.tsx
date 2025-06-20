
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  avatar?: string;
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

  const logout = () => {
    authService.logout();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
};
