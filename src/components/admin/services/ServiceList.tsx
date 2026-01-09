
import { Service } from "@/models/Service";
import ServiceCard from "./ServiceCard";

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Services actuels</h2>
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
