import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoPng from '/sc/log.png';
import logoWebp from '/sc/log.png?format=webp';

interface LogoProps {
  isScrolled: boolean;
  isDarkPage: boolean;
}

const Logo = ({ isScrolled, isDarkPage }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <picture>
        <source srcSet={logoWebp} type="image/webp" />
        <source srcSet={logoPng} type="image/png" />
        <img 
          src={logoPng} 
          alt="LYCKA Logo" 
          className="h-10 md:h-12"
        />
      </picture>
      <span className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 bg-clip-text text-transparent">
        LYCKA
      </span>
    </Link>
  );
};

export default Logo;
