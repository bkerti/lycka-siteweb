
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Service } from "@/models/Service";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  console.log("ServiceCard rendering. service.imageUrl:", service.imageUrl);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{service.title.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex mb-2">
          {service.imageUrl ? ( // Conditional rendering based on imageUrl
            <img 
              src={service.imageUrl} 
              alt={service.title}
              className="w-20 h-20 object-cover rounded mr-3"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded mr-3 text-sm text-gray-500">
              No Image
            </div>
          )}
          <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
            <Edit className="mr-1" size={14} />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(service.id)}>
            <Trash2 className="mr-1" size={14} />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
