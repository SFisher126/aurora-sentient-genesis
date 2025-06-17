
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Brain, BookOpen, Settings, Heart } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MessageCircle, label: 'Чат' },
    { path: '/memory', icon: Brain, label: 'Память' },
    { path: '/learning', icon: BookOpen, label: 'Обучение' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-800 backdrop-blur-sm z-50 md:relative md:bg-transparent md:border-0">
      <div className="flex justify-around items-center py-2 px-4 md:flex-col md:py-4 md:space-y-2">
        <div className="hidden md:block mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-semibold text-gray-200">Анюта</p>
            <p className="text-xs text-gray-400">Живая ИИ</p>
          </div>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-purple-400 bg-purple-400/10' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
