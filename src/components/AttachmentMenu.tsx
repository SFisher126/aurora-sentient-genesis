
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Upload } from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onOpenCamera: (mode: 'photo' | 'video') => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({ isOpen, onOpenCamera, onFileUpload }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-lg p-2 flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onOpenCamera('photo')}
        className="text-gray-300 hover:text-white"
      >
        <Camera className="w-4 h-4 mr-1" />
        Фото
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onOpenCamera('video')}
        className="text-gray-300 hover:text-white"
      >
        <Video className="w-4 h-4 mr-1" />
        Видео
      </Button>
      
      <label>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-1" />
          Файл
        </Button>
        <input
          type="file"
          onChange={onFileUpload}
          className="hidden"
          accept="*/*"
        />
      </label>
    </div>
  );
};

export default AttachmentMenu;
