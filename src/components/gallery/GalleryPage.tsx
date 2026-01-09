
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import GalleryContent from "./GalleryContent";

const GalleryPage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="Galerie"
          subtitle="Découvrez nos réalisations et modèles en images et vidéos"
          backgroundImage="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          carouselImages={[
            "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          ]}
        />
        <GalleryContent />
      </main>
      <Footer />
    </>
  );
};

export default GalleryPage;
