
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FullscreenCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  mode: 'photo' | 'video';
}

const FullscreenCamera: React.FC<FullscreenCameraProps> = ({
  isOpen,
  onClose,
  onCapture,
  mode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: mode === 'video'
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
        onClose();
      }
    }
  };

  const toggleVideoRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Здесь будет логика записи видео
    } else {
      setIsRecording(false);
      // Остановка записи и отправка
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Заголовок */}
      <div className="flex justify-between items-center p-4 text-white">
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-white hover:bg-gray-800"
        >
          <X className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-semibold">
          {mode === 'photo' ? 'Фото' : 'Видео'}
        </h2>
        <div className="w-10"></div>
      </div>

      {/* Камера */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={mode === 'photo'}
          className="w-full h-full object-cover"
        />
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Управление */}
      <div className="p-6 flex justify-center">
        <Button
          onClick={mode === 'photo' ? capturePhoto : toggleVideoRecording}
          className={`w-20 h-20 rounded-full ${
            mode === 'photo' 
              ? 'bg-white hover:bg-gray-200 text-black' 
              : isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-white hover:bg-gray-200 text-black'
          }`}
        >
          {mode === 'photo' ? (
            <div className="w-16 h-16 rounded-full border-2 border-current"></div>
          ) : (
            <div className={`w-6 h-6 ${isRecording ? 'bg-white rounded-sm' : 'bg-red-600 rounded-full'}`}></div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FullscreenCamera;
