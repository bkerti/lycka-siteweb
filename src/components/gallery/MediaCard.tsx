import { useState } from "react";
import InViewAnimator from "../animators/InViewAnimator";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMediaInteractions } from "@/hooks/useMediaInteractions";
import MediaReactions from "./MediaReactions";
import MediaComments from "./MediaComments";
import { GalleryItem } from "@/hooks/useGalleryItems";

interface MediaCardProps {
  item: GalleryItem;
}

const MediaCard = ({ item }: MediaCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    comments, 
    reactions, 
    addComment, 
    toggleReaction, 
    removeComment 
  } = useMediaInteractions(item.id);

  const handleAddComment = (text: string, author: string) => {
    addComment({ mediaId: item.id, comment_text: text, author_name: author });
    setShowComments(true);
  };

  const handleRemoveComment = (commentId: string) => {
    removeComment({ mediaId: item.id, commentId });
  };

  const handleToggleReaction = (reactionType: string) => {
    toggleReaction({ mediaId: item.id, reaction_type: reactionType });
  };

  const firstMedia = item.media && item.media.length > 0 ? item.media[0] : null;

  return (
    <>
      <InViewAnimator>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative cursor-pointer" onClick={() => setIsDialogOpen(true)}>
              <img 
                  src={firstMedia?.url} 
                  alt={item.title} 
                  className="w-full h-64 object-cover"
                />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium bg-lycka-primary/90 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs capitalize bg-gray-800/80 px-2 py-1 rounded">
                    {item.section === "projects" ? "Projet" : "LYCKA HOME"}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm truncate">{item.description}</p>
              <MediaReactions 
                mediaId={item.id}
                reactions={reactions}
                onToggleReaction={handleToggleReaction}
                onShowComments={() => setShowComments(!showComments)}
                commentsCount={comments.length}
              />
              {showComments && (
                <MediaComments 
                  mediaId={item.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onRemoveComment={handleRemoveComment}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </InViewAnimator>

      {/* Modal pour afficher l'image ou la vidéo en grand */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>{item.description || "Vue détaillée de l'élément."}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-6">
            <Carousel className="w-full">
              <CarouselContent>
                {item.media?.map((media, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                           <img 
                              src={media.url} 
                              alt={`${item.title} - image ${index + 1}`}
                              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                            />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div>
              <p className="text-sm text-gray-700 mb-4">{item.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaCard;