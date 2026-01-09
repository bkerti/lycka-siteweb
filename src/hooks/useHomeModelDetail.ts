import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeModel } from '@/models/HomeModel';
import { useHomeModels } from '@/hooks/useHomeModels';
import { toast } from '@/components/ui/use-toast';

export function useHomeModelDetail(modelId: string | undefined) {
  const navigate = useNavigate();
  const { homeModels, isLoading } = useHomeModels(); // Use the dynamic list of models

  // Find the model in the list from the context
  const model = homeModels.find(m => m.id === modelId);

  useEffect(() => {
    // If the main list is still loading, don't do anything yet
    if (isLoading) {
      return;
    }

    // If, after loading, the model is still not found, then it really doesn't exist
    if (!model) {
      navigate("/lycka-home");
      toast({
        title: "Modèle introuvable",
        description: "Ce modèle de maison n'existe pas.",
        variant: "destructive",
      });
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [model, isLoading, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " FCFA";
  };

  const getCarouselImages = (model: HomeModel | undefined) => {
    if (!model) return [];
    if (model.media && model.media.length > 0) {
      return model.media.map(item => item.url);
    }
    return ["/placeholder.svg"]; // Return a placeholder if no images
  };

  const handleContactRequest = () => {
    if (model) {
      navigate("/contact", {
        state: {
          subject: `Demande d'information pour le modèle ${model.name}`,
          modelId: model.id,
          modelName: model.name,
          message: `Je souhaite obtenir plus d'informations sur le modèle ${model.name}.`
        }
      });
    }
  };

  const handleBuyRequest = () => {
    if (model) {
      navigate("/contact", {
        state: {
          subject: `Demande d'achat pour le modèle ${model.name}`,
          modelId: model.id,
          modelName: model.name,
          message: `Je souhaite acheter le modèle ${model.name} au prix de ${formatPrice(model.price)}.`
        }
      });
    }
  };

  return {
    model,
    isLoading, // Expose loading state to the component
    formatPrice,
    getCarouselImages,
    handleContactRequest,
    handleBuyRequest
  };
}
