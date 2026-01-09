
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <section className="section bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">À propos de LYCKA</h2>
            <p className="text-foreground mb-4">
              LYCKA est un bureau d'études spécialisé en génie civil et en architecture, offrant une gamme complète de services pour tous vos projets de construction et de rénovation.
            </p>
            <p className="text-foreground mb-6">
              Notre équipe d'experts combine créativité, expertise technique et connaissance approfondie des normes pour vous offrir des solutions sur mesure qui répondent à vos besoins et aspirations.
            </p>
            <Button asChild className="bg-lycka-secondary hover:bg-lycka-primary">
              <Link to="/contact">Contactez-nous</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="rounded-lg overflow-hidden"
              onMouseEnter={() => setHoveredImage(0)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src="/sc/m.jpg"
                alt="LYCKA team"
                className={`w-full h-full object-cover transition-transform duration-500 ${hoveredImage === 0 ? 'scale-110' : ''}`}
              />
            </div>
            <div 
              className="rounded-lg overflow-hidden mt-8"
              onMouseEnter={() => setHoveredImage(1)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src="/sc/m1.jpg"
                alt="LYCKA office"
                className={`w-full h-full object-cover transition-transform duration-500 ${hoveredImage === 1 ? 'scale-110' : ''}`}
              />
            </div>
            <div 
              className="rounded-lg overflow-hidden -mt-8"
              onMouseEnter={() => setHoveredImage(2)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src="/sc/m2.jpg"
                alt="LYCKA project"
                className={`w-full h-full object-cover transition-transform duration-500 ${hoveredImage === 2 ? 'scale-110' : ''}`}
              />
            </div>
            <div 
              className="rounded-lg overflow-hidden"
              onMouseEnter={() => setHoveredImage(3)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <img
                src="/sc/m3.jpg"
                alt="LYCKA design"
                className={`w-full h-full object-cover transition-transform duration-500 ${hoveredImage === 3 ? 'scale-110' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
