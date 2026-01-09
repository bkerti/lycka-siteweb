import { HomeModel } from "@/models/HomeModel";
import HomeModelCard from "@/components/HomeModelCard";
import { Link } from "react-router-dom";

interface ModelGridProps {
  models: HomeModel[];
}

const ModelGrid = ({ models }: ModelGridProps) => {
  if (models.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Aucun modèle ne correspond à ce filtre.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map((model) => (
        <Link to={`/lycka-home/${model.id}`} key={model.id} className="no-underline text-current">
          <HomeModelCard
            id={model.id}
            name={model.name}
            price={model.price}
            sqm={model.sqm}
            imageUrl={model.media && model.media.length > 0 ? model.media[0].url : "/placeholder.svg"}
            images={model.media && model.media.length > 0 ? model.media.map(item => item.url) : []}
            description={model.description}
          />
        </Link>
      ))}
    </div>
  );
};

export default ModelGrid;
