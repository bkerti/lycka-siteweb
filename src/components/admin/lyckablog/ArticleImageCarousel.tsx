import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ArticleImageCarouselProps {
  images: { url: string; type: string }[];
  articleTitle: string;
}

const ArticleImageCarousel = ({ images, articleTitle }: ArticleImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-lg overflow-hidden md:aspect-[16/9]">
      {/* Sizer for mobile to maintain aspect ratio of the current image */}
      <img 
        src={images[currentImageIndex].url} 
        alt="" 
        className="w-full h-auto invisible md:hidden" 
        aria-hidden="true" 
      />

      {/* Absolutely positioned images for the carousel effect */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={`${articleTitle} - Vue ${index + 1}`}
          className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      
      {/* Carousel Navigation */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
            aria-label="Image précédente"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <button 
            onClick={goToNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors"
            aria-label="Image suivante"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
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

export default ArticleImageCarousel;