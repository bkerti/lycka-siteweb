
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/models/Project";

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onProjectClick }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Aucun projet ne correspond à ce filtre.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="transform transition-transform hover:scale-105"
        >
          <ProjectCard
            id={project.id}
            title={project.title}
            category={project.category}
            imageUrl={project.media && project.media.length > 0 ? project.media[0].url : "/placeholder.svg"}
            images={project.media.map(m => m.url)}
            onViewDetails={() => onProjectClick(project)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
