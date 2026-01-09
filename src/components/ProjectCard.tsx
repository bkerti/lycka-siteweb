
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "./ui/button";
import InViewAnimator from "./animators/InViewAnimator";

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  images?: string[];
  price?: number;
  onViewDetails?: () => void;
}

const ProjectCard = ({ id, title, category, imageUrl, images, onViewDetails }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Generate additional images for the carousel based on the original imageUrl
  // In a real application, you would have actual different images
  const carouselImages = images || [
    imageUrl,
    imageUrl,
    imageUrl,
  ];
  
  // Auto-rotate images every 6 seconds
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, carouselImages.length]);

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <InViewAnimator className="h-full">
      <div 
        className="group relative block overflow-hidden rounded-lg h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          {carouselImages.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`${title} - Vue ${index + 1}`}
              className={`absolute h-full w-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : ''
              } ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-500`}
            />
          ))}
          
          {/* Carousel Navigation */}
          {isHovered && (
            <>
              <button 
                onClick={goToPrev} 
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-secondary/50 hover:bg-secondary/70 rounded-full p-2 transition-colors"
                aria-label="Image précédente"
              >
                <ArrowLeft className="h-4 w-4 text-secondary-foreground" />
              </button>
              <button 
                onClick={goToNext} 
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-secondary/50 hover:bg-secondary/70 rounded-full p-2 transition-colors"
                aria-label="Image suivante"
              >
                <ArrowRight className="h-4 w-4 text-secondary-foreground" />
              </button>
              
              {/* Dots indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary w-3' : 'bg-primary/50'
                    }`}
                    aria-label={`Voir image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={`absolute inset-0 flex flex-col justify-end p-4 project-card-overlay transition-all duration-300 ${isHovered ? 'bg-background/60' : 'bg-background/40'}`}>
          <p className="text-sm font-medium text-primary-foreground/80">{category}</p>
          <h3 className={`text-xl font-semibold text-primary-foreground transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-2'}`}>{title}</h3>
          
          {/* Bouton "Voir détails" */}
          {onViewDetails && (
            <Button 
              variant="default" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewDetails();
              }}
              className="mt-3 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              size="sm"
            >
              <Eye className="mr-1" size={16} /> Voir détails
            </Button>
          )}
        </div>
      </div>
    </InViewAnimator>
  );
};

export default ProjectCard;
