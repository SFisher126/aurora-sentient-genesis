
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, ArrowUp } from 'lucide-react';
import { enhancedSpeechService } from '../services/enhancedSpeechService';
import { useToast } from '@/hooks/use-toast';

interface VoiceButtonProps {
  onVoiceMessage: (message: string) => void;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ onVoiceMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [dragY, setDragY] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    setRecordedText('');
    
    enhancedSpeechService.startListening(
      (text) => {
        setRecordedText(text);
      },
      (error) => {
        console.error('Voice error:', error);
        setIsRecording(false);
        setIsLocked(false);
        toast({ description: 'Ошибка записи голоса', variant: 'destructive' });
      }
    );
  };

  const stopRecording = () => {
    enhancedSpeechService.stopListening();
    setIsRecording(false);
    
    if (recordedText.trim()) {
      onVoiceMessage(recordedText);
      toast({ description: `Отправлено: "${recordedText}"` });
    }
    
    setRecordedText('');
    setIsLocked(false);
    setDragY(0);
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    if (!isLocked) {
      stopRecording();
    }
  };

  const handleTouchStart = () => {
    startRecording();
  };

  const handleTouchEnd = () => {
    if (!isLocked) {
      stopRecording();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return;
    
    const touch = e.touches[0];
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    
    if (buttonRect) {
      const deltaY = buttonRect.bottom - touch.clientY;
      setDragY(deltaY);
      
      // Блокируем запись при движении вверх на 50px
      if (deltaY > 50) {
        setIsLocked(true);
        toast({ description: 'Запись заблокирована. Нажмите "Отправить" чтобы завершить.' });
      }
    }
  };

  const sendLockedMessage = () => {
    stopRecording();
  };

  if (isLocked) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-700 rounded-full px-3 py-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-gray-300">
            {recordedText || 'Говорите...'}
          </span>
        </div>
        <Button
          onClick={sendLockedMessage}
          className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 p-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className={`rounded-full w-10 h-10 p-0 transition-all duration-200 ${
        isRecording 
          ? 'bg-red-600 hover:bg-red-700 scale-110' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
      style={{ transform: `translateY(-${Math.min(dragY, 50)}px)` }}
    >
      {isRecording ? (
        <div className="flex flex-col items-center">
          <ArrowUp className="w-3 h-3 mb-1" />
          <Mic className="w-4 h-4" />
        </div>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};

export default VoiceButton;
