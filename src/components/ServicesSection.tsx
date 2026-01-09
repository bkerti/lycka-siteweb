
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServicesContext } from "@/hooks/useServicesContext";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const { services, isLoading, error } = useServicesContext();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Une erreur est survenue: {error.message}</div>;
  }

  return (
    <section className="section bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-foreground">Nos Services</h2>
          <p className="text-foreground max-w-3xl mx-auto">
            LYCKA vous accompagne à chaque étape de votre projet, de la conception initiale à la réalisation finale, en passant par l'obtention des permis nécessaires.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon} // Pass the icon name string
              link={`/services#${service.id}`}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="hover:bg-lycka-secondary hover:text-primary-foreground">
            <Link to="/services">Tous nos services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
