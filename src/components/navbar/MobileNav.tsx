
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNav = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileNavProps) => {
  if (!isMobileMenuOpen) {
    return null;
  }

  return (
    <nav className="lg:hidden bg-background py-4 shadow-lg animate-fade-in">
      <div className="container mx-auto flex flex-col space-y-4">
        <Link 
          to="/" 
          className="text-foreground hover:text-secondary-foreground font-medium transition-colors py-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Accueil
        </Link>
        <Link 
          to="/services" 
          className="text-foreground hover:text-secondary-foreground font-medium transition-colors py-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Services
        </Link>
        <Link 
          to="/projects" 
          className="text-foreground hover:text-secondary-foreground font-medium transition-colors py-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Projets
        </Link>
        <Link 
          to="/lycka-home" 
          className="text-foreground hover:text-secondary-foreground font-medium transition-colors py-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          LYCKA HOME
        </Link>
        <Link 
          to="/gallery" 
          className="text-foreground hover:text-secondary-foreground font-medium transition-colors py-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Galerie
        </Link>

        <Link 
          to="/contact" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded transition-colors inline-block w-fit"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </Link>
        <div className="pt-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
