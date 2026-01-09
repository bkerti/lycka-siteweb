import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useHomeModelDetail } from "@/hooks/useHomeModelDetail";
import ModelImageCarousel from "@/components/lycka-home/ModelImageCarousel";
import ModelCharacteristics from "@/components/lycka-home/ModelCharacteristics";
import ModelDescription from "@/components/lycka-home/ModelDescription";
import ModelOptions from "@/components/lycka-home/ModelOptions";
import MediaCommentSection from "@/components/MediaCommentSection";

const LyckaHomeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    model, 
    isLoading,
    formatPrice, 
    getCarouselImages, 
    handleContactRequest 
  } = useHomeModelDetail(id);

  // Render a loading state while the model list is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement du modèle...</p>
      </div>
    );
  }
  
  // This will be false if the hook redirects, but it's a good fallback
  if (!model) {
    return null;
  }
  
  const carouselImages = getCarouselImages(model);
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button 
              onClick={() => navigate("/lycka-home")} 
              variant="outline" 
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux modèles
            </Button>
            <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
            <div className="flex items-center text-lg text-lycka-secondary font-medium mb-6">
              <span className="font-bold">{formatPrice(model.price)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ModelImageCarousel images={carouselImages} modelName={model.name} />
            
            <div>
              <ModelCharacteristics model={model} formatPrice={formatPrice} />
              <ModelDescription model={model} onRequestContact={handleContactRequest} />
            </div>
          </div>
          
          <ModelOptions />

          <div className="mt-12">
            <MediaCommentSection mediaId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LyckaHomeDetail;
