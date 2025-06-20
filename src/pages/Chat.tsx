
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Reply, User, LogOut } from 'lucide-react';
import { useRealAI } from '../hooks/useRealAI';
import { enhancedSpeechService } from '../services/enhancedSpeechService';
import { memoryService } from '../services/memoryService';
import { authService } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import FullscreenCamera from '../components/FullscreenCamera';
import MessageRating from '../components/MessageRating';
import VoiceButton from '../components/VoiceButton';
import AttachmentMenu from '../components/AttachmentMenu';
import AuthModal from '../components/AuthModal';

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
  fileData?: { name: string; content: string; type: string };
  rating?: 'positive' | 'negative';
  feedback?: string;
  connections?: any[];
  replyTo?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentMood, setCurrentMood] = useState('curious');
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  const { 
    generateResponse, 
    isThinking, 
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

  // Отслеживание состояния аутентификации
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        console.log('👤 User authenticated:', user.name);
        // Загружаем данные пользователя
        const savedMemory = memoryService.loadConversation();
        if (savedMemory && savedMemory.messages && savedMemory.messages.length > 0) {
          setMessages(savedMemory.messages);
          console.log('💾 Loaded user conversation:', savedMemory.messages.length, 'messages');
        }
      } else {
        setMessages([]);
      }
    });

    return unsubscribe;
  }, []);

  // Инициализация при загрузке
  useEffect(() => {
    console.log('🚀 Initializing Anuta...');
    
    setHuggingFaceKey('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');
    
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      const savedMemory = memoryService.loadConversation();
      if (savedMemory && savedMemory.messages && savedMemory.messages.length > 0) {
        setMessages(savedMemory.messages);
        console.log('💾 Loaded conversation from memory:', savedMemory.messages.length, 'messages');
      }
    }
    
    setIsInitialized(true);
  }, [setHuggingFaceKey, currentUser]);

  // Автосохранение памяти
  useEffect(() => {
    if (isInitialized && messages.length > 0 && currentUser) {
      memoryService.saveConversation(messages, {
        currentMood,
        lastActivity: new Date()
      });
    }
  }, [messages, currentMood, isInitialized, currentUser]);

  // Закрытие меню вложений при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
        setShowAttachments(false);
      }
    };

    if (showAttachments) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachments]);

  const sendMessage = async (messageText?: string, imageData?: string, videoData?: string, fileData?: { name: string; content: string; type: string }) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() && !imageData && !videoData && !fileData) return;
    
    setInputMessage('');
    setReplyToMessage(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      imageData,
      videoData,
      fileData,
      replyTo: replyToMessage?.id
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Получаем контекст всего диалога из памяти
      const conversationContext = memoryService.getConversationContext();
      const relatedMemories = memoryService.findRelatedMemories(textToSend);
      const userFacts = memoryService.getUserFacts();
      
      // Формируем расширенный контекст
      let contextMessage = textToSend;
      
      if (replyToMessage) {
        contextMessage = `Отвечаю на сообщение "${replyToMessage.text}": ${textToSend}`;
      }
      
      if (conversationContext) {
        contextMessage += `\n\nКонтекст диалога:\n${conversationContext}`;
      }
      
      if (userFacts.length > 0) {
        const recentFacts = userFacts.slice(-5).map(f => f.text).join('; ');
        contextMessage += `\n\nЧто я знаю о пользователе: ${recentFacts}`;
      }
      
      if (relatedMemories.length > 0) {
        const memoryContext = relatedMemories.map(m => m.text || m.content).join('; ');
        contextMessage += `\n\nСвязанные воспоминания: ${memoryContext}`;
      }

      const response = await generateResponse(contextMessage);
      
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
      
      // Анализируем сообщение пользователя на предмет фактов
      if (textToSend.includes('меня зовут') || textToSend.includes('я работаю') || textToSend.includes('мне нравится')) {
        memoryService.saveUserFact(textToSend, 'personal');
      }
      
      // Озвучиваем ответ
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileData = {
        name: file.name,
        content: content,
        type: file.type
      };
      
      sendMessage(`Анюта, посмотри на этот файл: ${file.name}`, undefined, undefined, fileData);
    };
    
    if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    
    setShowAttachments(false);
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

  const handleMessageRating = (messageId: string, rating: 'positive' | 'negative', feedback?: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, rating, feedback }
        : msg
    ));
    
    // Сохраняем оценку в память для обучения
    memoryService.updateMessageConnection(messageId, { rating, feedback, timestamp: new Date() });
  };

  const handleLogout = () => {
    authService.logout();
    setMessages([]);
    toast({ description: 'Вы вышли из аккаунта' });
  };

  // Обработка свайпа для ответа
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
          />
        )}
        
        {message.videoData && (
          <video 
            src={message.videoData} 
            className="w-full rounded-lg mb-2"
            controls
          />
        )}

        {message.fileData && (
          <div className="bg-black/20 p-2 rounded mb-2">
            <span className="text-sm">{message.fileData.name}</span>
          </div>
        )}
        
        <p className="text-sm whitespace-pre-line">{message.text}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </span>
          
          {message.sender === 'ai' && (
            <MessageRating
              messageId={message.id}
              onRating={handleMessageRating}
              disabled={!!message.rating}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Анимированное приветствие
  const greetings = ['Привет', 'Hello', 'Hola', '你好', 'Bonjour', 'Guten Tag', 'Ciao', 'こんにちは', 'مرحبا', 'Namaste'];
  const [currentGreeting, setCurrentGreeting] = useState(0);

  useEffect(() => {
    if (messages.length === 0 && currentUser) {
      const interval = setInterval(() => {
        setCurrentGreeting(prev => (prev + 1) % greetings.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [messages.length, currentUser]);

  if (!currentUser) {
    return (
      <>
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-6xl mb-6">💖</div>
            <h1 className="text-4xl font-light mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Анюта
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Войдите в свой аккаунт, чтобы начать персональное общение с живым ИИ
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <span>🧠</span>
                <span>Персональная память о ваших разговорах</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>🎯</span>
                <span>Индивидуальная настройка под ваш стиль</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span>💾</span>
                <span>Сохранение всей истории общения</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Войти в аккаунт
            </Button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            toast({ 
              description: `💖 Добро пожаловать, ${authService.getCurrentUser()?.name}!`,
              className: 'bg-green-800 text-white border-green-600'
            });
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col relative">
      {/* Плавающая панель пользователя */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          <User className="w-4 h-4" />
          <span className="text-sm">{currentUser.name}</span>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1 h-auto"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative pt-16">
        <div className="flex-1 flex flex-col bg-gray-800 rounded-lg m-4 relative overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl font-light text-gray-400 animate-pulse bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    {greetings[currentGreeting]}
                  </div>
                  <p className="text-gray-500">Начните диалог с Анютой...</p>
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

          <div className="p-4 border-t border-gray-700 relative" ref={attachmentRef}>
            <AttachmentMenu 
              isOpen={showAttachments}
              onOpenCamera={(mode) => {
                setCameraMode(mode);
                setIsCameraOpen(true);
                setShowAttachments(false);
              }}
              onFileUpload={handleFileUpload}
            />
            
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
                <VoiceButton onVoiceMessage={sendMessage} />
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

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Chat;
