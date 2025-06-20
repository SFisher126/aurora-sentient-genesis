
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageRatingProps {
  messageId: string;
  onRating: (messageId: string, rating: 'positive' | 'negative') => void;
  disabled?: boolean;
}

const MessageRating: React.FC<MessageRatingProps> = ({ messageId, onRating, disabled }) => {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRating(messageId, 'positive')}
        disabled={disabled}
        className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
      >
        <ThumbsUp className="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRating(messageId, 'negative')}
        disabled={disabled}
        className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
      >
        <ThumbsDown className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default MessageRating;
