
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectHeaderProps {
  onNewProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ onNewProject }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Gestion des Projets</h1>
      <Button onClick={onNewProject}>
        <Plus className="mr-2" size={16} />
        Nouveau Projet
      </Button>
    </div>
  );
};

export default ProjectHeader;
