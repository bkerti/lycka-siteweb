
import { Button } from "@/components/ui/button";
import { HomeModel } from "@/models/HomeModel";
import { useNavigate } from "react-router-dom";

interface ModelDescriptionProps {
  model: HomeModel;
  onRequestContact: () => void;
}

const ModelDescription = ({ model, onRequestContact }: ModelDescriptionProps) => {
  const navigate = useNavigate();
  const floors = model.floors || 1;
  const livingRooms = model.livingRooms || 1;
  
  const defaultDescription = `Le ${model.name} est un modèle de maison LYCKA HOME associant esthétique moderne, fonctionnalité optimale et performance énergétique pour un confort de vie exceptionnel. 
    Cette maison de ${floors} étage${floors > 1 ? 's' : ''} offre ${livingRooms} salon${livingRooms > 1 ? 's' : ''} et des espaces de vie lumineux et bien pensés, permettant à votre famille de s'épanouir dans un cadre adapté à vos besoins.`;

  const handleBuyClick = () => {
    navigate("/contact", {
      state: {
        subject: `Demande d'achat pour le modèle ${model.name}`,
        modelId: model.id,
        modelName: model.name,
        message: `Je souhaite acheter le modèle ${model.name}.`
      }
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Description</h2>
      <p className="text-muted-foreground mb-6">
        {model.description || defaultDescription}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={onRequestContact} className="bg-lycka-secondary hover:bg-lycka-primary">
          Demander plus d'informations
        </Button>
        <Button onClick={handleBuyClick} className="bg-lycka-primary hover:bg-lycka-secondary">
          Acheter ce modèle
        </Button>
      </div>
    </div>
  );
};

export default ModelDescription;
