
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { authService } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();

  const handleSimpleLogin = async () => {
    try {
      await authService.simpleLogin();
      toast({ 
        description: '✅ Добро пожаловать к Анюте!',
        className: 'bg-green-800 text-white border-green-600'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ 
        description: error.message || 'Ошибка входа', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-2">
            💖 Войти к Анюте
          </DialogTitle>
          <p className="text-gray-400 text-sm text-center">
            Добро пожаловать в мир искусственного интеллекта
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Button
            onClick={handleSimpleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 text-lg py-3"
          >
            <span className="mr-2">🌟</span>
            Войти
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Анюта будет помнить о вас и учиться вместе с вами ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
