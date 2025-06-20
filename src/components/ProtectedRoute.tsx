
import React from 'react';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">🔒 Требуется авторизация</h2>
          <p className="text-gray-400">Войдите в систему для доступа к этой функции</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
