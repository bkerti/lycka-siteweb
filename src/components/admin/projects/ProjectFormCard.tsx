
import { Card, CardContent } from "@/components/ui/card";
import ProjectForm from "./ProjectForm";
import { Project } from "@/models/Project";

interface ProjectFormCardProps {
  editingProject: Project | null;
  onSubmit: (data: Omit<Project, "id" | "media">, media: { url: string; type: string }[]) => Promise<boolean>;
  onCancel: () => void;
}

const ProjectFormCard: React.FC<ProjectFormCardProps> = ({ 
  editingProject, 
  onSubmit, 
  onCancel
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        {editingProject ? 'Modifier le projet' : 'Ajouter un projet'}
      </h2>
      <Card>
        <CardContent className="pt-6">
          <ProjectForm
            key={editingProject?.id || "new-project-form"}
            editingProject={editingProject}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFormCard;
