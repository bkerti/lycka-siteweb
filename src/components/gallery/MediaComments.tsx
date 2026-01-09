
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaComment } from "@/hooks/useMediaInteractions";
import { Send, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface MediaCommentsProps {
  mediaId: string;
  comments: MediaComment[];
  onAddComment: (text: string, author: string) => void;
  onRemoveComment: (commentId: string) => void;
}

const MediaComments = ({
  mediaId,
  comments,
  onAddComment,
  onRemoveComment
}: MediaCommentsProps) => {
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comment.trim()) {
      onAddComment(comment, authorName || "Anonyme");
      setComment("");
      setAuthorName("");
    }
  };

  const handleRemoveComment = (e: React.MouseEvent, commentId: string) => {
    e.stopPropagation();
    onRemoveComment(commentId);
  };

  return (
    <div className="pt-2 border-t mt-2" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 mb-3">
        <Input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="text-sm"
        />
        <div className="flex items-end">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Écrivez un commentaire..."
            className="min-h-[40px] resize-none text-sm"
          />
          <Button type="submit" size="sm" className="ml-2 h-9" disabled={!comment.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </form>

      <div className="space-y-3 max-h-[300px] overflow-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{comment.author_name}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => handleRemoveComment(e, comment.id)}
              >
                <X size={14} />
              </Button>
            </div>
            <p className="text-sm mt-1">{comment.comment_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaComments;
