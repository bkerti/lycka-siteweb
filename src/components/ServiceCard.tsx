
import { Link } from "react-router-dom";
import InViewAnimator from "./animators/InViewAnimator";
import DynamicIcon from "./DynamicIcon";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const ServiceCard = ({ title, description, icon, link }: ServiceCardProps) => {
  return (
    <InViewAnimator tag="div" className="h-full">
      <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow service-card-hover h-full flex flex-col">
        <div className="text-primary mb-4">
          <DynamicIcon iconName={icon} />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-card-foreground">{title.toUpperCase()}</h3>
        <p className="text-muted-foreground mb-5 flex-grow">{description}</p>
        <Link
          to={link}
          className="inline-block text-primary font-medium hover:text-secondary transition-colors mt-auto"
        >
          En savoir plus →
        </Link>
      </div>
    </InViewAnimator>
  );
};

export default ServiceCard;
