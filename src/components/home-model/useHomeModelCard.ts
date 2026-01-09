
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useHomeModelCard(id: string, name: string, price: number) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Format price in FCFA instead of EUR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " FCFA";
  };

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  const handleBuyClick = () => {
    navigate("/contact", {
      state: {
        subject: `Demande d'achat pour le modèle ${name}`,
        modelId: id,
        modelName: name,
        message: `Je souhaite acheter le modèle ${name} au prix de ${formatPrice(price)}.`
      }
    });
  };

  // Generate carousel images based on the original imageUrl
  const getCarouselImages = (imageUrl: string, images?: string[]) => {
    if (images && images.length > 0) return images;
    
    return [
      imageUrl,
      imageUrl,
      imageUrl,
    ];
  };

  return {
    isHovered,
    formatPrice,
    handleHoverChange,
    handleBuyClick,
    getCarouselImages
  };
}
