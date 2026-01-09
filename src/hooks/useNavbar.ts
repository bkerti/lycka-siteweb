
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on a dark background page
  const isDarkPage = location.pathname === "/gallery" || 
                     location.pathname === "/contact" ||
                     location.pathname.includes("/admin");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize for responsive navbar
  useEffect(() => {
    const handleResize = () => {
      // Only show mobile menu button on smaller screens
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Calculate text color based on scroll state and page background
  const getTextColorClass = () => {
    if (isScrolled) {
      return "text-foreground"; // Use theme's foreground color on scroll
    }
    // For transparent navbar, text should be white to be visible on hero images
    // This works for both light and dark mode as hero has a dark overlay
    return "text-white";
  };

  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDarkPage,
    toggleMobileMenu,
    getTextColorClass
  };
};
