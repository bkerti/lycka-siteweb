import { Link } from "react-router-dom";

interface LogoProps {
  isScrolled: boolean;
  isDarkPage: boolean;
}

const Logo = ({ isScrolled, isDarkPage }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/logo_header.png" 
        alt="LYCKA Logo" 
        className="h-16"
      />
    </Link>
  );
};

export default Logo;
