
import { cn } from "@/lib/utils";
import { useNavbar } from "@/hooks/useNavbar";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import { MobileMenuButton } from "./navbar/MobileMenuButton";

const Navbar = () => {
  const {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDarkPage,
    toggleMobileMenu,
    getTextColorClass
  } = useNavbar();

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo isScrolled={isScrolled} isDarkPage={isDarkPage} />
        
        {/* Desktop Navigation */}
        <DesktopNav getTextColorClass={getTextColorClass} />

        {/* Mobile Menu Button */}
        <MobileMenuButton 
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          isDarkPage={isDarkPage}
          isScrolled={isScrolled}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </header>
  );
};

export default Navbar;
