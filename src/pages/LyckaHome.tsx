
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { LyckaHomeModels } from "@/components/lycka-home/LyckaHomeModels";
import LyckaHomeProcess from "@/components/lycka-home/LyckaHomeProcess";
import RecentCommentsSection from "@/components/lycka-home/RecentCommentsSection";
import { useHomeModels } from "@/hooks/useHomeModels";
import { carouselImages } from "@/data/homeModels";

const LyckaHome = () => {
  const { fetchHomeModels } = useHomeModels();

  useEffect(() => {
    fetchHomeModels();

    const handleFocus = () => {
      fetchHomeModels();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchHomeModels]);

  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="LYCKA HOME"
          subtitle="Des modèles de maisons conçus pour votre bien-être et adaptés à vos besoins"
          backgroundImage="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          carouselImages={carouselImages}
        />

        {/* Models Section */}
        <LyckaHomeModels />

        {/* Process Section */}
        <LyckaHomeProcess />

        {/* Recent Comments Section */}
        <RecentCommentsSection />
      </main>
      <Footer />
    </>
  );
};

export default LyckaHome;
