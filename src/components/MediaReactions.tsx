
import { Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaReaction } from '@/hooks/useMediaInteractions';

interface MediaReactionsProps {
  reactions: Record<string, MediaReaction>;
  onToggleReaction: (reactionType: string) => void;
}

const reactionIcons: Record<string, React.ReactNode> = {
  like: <ThumbsUp size={20} />,
  love: <Heart size={20} />,
  dislike: <ThumbsDown size={20} />,
};

const MediaReactions = ({ reactions, onToggleReaction }: MediaReactionsProps) => {
  return (
    <div className="flex items-center space-x-4">
      {Object.entries(reactionIcons).map(([type, icon]) => {
        const reaction = reactions[type];
        const count = reaction ? reaction.count : 0;
        const userHasReacted = reaction ? reaction.userHasReacted : false;

        return (
          <Button
            key={type}
            variant={userHasReacted ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onToggleReaction(type)}
            className="flex items-center space-x-2"
          >
            {icon}
            <span>{count}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MediaReactions;
