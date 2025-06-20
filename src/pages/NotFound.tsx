
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold mb-4 text-purple-400">404</h1>
        <p className="text-gray-400 mb-8">Анюта не может найти эту страницу</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Вернуться к чату
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
