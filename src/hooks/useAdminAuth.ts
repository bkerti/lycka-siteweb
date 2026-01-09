import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// Helper to parse JWT
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const decodedToken = parseJwt(token);
      // Check if token is expired
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setAdminUsername(decodedToken.username);
      } else {
        localStorage.removeItem("adminToken");
        setIsAuthenticated(false);
        setAdminUsername(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    // Optional: Add an interval to check token expiration periodically
    const interval = setInterval(checkAuth, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [checkAuth]);

  const handleLogin = (username: string, token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
    setAdminUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAdminUsername(null);
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  return {
    isAuthenticated,
    adminInfo: adminUsername ? { name: adminUsername } : null, // Keep adminInfo structure for compatibility
    adminUsername,
    handleLogin,
    handleLogout,
    isLoading,
  };
};