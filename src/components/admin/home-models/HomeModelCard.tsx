
import { HomeModel } from "@/models/HomeModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HomeModelCardProps {
  model: HomeModel;
  onEdit: (model: HomeModel) => void;
  onDelete: (id: string) => void;
}

const HomeModelCard = ({ model, onEdit, onDelete }: HomeModelCardProps) => {
  const galleryImages = model.media || [];

  return (
    <Card key={model.id}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{model.name}</CardTitle>
        <p className="text-sm text-gray-500">
          {model.price.toLocaleString('fr-FR')} € · {model.sqm} m²
        </p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex mb-2">
          {galleryImages.length > 0 ? (
            <Carousel className="w-20 h-20 mr-3 relative group">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image.url}
                      alt={image.alt || `${model.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {galleryImages.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </Carousel>
          ) : (
            <img
              src="/placeholder.svg"
              alt={model.name}
              className="w-20 h-20 object-cover rounded mr-3"
            />
          )}
          {model.description && model.description.trim() && <p className="text-sm text-gray-600 line-clamp-3">{model.description}</p>}
        </div>
        <div className="text-xs text-gray-500">
          {galleryImages.length} image(s) dans la galerie
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(model)}>
            <Edit className="mr-1" size={14} />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(model.id)}>
            <Trash2 className="mr-1" size={14} />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HomeModelCard;
