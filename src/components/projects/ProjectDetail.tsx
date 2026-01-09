
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Project } from "@/models/Project";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>
            {project.category} {project.location ? `- ${project.location}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
          {/* Left column: Image Carousel */}
          <div className="lg:order-1 lg:col-span-3">
            <Carousel className="w-full">
              <CarouselContent>
                {project.media?.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img.url}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-md lg:aspect-[16/9]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          
          {/* Right column: Project Details */}
          <div className="lg:order-2 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium">Description</h3>
            <p>{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {project.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Localisation</h4>
                  <p>{project.location}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Année</h4>
                  <p>{project.year}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Catégorie</h4>
                <p>{project.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                <p>{project.status === "realisations" ? "Réalisé" : "En conception"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetail;
