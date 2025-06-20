
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const APISettings = () => {
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [webScrapingEnabled, setWebScrapingEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Загружаем сохраненные настройки
    setElevenLabsKey(localStorage.getItem('elevenlabs_key') || '');
    setOpenAIKey(localStorage.getItem('openai_key') || '');
    setSmsApiKey(localStorage.getItem('sms_api_key') || '');
    setWebScrapingEnabled(localStorage.getItem('web_scraping') === 'true');
  }, []);

  const saveElevenLabsKey = () => {
    localStorage.setItem('elevenlabs_key', elevenLabsKey);
    toast({ description: '🎤 ElevenLabs API ключ сохранен' });
  };

  const saveOpenAIKey = () => {
    localStorage.setItem('openai_key', openAIKey);
    toast({ description: '🧠 OpenAI API ключ сохранен' });
  };

  const saveSmsKey = () => {
    localStorage.setItem('sms_api_key', smsApiKey);
    toast({ description: '📱 SMS API ключ сохранен' });
  };

  const toggleWebScraping = () => {
    const newState = !webScrapingEnabled;
    setWebScrapingEnabled(newState);
    localStorage.setItem('web_scraping', newState.toString());
    toast({ description: newState ? '🌐 Веб-скрапинг включен' : '🌐 Веб-скрапинг отключен' });
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 p-6 bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">⚙️ API Настройки</h1>
            <p className="text-gray-400">Настройка подключений к внешним сервисам</p>
          </div>

          <div className="space-y-6">
            {/* ElevenLabs API */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">🎤 ElevenLabs API</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Настройка реалистичного голосового синтеза
                </Badge>
              </div>
              <div className="space-y-4">
                <Input
                  type="password"
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  placeholder="sk_..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={saveElevenLabsKey} className="bg-purple-600 hover:bg-purple-700">
                  Сохранить ElevenLabs ключ
                </Button>
                <p className="text-sm text-gray-400">
                  Получите API ключ на <a href="https://elevenlabs.io" target="_blank" className="text-purple-400 hover:underline">elevenlabs.io</a>
                </p>
              </div>
            </Card>

            {/* OpenAI API */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">🧠 OpenAI API</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Подключение к GPT для улучшенного мышления
                </Badge>
              </div>
              <div className="space-y-4">
                <Input
                  type="password"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={saveOpenAIKey} className="bg-blue-600 hover:bg-blue-700">
                  Сохранить OpenAI ключ
                </Button>
                <p className="text-sm text-gray-400">
                  Получите API ключ на <a href="https://platform.openai.com" target="_blank" className="text-blue-400 hover:underline">platform.openai.com</a>
                </p>
              </div>
            </Card>

            {/* SMS API */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">📱 SMS API</h3>
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  Настройка отправки SMS для авторизации
                </Badge>
              </div>
              <div className="space-y-4">
                <Input
                  type="password"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  placeholder="API ключ SMS сервиса"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={saveSmsKey} className="bg-orange-600 hover:bg-orange-700">
                  Сохранить SMS ключ
                </Button>
              </div>
            </Card>

            {/* Веб-скрапинг */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">🌐 Веб-скрапинг</h3>
                <Badge variant="outline" className={webScrapingEnabled ? "text-green-400 border-green-400" : "text-gray-400 border-gray-400"}>
                  {webScrapingEnabled ? 'Включен' : 'Отключен'}
                </Badge>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Настройка автоматического изучения информации
                </p>
                <Button 
                  onClick={toggleWebScraping}
                  className={webScrapingEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {webScrapingEnabled ? 'Отключить' : 'Включить'} веб-скрапинг
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default APISettings;
