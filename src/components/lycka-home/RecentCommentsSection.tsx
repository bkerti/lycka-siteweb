
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeModel } from "@/models/HomeModel";

// Card component to display a comment with the model name
const CommentWithModelCard = ({ comment }) => (
  <Card className="bg-card p-4 rounded-lg shadow-sm">
    <CardHeader className="p-0 mb-2">
      <CardTitle className="font-bold text-base">{comment.author_name}</CardTitle>
      <p className="text-sm text-muted-foreground">
        Avis sur le modèle : <span className="font-semibold text-foreground">{comment.modelName}</span>
      </p>
    </CardHeader>
    <CardContent className="p-0">
      <p className="text-muted-foreground italic">"{comment.comment_text}"</p>
      <p className="text-xs text-muted-foreground mt-2">{new Date(comment.created_at).toLocaleString()}</p>
    </CardContent>
  </Card>
);

// Main section component
const RecentCommentsSection = () => {
  const [aggregatedComments, setAggregatedComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // 1. Fetch all home models
  const { data: homeModels, isLoading: isLoadingModels } = useQuery<HomeModel[]>({
    queryKey: ["homeModels"],
    queryFn: async () => {
      const response = await fetch("/api/homemodels");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!homeModels || homeModels.length === 0) {
      return;
    }

    const fetchCommentsForModels = async () => {
      setIsLoadingComments(true);
      try {
        // 2. Create an array of fetch promises for the first 5 models
        const commentPromises = homeModels.slice(0, 5).map(async (model) => {
          const response = await fetch(`/api/media/${model.id}/interactions`);
          if (!response.ok) {
            // Don't throw, just return empty array for this model
            console.error(`Failed to fetch comments for model ${model.id}`);
            return [];
          }
          const data = await response.json();
          // 3. Add modelName to each comment
          return data.comments.map(comment => ({
            ...comment,
            modelName: model.name,
          }));
        });

        const results = await Promise.allSettled(commentPromises);

        // 4. Aggregate comments from all models
        const allComments = results
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);

        // 5. Sort by date and take the top 3
        const sortedComments = allComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setAggregatedComments(sortedComments.slice(0, 3));

      } catch (error) {
        console.error("Error fetching or processing comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchCommentsForModels();
  }, [homeModels]);

  const isLoading = isLoadingModels || isLoadingComments;

  return (
    <section className="section bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">Avis Récents sur nos Modèles</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Découvrez ce que nos clients pensent des modèles LYCKA HOME.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center">Chargement des avis...</p>
        ) : aggregatedComments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aggregatedComments.map((comment) => (
              <CommentWithModelCard key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Il n'y a pas encore d'avis récents à afficher.
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentCommentsSection;
