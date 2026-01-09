
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import LyckaHomeSection from "@/components/LyckaHomeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LyckaBlogSection from "@/components/LyckaBlogSection";

import CtaSection from "@/components/CtaSection";

const Index = () => {
  // Carousel images for the hero section
  const heroImages = [
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
  ];
  
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section with Carousel */}
        <Hero
          title="Excellence en Architecture et Génie Civil"
          subtitle="LYCKA conçoit et réalise des projets innovants et durables qui transforment l'environnement bâti."
          backgroundImage={heroImages[0]}
          carouselImages={heroImages}
          ctaText="Découvrir nos projets"
          ctaLink="/projects"
        />

        {/* About Section */}
        <AboutSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* LYCKA HOME Section */}
        <LyckaHomeSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Lycka Blog Section */}
        <LyckaBlogSection />

        {/* CTA Contact Section */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
