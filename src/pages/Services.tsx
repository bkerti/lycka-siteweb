import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServicesContext } from "@/hooks/useServicesContext";

const Services = () => {
  const { services, isLoading, error } = useServicesContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const carouselImages = [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586952205572-2cb2bccbab21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581093805770-9a6c0095af01?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="Nos Services"
          subtitle="LYCKA vous accompagne dans toutes les étapes de votre projet architectural"
          backgroundImage="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          carouselImages={carouselImages}
        />

        <section className="section bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Notre Expertise à Votre Service</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                LYCKA propose une gamme complète de services en génie civil et architecture pour répondre à tous vos besoins, des études préliminaires à la réalisation finale.
              </p>
            </div>

            {isLoading && <div>Chargement des services...</div>}
            {error && <div>Une erreur est survenue: {error.message}</div>}
            {!isLoading && !error && (
              <motion.div 
                className="space-y-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    id={service.id}
                    variants={itemVariants}
                    className={`flex flex-col ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-8 lg:gap-16 items-center scroll-mt-24`}
                  >
                    <div className="lg:w-1/2">
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2">
                      <h3 className="text-3xl font-semibold mb-4">{service.title.toUpperCase()}</h3>
                      <p className="text-muted-foreground mb-6">{service.description}</p>
                      
                      <div className="mb-8">
                        <h4 className="text-lg font-medium mb-4">Ce que nous proposons :</h4>
                        <ul className="space-y-2">
                          {service.features?.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <svg
                                className="w-5 h-5 text-lycka-secondary mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button asChild className="bg-lycka-secondary hover:bg-lycka-primary">
                        <Link to="/contact">Discuter de votre projet</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section bg-lycka-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="mb-6">Besoin d'un service sur mesure ?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Chaque projet est unique. Si vous ne trouvez pas le service spécifique que vous recherchez, contactez-nous pour discuter de vos besoins particuliers. Nous serons ravis de vous proposer une solution adaptée.
            </p>
            <Button asChild className="bg-white text-lycka-primary hover:bg-gray-100">
              <Link to="/contact">Contactez-nous</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
