
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";

interface DesktopNavProps {
  getTextColorClass: () => string;
}

const DesktopNav = ({ getTextColorClass }: DesktopNavProps) => {
  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
      <Link 
        to="/" 
        className={cn(getTextColorClass(), "hover:text-secondary-foreground font-medium transition-colors")}
      >
        Accueil
      </Link>
      <Link 
        to="/services" 
        className={cn(getTextColorClass(), "hover:text-secondary-foreground font-medium transition-colors")}
      >
        Services
      </Link>
      <Link 
        to="/projects" 
        className={cn(getTextColorClass(), "hover:text-secondary-foreground font-medium transition-colors")}
      >
        Projets
      </Link>
      <Link 
        to="/lycka-home" 
        className={cn(getTextColorClass(), "hover:text-secondary-foreground font-medium transition-colors")}
      >
        LYCKA HOME
      </Link>
      <Link 
        to="/gallery" 
        className={cn(getTextColorClass(), "hover:text-secondary-foreground font-medium transition-colors")}
      >
        Galerie
      </Link>

      <Link 
        to="/contact" 
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded transition-colors"
      >
        Contact
      </Link>
      <ModeToggle />
    </nav>
  );
};

export default DesktopNav;
