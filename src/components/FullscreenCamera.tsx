
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Circle, Square } from 'lucide-react';

interface FullscreenCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: string) => void;
  mode: 'photo' | 'video';
}

const FullscreenCamera: React.FC<FullscreenCameraProps> = ({ isOpen, onClose, onCapture, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    onCapture(dataUrl);
    onClose();
  };

  const toggleVideoRecording = () => {
    if (isRecording) {
      // Остановка записи (упрощенная версия)
      setIsRecording(false);
      onCapture('video_data_placeholder');
      onClose();
    } else {
      setIsRecording(true);
      // Начало записи
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-4 right-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white bg-black/20 rounded-full w-10 h-10 p-0"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={mode === 'photo' ? capturePhoto : toggleVideoRecording}
            className={`rounded-full w-16 h-16 p-0 ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-white hover:bg-gray-200'
            }`}
          >
            {mode === 'photo' ? (
              <Circle className="w-8 h-8 text-black" />
            ) : isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Circle className="w-8 h-8 text-black" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FullscreenCamera;
