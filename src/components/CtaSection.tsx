
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import InViewAnimator from "./animators/InViewAnimator";

const CtaSection = () => {
  return (
    <section className="section bg-muted">
      <div className="container mx-auto text-center">
        <InViewAnimator>
          <h2 className="mb-6">Prêt à démarrer votre projet ?</h2>
        </InViewAnimator>
        <InViewAnimator delay={0.1}>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Contactez-nous dès aujourd'hui pour discuter de votre projet et découvrir comment LYCKA peut vous aider à le concrétiser.
          </p>
        </InViewAnimator>
        <InViewAnimator delay={0.2}>
          <Button asChild className="bg-lycka-secondary hover:bg-lycka-primary text-primary-foreground px-8 py-6 text-lg">
            <Link to="/contact">Contactez-nous</Link>
          </Button>
        </InViewAnimator>
      </div>
    </section>
  );
};

export default CtaSection;
