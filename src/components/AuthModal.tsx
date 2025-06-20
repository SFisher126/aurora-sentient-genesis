
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('google');
      await authService.loginWithGoogle();
      toast({ 
        description: '✅ Успешный вход через Google!',
        className: 'bg-green-800 text-white border-green-600'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ 
        description: error.message || 'Ошибка входа через Google', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleYandexLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('yandex');
      await authService.loginWithYandex();
      toast({ 
        description: '✅ Успешный вход через Яндекс!',
        className: 'bg-green-800 text-white border-green-600'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ 
        description: error.message || 'Ошибка входа через Яндекс', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleSendSms = async () => {
    if (!phone.trim()) {
      toast({ description: 'Введите номер телефона', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProvider('sms');
      await authService.sendSmsCode(phone);
      toast({ 
        description: '📱 Код отправлен на ваш телефон!',
        className: 'bg-blue-800 text-white border-blue-600'
      });
      setIsCodeSent(true);
    } catch (error: any) {
      toast({ description: error.message || 'Ошибка отправки кода', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handlePhoneLogin = async () => {
    if (!smsCode.trim()) {
      toast({ description: 'Введите код из SMS', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProvider('phone');
      await authService.loginWithPhone(phone, smsCode);
      toast({ 
        description: '✅ Успешный вход по номеру телефона!',
        className: 'bg-green-800 text-white border-green-600'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ description: error.message || 'Ошибка входа', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onClose()}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-2">
            💖 Войти к Анюте
          </DialogTitle>
          <p className="text-gray-400 text-sm text-center">
            Авторизуйтесь для персонального общения
          </p>
        </DialogHeader>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="social" className="text-white">Соц. сети</TabsTrigger>
            <TabsTrigger value="phone" className="text-white">Телефон</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4 mt-6">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 transition-all duration-200 relative"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <span className="mr-2">🔴</span>
              )}
              Войти через Google
            </Button>

            <Button
              onClick={handleYandexLogin}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 transition-all duration-200 relative"
            >
              {loadingProvider === 'yandex' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <span className="mr-2">🟡</span>
              )}
              Войти через Яндекс
            </Button>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-6">
            {!isCodeSent ? (
              <>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendSms}
                  disabled={isLoading || !phone.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200"
                >
                  {loadingProvider === 'sms' ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <span className="mr-2">📱</span>
                  )}
                  Отправить код
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-400 text-center">
                  Код отправлен на {phone}
                </div>
                <Input
                  type="text"
                  placeholder="Введите код из SMS"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isLoading}
                  maxLength={4}
                />
                <Button
                  onClick={handlePhoneLogin}
                  disabled={isLoading || !smsCode.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200"
                >
                  {loadingProvider === 'phone' ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <span className="mr-2">✅</span>
                  )}
                  Подтвердить
                </Button>
                <Button
                  onClick={() => {
                    setIsCodeSent(false);
                    setSmsCode('');
                  }}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  ← Изменить номер
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Анюта сохранит ваши разговоры и будет помнить о вас ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
