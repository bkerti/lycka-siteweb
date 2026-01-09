
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ModelImageCarouselProps {
  images: string[];
  modelName: string;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

const ModelImageCarousel = ({ 
  images, 
  modelName, 
  isHovered, 
  onHoverChange 
}: ModelImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div 
      className="aspect-[4/3] w-full overflow-hidden relative"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Carousel Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${modelName} - Vue ${index + 1}`}
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            aria-label="Image précédente"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
            aria-label="Image suivante"
          >
            <ArrowRight className="h-4 w-4 text-white" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
                aria-label={`Voir image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelImageCarousel;
