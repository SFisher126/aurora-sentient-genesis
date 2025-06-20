
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageRatingProps {
  messageId: string;
  onRating: (messageId: string, rating: 'positive' | 'negative', feedback?: string) => void;
  disabled?: boolean;
}

const MessageRating: React.FC<MessageRatingProps> = ({ messageId, onRating, disabled }) => {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleRating = (ratingType: 'positive' | 'negative') => {
    setRating(ratingType);
    setShowFeedback(true);
    
    if (ratingType === 'positive') {
      // Для положительных оценок отправляем сразу
      onRating(messageId, ratingType);
      toast({
        description: "Спасибо за положительную оценку! Анюта учится на ваших реакциях 💕",
      });
      setShowFeedback(false);
    }
  };

  const submitFeedback = () => {
    if (rating) {
      onRating(messageId, rating, feedback);
      toast({
        description: rating === 'positive' 
          ? "Спасибо! Анюта запомнит что вам понравилось 😊" 
          : "Спасибо за обратную связь. Анюта учится на ошибках и станет лучше 🤗",
      });
      setShowFeedback(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRating('positive')}
        disabled={disabled || rating !== null}
        className={`h-8 w-8 p-0 ${rating === 'positive' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-green-400'}`}
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRating('negative')}
        disabled={disabled || rating !== null}
        className={`h-8 w-8 p-0 ${rating === 'negative' ? 'text-red-400 bg-red-400/10' : 'text-gray-400 hover:text-red-400'}`}
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>

      {showFeedback && rating === 'negative' && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="text"
            placeholder="Что можно улучшить?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            maxLength={200}
          />
          <Button
            size="sm"
            onClick={submitFeedback}
            className="h-6 px-2 text-xs bg-purple-600 hover:bg-purple-700"
          >
            Отправить
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageRating;
