import { useState, useEffect, useCallback } from "react";
import { HomeModel } from "@/models/HomeModel";
import { MediaItem } from "@/models/MediaItem";
import { useToast } from "@/hooks/use-toast";

const API_URL = '/api';

export function useHomeModels() {
  const [homeModels, setHomeModels] = useState<HomeModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<HomeModel | null>(null);
  const [currentMedia, setCurrentMedia] = useState<MediaItem[]>([]);
  const { toast } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({ title: "Erreur d'authentification", description: "Token non trouvé.", variant: "destructive" });
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchHomeModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/homemodels`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setHomeModels(data);
    } catch (error) {
      console.error("Failed to fetch home models:", error);
      toast({ title: "Erreur", description: "Erreur lors de la récupération des modèles.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHomeModels();
  }, [fetchHomeModels]);

  const handleEdit = (model: HomeModel) => {
    setEditingModel(model);
    setCurrentMedia(model.media || []);
  };

  const handleDelete = async (id: string) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/homemodels/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': headers.Authorization },
      });
      if (!response.ok) throw new Error('Failed to delete home model');
      setHomeModels(homeModels.filter(model => model.id !== id));
      if (editingModel?.id === id) {
        setEditingModel(null);
      }
      toast({ title: "Modèle supprimé", description: "Le modèle a été supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting home model:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression du modèle.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: Partial<HomeModel>): Promise<boolean> => {
    const headers = getAuthHeaders();
    if (!headers) return false;

    const modelData = { ...data, media: currentMedia };

    try {
      if (editingModel) {
        const response = await fetch(`${API_URL}/homemodels/${editingModel.id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(modelData),
        });
        if (!response.ok) throw new Error('Failed to update home model');
        const resultModel = await response.json();
        setHomeModels(homeModels.map(m => m.id === resultModel.id ? resultModel : m));
        toast({ title: "Modèle mis à jour", description: "Le modèle a été mis à jour avec succès" });
      } else {
        const response = await fetch(`${API_URL}/homemodels`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(modelData),
        });
        if (!response.ok) throw new Error('Failed to create home model');
        const resultModel = await response.json();
        setHomeModels([...homeModels, resultModel]);
        toast({ title: "Modèle ajouté", description: "Le modèle a été ajouté avec succès" });
      }
      return true;
    } catch (error) {
      console.error("Error submitting home model:", error);
      toast({ title: "Erreur", description: "Erreur lors de la soumission du modèle.", variant: "destructive" });
      return false;
    }
  };

  const resetForm = () => {
    setEditingModel(null);
    setCurrentMedia([]);
  };

  const addMediaToGallery = (newMediaItems: MediaItem[]) => { // Accepts an array
    const validNewMediaItems = newMediaItems.filter(item => item.url);
    if (validNewMediaItems.length > 0) {
      setCurrentMedia(prevMedia => [...prevMedia, ...validNewMediaItems]); // Use functional update
      toast({ title: "Média(s) ajouté(s)", description: `${validNewMediaItems.length} média(s) ajouté(s) à la galerie` });
    }
  };

  const removeMediaFromGallery = (index: number) => {
    setCurrentMedia(currentMedia.filter((_, i) => i !== index));
  };

  return {
    homeModels,
    isLoading,
    editingModel,
    currentMedia,
    handleEdit,
    handleDelete,
    handleSubmit,
    resetForm,
    addMediaToGallery,
    removeMediaFromGallery,
    fetchHomeModels, // Export fetchHomeModels so it can be called externally
  };
}