

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import InViewAnimator from "./animators/InViewAnimator";

const LyckaHomeSection = () => {
  return (
    <InViewAnimator>
      <section className="section bg-lycka-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="mb-4">Découvrez LYCKA HOME</h2>
          <p className="max-w-3xl mx-auto mb-8">
            Des modèles de maisons personnalisables qui allient design contemporain, fonctionnalité et performance énergétique.
          </p>
          <Button asChild className="bg-white text-lycka-primary hover:bg-gray-100">
            <Link to="/lycka-home">Découvrir LYCKA HOME</Link>
          </Button>
        </div>
      </section>
    </InViewAnimator>
  );
};

export default LyckaHomeSection;

