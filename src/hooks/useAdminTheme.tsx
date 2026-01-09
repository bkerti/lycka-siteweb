import { useContext } from "react";
import { AdminThemeProviderContext } from "@/contexts/AdminThemeContext";

export const useAdminTheme = () => {
    const context = useContext(AdminThemeProviderContext)
  
    if (context === undefined) throw new Error("useAdminTheme must be used within a AdminThemeProvider")
  
    return context
  }