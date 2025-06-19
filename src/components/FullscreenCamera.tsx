
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';

interface FullscreenCameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: string) => void;
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
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
    if (isRecording) {
      stopVideoRecording();
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

  const startVideoRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });

    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      onCapture(videoUrl);
      onClose();
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Заголовок */}
      <div className="flex justify-between items-center p-4 text-white bg-black/50">
        <Button
          onClick={onClose}
          variant="ghost"
          className="text-white hover:bg-gray-800 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-semibold">
          {mode === 'photo' ? 'Фото' : 'Видео'}
        </h2>
        <Button
          onClick={toggleCamera}
          variant="ghost"
          className="text-white hover:bg-gray-800 rounded-full"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
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
        
        {/* Индикатор записи */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">REC</span>
          </div>
        )}
      </div>

      {/* Управление */}
      <div className="p-6 flex justify-center bg-black/50">
        <Button
          onClick={mode === 'photo' ? capturePhoto : isRecording ? stopVideoRecording : startVideoRecording}
          className={`w-20 h-20 rounded-full border-4 ${
            mode === 'photo' 
              ? 'bg-white hover:bg-gray-200 text-black border-white' 
              : isRecording 
                ? 'bg-red-600 hover:bg-red-700 border-red-400' 
                : 'bg-white hover:bg-gray-200 text-black border-white'
          }`}
        >
          {mode === 'photo' ? (
            <div className="w-16 h-16 rounded-full border-2 border-current"></div>
          ) : (
            <div className={`${isRecording ? 'w-6 h-6 bg-white rounded-sm' : 'w-6 h-6 bg-red-600 rounded-full'}`}></div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FullscreenCamera;
