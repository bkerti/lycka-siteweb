import React, { useEffect, useState, useMemo } from 'react';
import { MediaItem } from '@/models/MediaItem';

interface Comment {
  id: string;
  media_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface Reaction {
  type: string;
  count: number;
}

interface MediaInteractionsData {
  comments: Comment[];
  reactions: { [key: string]: Reaction };
}

interface CombinedInteraction extends MediaItem {
  interactions: MediaInteractionsData;
  totalInteractions: number;
}

const AdminMediaInteractions: React.FC = () => {
  const [combinedInteractions, setCombinedInteractions] = useState<CombinedInteraction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch both interactions and gallery items in parallel
        const [interactionsResponse, galleryItemsResponse] = await Promise.all([
                fetch(`/api/interactions`, { headers }),
                fetch(`/api/gallery-items`, { headers })        ]);

        if (!interactionsResponse.ok) {
          throw new Error(`Failed to fetch interactions: ${interactionsResponse.statusText}`);
        }
        if (!galleryItemsResponse.ok) {
          throw new Error(`Failed to fetch gallery items: ${galleryItemsResponse.statusText}`);
        }

        const interactionsData: { [mediaId: string]: MediaInteractionsData } = await interactionsResponse.json();
        const galleryItemsData: MediaItem[] = await galleryItemsResponse.json();

        // Combine the data
        const combined = galleryItemsData.map(mediaItem => {
          const mediaId = mediaItem.id;
          const interactions = interactionsData[mediaId] || { comments: [], reactions: {} };
          const totalReactions = Object.values(interactions.reactions).reduce((sum, reaction) => sum + reaction.count, 0);
          const totalInteractions = interactions.comments.length + totalReactions;

          return {
            ...mediaItem,
            interactions,
            totalInteractions,
          };
        });

        // Sort by the ones with the most interactions first
        combined.sort((a, b) => b.totalInteractions - a.totalInteractions);

        setCombinedInteractions(combined);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalInteractionsOverall = useMemo(() => {
    return combinedInteractions.reduce((sum, item) => sum + item.totalInteractions, 0);
  }, [combinedInteractions]);

  const handleDeleteComment = async (mediaId: string, commentId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    // Clear previous errors to ensure UI is not stuck in an error state
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`/api/media/${mediaId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete comment.' }));
        throw new Error(errorData.message || 'Failed to delete comment.');
      }

      // Update state immutably to ensure React re-renders
      setCombinedInteractions(prevInteractions =>
        prevInteractions.map(item => {
          if (item.id === mediaId) {
            // Create a new, updated item with the comment removed
            return {
              ...item,
              interactions: {
                ...item.interactions,
                comments: item.interactions.comments.filter(c => c.id !== commentId),
              },
              totalInteractions: item.totalInteractions - 1,
            };
          }
          // Return other items unchanged
          return item;
        })
      );

    } catch (err) {
      setError((err as Error).message);
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return <p>Chargement des interactions...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Commentaires & Interactions</h2>

      {/* Analytics Section */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-card">
        <h3 className="text-xl font-semibold mb-2">Statistiques</h3>
        <p>Nombre total d'interactions: <strong>{totalInteractionsOverall}</strong></p>
      </div>

      {combinedInteractions.length === 0 ? (
        <div className="text-center py-10 px-4 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-medium">Aucune interaction trouvée</h3>
          <p className="text-sm text-muted-foreground">Il n'y a actuellement aucun commentaire ou réaction sur les médias de votre site.</p>
        </div>
      ) : (
        combinedInteractions.map((item) => (
          <div key={item.id} className="mb-6 p-4 border rounded-lg shadow-sm bg-card flex gap-4">
            <div className="w-1/4">
              <img src={item.url} alt={item.title} className="rounded-lg object-cover w-full h-auto" />
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">Section: {item.section}</p>
            </div>
            <div className="w-3/4">
              <div className="mb-4">
                <h4 className="text-lg font-medium">Commentaires ({item.interactions.comments.length}):</h4>
                {item.interactions.comments.length > 0 ? (
                  item.interactions.comments.map((comment) => (
                    <div key={comment.id} className="ml-4 mt-2 p-2 border-l-2 border-gray-200 flex justify-between items-start gap-4">
                      <div>
                        <p className="font-bold text-sm">{comment.author_name} <span className="text-xs font-normal text-muted-foreground">({new Date(comment.created_at).toLocaleString()})</span>:</p>
                        <p className="text-muted-foreground">{comment.comment_text}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(item.id, comment.id)}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
                        aria-label="Supprimer le commentaire"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="ml-4 text-sm text-muted-foreground">Aucun commentaire pour ce média.</p>
                )}
              </div>

              <div>
                <h4 className="text-lg font-medium">Réactions:</h4>
                {Object.keys(item.interactions.reactions || {}).length > 0 ? (
                  <ul className="ml-4 list-disc list-inside text-sm text-muted-foreground">
                    {Object.values(item.interactions.reactions).map((reaction) => (
                      <li key={reaction.type}>{reaction.type}: {reaction.count}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4 text-sm text-muted-foreground">Aucune réaction pour ce média.</p>
                )}
              </div>

               {/* Interaction Percentage */}
              {totalInteractionsOverall > 0 && (
                <div className="mt-4 pt-2 border-t">
                  <p className="text-sm font-semibold">
                    Part des interactions: {((item.totalInteractions / totalInteractionsOverall) * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMediaInteractions;