import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Smile, Frown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaReaction } from "@/hooks/useMediaInteractions";

interface MediaReactionsProps {
  mediaId: string;
  reactions: Record<string, MediaReaction>;
  onToggleReaction: (reactionType: string) => void;
  onShowComments: () => void;
  commentsCount: number;
}

const ALL_REACTIONS: Record<string, JSX.Element> = {
  like: <ThumbsUp size={16} />,
  love: <Heart size={16} className="text-red-500" />,
  wow: <Smile size={16} className="text-yellow-500" />,
  haha: <Smile size={16} className="text-yellow-400" />,
  sad: <Frown size={16} className="text-blue-400" />,
  angry: <Frown size={16} className="text-red-500" />
};

const reactionColors: Record<string, string> = {
  like: "bg-blue-100 text-blue-600",
  love: "bg-red-100 text-red-600",
  wow: "bg-yellow-100 text-yellow-600",
  haha: "bg-yellow-100 text-yellow-500",
  sad: "bg-blue-100 text-blue-500",
  angry: "bg-red-100 text-red-600"
};

const MediaReactions = ({
  mediaId,
  reactions,
  onToggleReaction,
  onShowComments,
  commentsCount
}: MediaReactionsProps) => {
  const [showReactionOptions, setShowReactionOptions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  useEffect(() => {
    // Find if the current user has reacted
    const userReaction = Object.entries(reactions).find(([_, reaction]) => reaction.userHasReacted);
    if (userReaction) {
      setSelectedReaction(userReaction[0]);
    } else {
      setSelectedReaction(null);
    }
  }, [reactions]);

  const totalReactions = Object.values(reactions).reduce(
    (sum, reaction) => sum + (reaction.count || 0),
    0
  );

  const handleReactionClick = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (selectedReaction === type) {
      setSelectedReaction(null);
    } else {
      setSelectedReaction(type);
    }
    onToggleReaction(type);
    setShowReactionOptions(false);
  };

  const handleShowCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowComments();
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <div 
            className="relative"
            onMouseEnter={() => setShowReactionOptions(true)}
            onMouseLeave={() => setShowReactionOptions(false)}
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-2 py-1 h-8",
                selectedReaction && reactionColors[selectedReaction]
              )}
              onClick={(e) => handleReactionClick(e, selectedReaction || 'like')}
            >
              {selectedReaction ? (
                <>
                  {ALL_REACTIONS[selectedReaction]}
                  <span className="ml-1 text-xs">
                    {selectedReaction.charAt(0).toUpperCase() + selectedReaction.slice(1)}
                  </span>
                </>
              ) : (
                <>
                  <ThumbsUp size={16} />
                  <span className="ml-1 text-xs">J'aime</span>
                </>
              )}
            </Button>

            {showReactionOptions && (
              <div className="absolute bottom-full flex space-x-1 bg-white p-2 rounded-full shadow-lg">
                {Object.entries(ALL_REACTIONS).map(([type, icon]) => (
                  <button
                    key={type}
                    onClick={(e) => handleReactionClick(e, type)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title={type.charAt(0).toUpperCase() + type.slice(1)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-8"
            onClick={handleShowCommentsClick}
          >
            <MessageCircle size={16} />
            <span className="ml-1 text-xs">Commenter</span>
          </Button>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          {totalReactions > 0 && (
            <div className="flex items-center mr-3">
              <div className="flex -space-x-1 mr-1">
                {Object.entries(reactions)
                  .filter(([_, reaction]) => reaction.count > 0)
                  .slice(0, 3)
                  .map(([type]) => (
                    <div
                      key={type}
                      className={cn(
                        `w-4 h-4 rounded-full flex items-center justify-center`,
                        reactionColors[type as keyof typeof reactionColors]
                      )}
                    >
                      {ALL_REACTIONS[type as keyof typeof ALL_REACTIONS]}
                    </div>
                  ))}
              </div>
              <span>{totalReactions}</span>
            </div>
          )}
          {commentsCount > 0 && <span onClick={handleShowCommentsClick} className="cursor-pointer">{commentsCount} commentaires</span>}
        </div>
      </div>
    </div>
  );
};

export default MediaReactions;