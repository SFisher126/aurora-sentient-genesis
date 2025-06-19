
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, File } from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onOpenCamera: (mode: 'photo' | 'video') => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  isOpen,
  onOpenCamera,
  onFileUpload
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-0 bg-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex gap-4">
        <Button
          onClick={() => onOpenCamera('photo')}
          className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 p-0"
          title="Камера"
        >
          <Camera className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => onOpenCamera('video')}
          className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 p-0"
          title="Видео"
        >
          <Video className="w-5 h-5" />
        </Button>
        
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 rounded-full w-12 h-12 p-0"
          title="Файл"
        >
          <label className="cursor-pointer flex items-center justify-center">
            <input
              type="file"
              onChange={onFileUpload}
              className="hidden"
              accept="*/*"
            />
            <File className="w-5 h-5" />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default AttachmentMenu;
