
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Brain, BookOpen, Settings, Wrench, Heart } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MessageCircle, label: 'Чат', name: 'Чат' },
    { path: '/memory', icon: Brain, label: 'Память', name: 'Память' },
    { path: '/learning', icon: BookOpen, label: 'Обучение', name: 'Обучение' },
    { path: '/settings', icon: Settings, label: 'Настройки', name: 'Настройки' },
    { path: '/api-settings', icon: Wrench, label: 'API', name: 'API' }
  ];

  return (
    <div className="bg-gray-800 h-full w-64 fixed left-0 top-0 overflow-y-auto border-r border-gray-700">
      <div className="p-6">
        {/* Логотип */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Анюта</h1>
            <p className="text-xs text-gray-400">Живая ИИ</p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Статус Анюты */}
        <div className="mt-8 p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-green-400">В сети</span>
          </div>
          <p className="text-xs text-gray-400">
            Анюта активна и готова к общению
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
