import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  carouselImages?: string[];
  ctaText?: string;
  ctaLink?: string;
  overlay?: boolean;
}

const Hero = ({
  title,
  subtitle,
  backgroundImage,
  carouselImages = [],
  ctaText,
  ctaLink,
  overlay = true,
}: HeroProps) => {
  // Combine single image with carousel images if provided
  const allImages = carouselImages.length > 0 
    ? carouselImages 
    : [backgroundImage];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, allImages.length]);

  // Auto rotate images every 5 seconds
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    const interval = setInterval(goToNextSlide, 5000);
    
    return () => clearInterval(interval);
  }, [allImages.length, goToNextSlide]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, allImages.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div 
      className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Carousel Images */}
      {allImages.map((image, index) => {
        const isCurrent = index === currentIndex;
        // Calculate next and previous index for preloading
        const isNext = index === (currentIndex + 1) % allImages.length;
        const isPrev = index === (currentIndex - 1 + allImages.length) % allImages.length;
        
        // Only set background image if it's the current, next, or previous slide
        // This ensures a smoother transition for adjacent slides while lazy-loading others
        const shouldLoadImage = isCurrent || isNext || isPrev;

        return (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: shouldLoadImage ? `url(${image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        );
      })}
      {overlay && (
        <div className="absolute inset-0 hero-gradient z-10"></div>
      )}
      
      {/* Navigation Arrows - Only show if more than one image */}
      {allImages.length > 1 && (
        <>
          <button 
            onClick={goToPrevSlide} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
            aria-label="Previous image"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <button 
            onClick={goToNextSlide} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
            aria-label="Next image"
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}
      
      {/* Dots indicator - Only show if more than one image */}
      {allImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <motion.div 
        className="container relative z-10 text-center px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-white mb-4 max-w-3xl mx-auto">{title}</motion.h1>
        {subtitle && (
          <motion.p variants={itemVariants} className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            {subtitle}
          </motion.p>
        )}
        {ctaText && ctaLink && (
          <motion.div variants={itemVariants}>
            <Button asChild className="bg-lycka-secondary hover:bg-lycka-primary text-white px-8 py-6 text-lg">
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Hero;
