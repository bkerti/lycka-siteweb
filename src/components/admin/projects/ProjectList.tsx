
import { Project } from "@/models/Project";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Projets actuels</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
