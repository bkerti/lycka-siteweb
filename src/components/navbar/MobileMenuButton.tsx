
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  isDarkPage: boolean;
  isScrolled: boolean;
}

const MobileMenuButton = ({ toggleMobileMenu, isMobileMenuOpen, isDarkPage, isScrolled }: MobileMenuButtonProps) => {
  const iconColor = isScrolled ? "text-foreground" : "text-white";

  return (
    <button
      className="lg:hidden focus:outline-none"
      onClick={toggleMobileMenu}
    >
      <svg
        className={cn("w-6 h-6", iconColor)}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isMobileMenuOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};

export { MobileMenuButton };
