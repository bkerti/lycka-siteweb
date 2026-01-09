
import { HomeModel } from "@/models/HomeModel";
import HomeModelCard from "./HomeModelCard";

interface HomeModelListProps {
  models: HomeModel[];
  onEdit: (model: HomeModel) => void;
  onDelete: (id: string) => void;
}

const HomeModelList = ({ models, onEdit, onDelete }: HomeModelListProps) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Modèles actuels</h2>
      <div className="space-y-4">
        {models.map((model) => (
          <HomeModelCard 
            key={model.id}
            model={model}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeModelList;
