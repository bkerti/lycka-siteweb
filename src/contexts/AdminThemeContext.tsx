import { createContext } from "react";
import { Theme } from "@/models/Theme";

type AdminThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
  }
  
  const initialState: AdminThemeProviderState = {
    theme: "system",
    setTheme: () => null,
  }

export const AdminThemeProviderContext = createContext<AdminThemeProviderState>(initialState);