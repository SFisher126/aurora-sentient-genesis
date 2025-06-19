
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Camera, Paperclip, ArrowUp, Reply } from 'lucide-react';
import { useRealAI } from '../hooks/useRealAI';
import { enhancedSpeechService } from '../services/enhancedSpeechService';
import { memoryService } from '../services/memoryService';
import { useToast } from '@/hooks/use-toast';
import FullscreenCamera from '../components/FullscreenCamera';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  autonomousMessage?: boolean;
  thoughts?: string[];
  imageData?: string;
  videoData?: string;
  rating?: 'positive' | 'negative';
  feedback?: string;
  connections?: any[];
  replyTo?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentMood, setCurrentMood] = useState('curious');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const voiceButtonRef = useRef<HTMLButtonElement>(null);

  const { 
    generateResponse, 
    isThinking, 
    setApiKey,
    setHuggingFaceKey,
    hasApiKey 
  } = useRealAI();

  const { toast } = useToast();

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Инициализация при загрузке
  useEffect(() => {
    console.log('🚀 Initializing Anuta...');
    
    setHuggingFaceKey('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');
    
    const savedMemory = memoryService.loadConversation();
    if (savedMemory && savedMemory.messages && savedMemory.messages.length > 0) {
      setMessages(savedMemory.messages);
      console.log('💾 Loaded conversation from memory:', savedMemory.messages.length, 'messages');
    }
    
    setIsInitialized(true);
  }, [setHuggingFaceKey]);

  // Автосохранение памяти
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      memoryService.saveConversation(messages, {
        currentMood,
        lastActivity: new Date()
      });
    }
  }, [messages, currentMood, isInitialized]);

  const sendMessage = async (messageText?: string, imageData?: string, videoData?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() && !imageData && !videoData) return;
    
    setInputMessage('');
    setReplyToMessage(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      imageData,
      videoData,
      replyTo: replyToMessage?.id
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await generateResponse(textToSend);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        emotion: response.emotion,
        thoughts: response.thoughts
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setCurrentMood(response.emotion);
      
      if (response.text) {
        try {
          await enhancedSpeechService.speak(response.text);
        } catch (error) {
          console.error('Speech error:', error);
        }
      }
      
    } catch (error) {
      console.error('Ошибка генерации ответа:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Прости, у меня проблемы с подключением... Но я все равно учусь! 💭",
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'confused'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleVoiceStart = () => {
    setIsListening(true);
    setIsRecording(true);
    
    enhancedSpeechService.startListening(
      (text) => {
        if (text.trim()) {
          sendMessage(text);
          toast({ description: `Анюта услышала: "${text}"` });
        }
        setIsListening(false);
        setIsRecording(false);
      },
      (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
        setIsRecording(false);
      }
    );
  };

  const handleVoiceEnd = () => {
    enhancedSpeechService.stopListening();
    setIsListening(false);
    setIsRecording(false);
  };

  const handleCameraCapture = (imageData: string) => {
    sendMessage('Анюта, посмотри на это фото', imageData);
  };

  const handleVideoCapture = (videoData: string) => {
    sendMessage('Анюта, посмотри на это видео', undefined, videoData);
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyToMessage(message);
  };

  // Обработка свайпа
  const handleTouchStart = (e: React.TouchEvent, message: Message) => {
    if (message.sender === 'ai') {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, message: Message) => {
    if (!touchStart || message.sender !== 'ai') return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = Math.abs(touchEnd.y - touchStart.y);

    // Свайп вправо для ответа (минимум 50px горизонтально, максимум 30px вертикально)
    if (deltaX > 50 && deltaY < 30) {
      handleReplyToMessage(message);
    }

    setTouchStart(null);
  };

  const renderMessage = (message: Message) => (
    <div 
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      onTouchStart={(e) => handleTouchStart(e, message)}
      onTouchEnd={(e) => handleTouchEnd(e, message)}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
        message.sender === 'user' 
          ? 'bg-blue-600 text-white rounded-br-md' 
          : 'bg-gray-700 text-gray-100 rounded-bl-md'
      }`}>
        {message.replyTo && (
          <div className="text-xs opacity-70 mb-2 p-2 bg-black/20 rounded">
            <Reply className="w-3 h-3 inline mr-1" />
            Ответ на: {messages.find(m => m.id === message.replyTo)?.text?.slice(0, 50)}...
          </div>
        )}
        
        {message.imageData && (
          <img 
            src={message.imageData} 
            alt="Photo" 
            className="w-full rounded-lg mb-2 cursor-pointer"
            onClick={() => {/* Открыть в полном размере */}}
          />
        )}
        
        {message.videoData && (
          <video 
            src={message.videoData} 
            className="w-full rounded-lg mb-2"
            controls
          />
        )}
        
        <p className="text-sm whitespace-pre-line">{message.text}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Анимированное приветствие на разных языках
  const greetings = ['Привет', 'Hello', 'Hola', '你好', 'Bonjour', 'Guten Tag', 'Ciao', 'こんにちは'];
  const [currentGreeting, setCurrentGreeting] = useState(0);

  useEffect(() => {
    if (messages.length === 0) {
      const interval = setInterval(() => {
        setCurrentGreeting(prev => (prev + 1) % greetings.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        
        <div className="flex-1 flex flex-col bg-gray-800 rounded-lg m-4">
          <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-4xl font-light text-gray-400 animate-pulse">
                  {greetings[currentGreeting]}
                </div>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            
            {isThinking && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm">думаю...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {replyToMessage && (
            <div className="px-4 py-2 bg-gray-700 border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  <Reply className="w-3 h-3 inline mr-1" />
                  Ответ на: {replyToMessage.text.slice(0, 50)}...
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyToMessage(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </div>
          )}

          {showAttachments && (
            <div className="px-4 py-2 bg-gray-700 flex gap-4">
              <Button
                onClick={() => {
                  setCameraMode('photo');
                  setIsCameraOpen(true);
                  setShowAttachments(false);
                }}
                className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12"
              >
                <Camera className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {
                  setCameraMode('video');
                  setIsCameraOpen(true);
                  setShowAttachments(false);
                }}
                className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12"
              >
                📹
              </Button>
            </div>
          )}

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-end gap-2">
              <Button
                onClick={() => setShowAttachments(!showAttachments)}
                variant="ghost"
                className="text-gray-400 hover:text-white p-2"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Сообщение..."
                  disabled={isThinking}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-3xl pr-12"
                />
              </div>
              
              {inputMessage.trim() ? (
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={isThinking}
                  className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  ref={voiceButtonRef}
                  onMouseDown={handleVoiceStart}
                  onMouseUp={handleVoiceEnd}
                  onTouchStart={handleVoiceStart}
                  onTouchEnd={handleVoiceEnd}
                  className={`rounded-full w-10 h-10 p-0 ${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <FullscreenCamera
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={cameraMode === 'photo' ? handleCameraCapture : handleVideoCapture}
        mode={cameraMode}
      />
    </div>
  );
};

export default Chat;
