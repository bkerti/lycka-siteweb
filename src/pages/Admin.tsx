import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AdminLogin from "@/components/admin/AdminLogin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminContent from "@/components/admin/AdminContent";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useLocation } from "react-router-dom";
import { ProjectsProvider } from "@/providers/ProjectsProvider";

import { HomeModelsProvider } from "@/providers/HomeModelsProvider";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const location = useLocation();
  const { isAuthenticated, adminInfo, handleLogin, handleLogout, isLoading } = useAdminAuth();
  
  // Check if a section is specified in the location state
  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state?.section]);

  const handleNavigateToSection = (section: string) => {
    console.log("Navigating to section:", section);
    setActiveSection(section);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminThemeProvider>
      <HomeModelsProvider>
        <ProjectsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-background">
              <Sidebar>
                <AdminSidebar 
                  activeSection={activeSection} 
                  handleNavigateToSection={handleNavigateToSection} 
                  adminInfo={adminInfo} 
                  handleLogout={handleLogout} 
                />
              </Sidebar>
              <SidebarInset>
                {/* Fixed header for mobile navigation */}
                <div className="md:hidden sticky top-0 bg-background z-10 p-2 flex items-center shadow-sm">
                  <SidebarTrigger className="mr-2" />
                  <h1 className="text-lg font-semibold capitalize">{activeSection.replace('-', ' ')}</h1>
                </div>
                <AdminContent 
                  key={activeSection}
                  activeSection={activeSection} 
                />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ProjectsProvider>
      </HomeModelsProvider>
    </AdminThemeProvider>
  );
};

export default Admin;