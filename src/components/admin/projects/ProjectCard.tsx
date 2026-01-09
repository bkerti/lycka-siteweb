
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Project } from "@/models/Project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <p className="text-sm text-gray-500">{project.category}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex mb-2">
          {project.media && project.media.length > 0 ? (
            <Carousel className="w-20 h-20 mr-3 relative group">
              <CarouselContent>
                {project.media.map((media, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={media.url}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.media.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          ) : (
            <img
              src="/placeholder.svg"
              alt={project.title}
              className="w-20 h-20 object-cover rounded mr-3"
            />
          )}
          <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
        </div>
        <div className="text-xs text-gray-500">
          {project.media?.length || 0} image(s) dans la galerie
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
            <Edit className="mr-1" size={14} />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(project.id)}>
            <Trash2 className="mr-1" size={14} />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
