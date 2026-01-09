import { useEffect, useState } from "react"
import { Theme } from "@/models/Theme";
import { AdminThemeProviderContext } from "@/contexts/AdminThemeContext";

type AdminThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function AdminThemeProvider({ 
  children, 
  defaultTheme = "light", 
  storageKey = "vite-admin-ui-theme", 
  ...props 
}: AdminThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    // We add a class to the body to scope the admin theme
    document.body.classList.add("admin-theme");

    root.classList.remove("admin-light", "admin-dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(`admin-${systemTheme}`)
      return
    }

    root.classList.add(`admin-${theme}`)

    return () => {
      document.body.classList.remove("admin-theme");
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <AdminThemeProviderContext.Provider {...props} value={value}>
      {children}
    </AdminThemeProviderContext.Provider>
  )
}