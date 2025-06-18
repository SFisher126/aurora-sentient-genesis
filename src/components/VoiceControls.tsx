
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Camera, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlsProps {
  onSpeechResult: (text: string) => void;
  onImageCapture: (imageData: string) => void;
  onVideoToggle: (isRecording: boolean) => void;
  isListening: boolean;
  isSpeaking: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onSpeechResult,
  onImageCapture,
  onVideoToggle,
  isListening,
  isSpeaking
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Инициализация распознавания речи
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ru-RU';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          onSpeechResult(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          description: "Ошибка распознавания речи. Проверьте микрофон.",
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onSpeechResult, toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        description: "Распознавание речи не поддерживается в этом браузере",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Здесь будет логика отключения/включения звука для TTS
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast({
        description: "Анюта теперь может вас видеть! 👁️",
      });
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        description: "Не удалось получить доступ к камере",
        variant: "destructive",
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onImageCapture(imageData);
        
        toast({
          description: "Анюта сохранила изображение в память! 📸",
        });
      }
    }
  };

  const toggleVideoRecording = () => {
    setIsRecording(!isRecording);
    onVideoToggle(!isRecording);
    
    if (!isRecording) {
      toast({
        description: "Анюта начала видеозапись 🎥",
      });
    } else {
      toast({
        description: "Видеозапись остановлена ⏹️",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Видео поток */}
      {mediaStream && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-sm rounded-lg bg-gray-800"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
            <Button
              size="sm"
              onClick={captureImage}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={toggleVideoRecording}
              className={`${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Голосовые элементы управления */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={toggleListening}
          disabled={isSpeaking}
          className={`${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isListening ? 'Слушаю...' : 'Говорить'}
        </Button>

        <Button
          onClick={toggleMute}
          variant="outline"
          className="border-gray-600"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>

        {!mediaStream && (
          <Button
            onClick={startCamera}
            variant="outline"
            className="border-gray-600"
          >
            <Camera className="w-4 h-4 mr-2" />
            Камера
          </Button>
        )}

        {/* Индикаторы состояния */}
        <div className="flex gap-2">
          {isListening && (
            <Badge variant="outline" className="text-red-400 border-red-400 animate-pulse">
              Слушаю
            </Badge>
          )}
          {isSpeaking && (
            <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
              Говорю
            </Badge>
          )}
          {isRecording && (
            <Badge variant="outline" className="text-blue-400 border-blue-400 animate-pulse">
              Записываю
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceControls;
