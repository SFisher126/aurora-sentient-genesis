
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authService.loginWithGoogle();
      toast({ description: 'Успешный вход через Google!' });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ description: 'Ошибка входа через Google', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleYandexLogin = async () => {
    try {
      setIsLoading(true);
      await authService.loginWithYandex();
      toast({ description: 'Успешный вход через Яндекс!' });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ description: 'Ошибка входа через Яндекс', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSms = async () => {
    if (!phone.trim()) {
      toast({ description: 'Введите номер телефона', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      await authService.sendSmsCode(phone);
      setIsCodeSent(true);
      toast({ description: 'Код отправлен на ваш телефон!' });
    } catch (error) {
      toast({ description: 'Ошибка отправки кода', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!smsCode.trim()) {
      toast({ description: 'Введите код из SMS', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      await authService.loginWithPhone(phone, smsCode);
      toast({ description: 'Успешный вход по номеру телефона!' });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ description: error.message || 'Ошибка входа', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    authService.loginAsGuest();
    toast({ description: 'Вход как гость' });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Войти в аккаунт Анюты
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="social" className="text-white">Соц. сети</TabsTrigger>
            <TabsTrigger value="phone" className="text-white">Телефон</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              🔴 Войти через Google
            </Button>

            <Button
              onClick={handleYandexLogin}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              🟡 Войти через Яндекс
            </Button>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            {!isCodeSent ? (
              <>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  onClick={handleSendSms}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  📱 Отправить код
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Код из SMS (для демо: 1234)"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  onClick={handlePhoneLogin}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  ✅ Подтвердить код
                </Button>
                <Button
                  onClick={() => setIsCodeSent(false)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                >
                  ← Изменить номер
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={handleGuestLogin}
            variant="outline"
            className="w-full border-gray-600 text-gray-300"
          >
            👤 Продолжить как гость
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
