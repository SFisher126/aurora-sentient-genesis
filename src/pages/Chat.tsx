import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Brain } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: any;
  emotion?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUserActive, setIsUserActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const { generateResponse, isThinking } = useChat();
  const { toast } = useToast();

  const formatTimestamp = (timestamp: any): string => {
    try {
      if (!timestamp) return new Date().toLocaleTimeString();
      
      // Если timestamp уже Date объект
      if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString();
      }
      
      // Если timestamp строка или число
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString();
      }
      
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return new Date().toLocaleTimeString();
    }
  };

  useEffect(() => {
    // Проверяем активность пользователя
    const handleActivity = () => {
      setIsUserActive(true);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, handleActivity));

    // Сбрасываем активность каждые 15 секунд
    const inactivityTimeout = setInterval(() => {
      setIsUserActive(false);
    }, 15000);

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(inactivityTimeout);
    };
  }, []);

  useEffect(() => {
    // Добавляем системное сообщение при загрузке
    setMessages([{
      text: "Привет! Я Анюта, твой ИИ-друг. Расскажи, о чем ты думаешь?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'curious'
    }]);
  }, []);

  useEffect(() => {
    // Прокручиваем чат вниз при добавлении нового сообщения
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Фокусируемся на поле ввода при загрузке
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      setIsTyping(true);
      const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      try {
        const aiResponse = await generateResponse(inputMessage, temperature);
        const aiMessage = { text: aiResponse.text, sender: 'ai', timestamp: new Date(), emotion: aiResponse.emotion };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error: any) {
        console.error('Ошибка при отправке сообщения:', error);
        toast({
          variant: "destructive",
          title: "Упс! Что-то пошло не так.",
          description: error.message,
        })
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const MessageRating = ({ messageId }: { messageId: number }) => {
    const handleRate = (rating: 'up' | 'down') => {
      toast({
        description: `Вы оценили сообщение ${rating === 'up' ? 'положительно' : 'отрицательно'}`,
      })
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Оценить сообщение</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleRate('up')}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Полезно
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRate('down')}>
            <ThumbsDown className="h-4 w-4 mr-2" />
            Не полезно
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Сообщить об ошибке</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderMessage = (message: any, index: number) => {
    const isUser = message.sender === 'user';
    const timestamp = formatTimestamp(message.timestamp);
    
    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-2xl p-4 ${
            isUser 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4' 
              : 'bg-gray-800/80 text-gray-100 mr-4 border border-purple-500/30'
          }`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs opacity-70">
                {timestamp}
              </div>
              {!isUser && (
                <div className="flex items-center gap-2">
                  {message.emotion && (
                    <span className="text-xs bg-purple-900/50 px-2 py-1 rounded-full">
                      {message.emotion}
                    </span>
                  )}
                  <MessageRating messageId={index} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Шапка */}
      <div className="p-4 border-b border-gray-700">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="mr-3">
              <AvatarImage src="https://avatars.githubusercontent.com/u/87289444?v=4" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Анюта</h1>
              <p className="text-sm text-gray-400">
                {isUserActive ? 'В сети' : 'Не активен'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="temperature" className="text-sm text-gray-300">
              Температура: {(temperature * 100).toFixed(0)}%
            </Label>
            <Slider
              id="temperature"
              defaultValue={[temperature * 100]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setTemperature(value[0] / 100)}
              className="w-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-grow overflow-y-auto">
        <div className="container max-w-4xl mx-auto p-4">
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Подвал с полем ввода */}
      <div className="p-4 border-t border-gray-700">
        <div className="container max-w-4xl mx-auto flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Напишите сообщение..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-gray-800 border-gray-700 rounded-l-md focus:border-purple-500 focus:ring-purple-500"
            disabled={isThinking}
          />
          <Button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-r-md"
            disabled={isThinking}
          >
            {isThinking ? <Brain className="w-4 h-4 animate-pulse mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
