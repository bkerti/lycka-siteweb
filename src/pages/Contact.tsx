import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="Contactez-nous"
          subtitle="Notre équipe est à votre disposition pour répondre à toutes vos questions"
          backgroundImage="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        />

        <section className="section bg-background">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div>
                <h2 className="mb-6">Informations de contact</h2>
                <p className="text-muted-foreground mb-8">
                  Notre équipe est disponible pour vous aider et répondre à toutes vos questions concernant nos services et projets en cours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-muted p-3 rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-lycka-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Adresse</h3>
                      <p className="text-muted-foreground">123 Rue de l'Architecture, 75001 Paris, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-muted p-3 rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-lycka-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">lyckahomed@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-muted p-3 rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-lycka-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">+237656186349</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-muted p-3 rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-lycka-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">Horaires d'ouverture</h3>
                      <p className="text-muted-foreground">Lundi - Vendredi: 9h00 - 18h00</p>
                      <p className="text-muted-foreground">Samedi: 10h00 - 15h00</p>
                      <p className="text-muted-foreground">Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-8 rounded-lg overflow-hidden shadow-lg h-[300px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2314698105456!2d2.3309799158429897!3d48.86380237928789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1bdff0bf2f%3A0x5592409467436251!2zUGFyaXMsIEZyYW5jZQ!5e0!3m2!1sen!2sus!4v1635098872950!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="LYCKA Location"
                  ></iframe>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-muted p-8 rounded-lg shadow-md">
                <h2 className="mb-6">Envoyez-nous un message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
