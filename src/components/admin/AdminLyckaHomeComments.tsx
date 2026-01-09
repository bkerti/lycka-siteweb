import React, { useEffect, useState, useMemo } from 'react';
import { HomeModel } from '@/models/HomeModel';

interface Comment {
  id: string;
  media_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface MediaInteractionsData {
  comments: Comment[];
  // We don't need reactions for this component, but keeping the type for consistency
  reactions: { [key: string]: unknown }; 
}

interface CombinedInteraction extends HomeModel {
  interactions: MediaInteractionsData;
  totalInteractions: number;
}

const AdminLyckaHomeComments: React.FC = () => {
  const [combinedData, setCombinedData] = useState<CombinedInteraction[]>([]);
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

        // Fetch both interactions and home models in parallel
        const [interactionsResponse, homeModelsResponse] = await Promise.all([
                fetch(`/api/interactions`, { headers }),
                fetch(`/api/homemodels`, { headers })        ]);

        if (!interactionsResponse.ok) {
          throw new Error(`Failed to fetch interactions: ${interactionsResponse.statusText}`);
        }
        if (!homeModelsResponse.ok) {
          throw new Error(`Failed to fetch home models: ${homeModelsResponse.statusText}`);
        }

        const interactionsData: { [mediaId: string]: MediaInteractionsData } = await interactionsResponse.json();
        const homeModelsData: HomeModel[] = await homeModelsResponse.json();

        // Combine the data
        const combined = homeModelsData.map(homeModel => {
          const interactions = interactionsData[homeModel.id] || { comments: [], reactions: {} };
          const totalInteractions = interactions.comments.length; // Only counting comments for now

          return {
            ...homeModel,
            interactions,
            totalInteractions,
          };
        }).filter(item => item.totalInteractions > 0); // Keep only models with comments

        // Sort by the ones with the most interactions first
        combined.sort((a, b) => b.totalInteractions - a.totalInteractions);

        setCombinedData(combined);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleDeleteComment = async (modelId: string, commentId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`/api/media/${modelId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete comment.' }));
        throw new Error(errorData.message || 'Failed to delete comment.');
      }

      // Update state to remove the comment
      setCombinedData(prevData =>
        prevData.map(item => {
          if (item.id === modelId) {
            return {
              ...item,
              interactions: {
                ...item.interactions,
                comments: item.interactions.comments.filter(c => c.id !== commentId),
              },
              totalInteractions: item.totalInteractions - 1,
            };
          }
          return item;
        }).filter(item => item.totalInteractions > 0) // Remove model from view if it has no more comments
      );

    } catch (err) {
      setError((err as Error).message);
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return <p>Chargement des avis...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Avis - LYCKA Home</h2>

      {combinedData.length === 0 ? (
        <div className="text-center py-10 px-4 border rounded-lg shadow-sm bg-card">
          <h3 className="text-lg font-medium">Aucun avis trouvé</h3>
          <p className="text-sm text-muted-foreground">Il n'y a actuellement aucun avis sur les modèles Lycka Home.</p>
        </div>
      ) : (
        combinedData.map((model) => (
          <div key={model.id} className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
            <h3 className="text-lg font-semibold mt-2 mb-4">Modèle : {model.name}</h3>
            <div className="w-full">
              {model.interactions.comments.map((comment) => (
                <div key={comment.id} className="ml-4 mt-2 p-2 border-l-2 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-sm">{comment.author_name} <span className="text-xs font-normal text-muted-foreground">({new Date(comment.created_at).toLocaleString()})</span>:</p>
                    <p className="text-muted-foreground">{comment.comment_text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(model.id, comment.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
                    aria-label="Supprimer le commentaire"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminLyckaHomeComments;
