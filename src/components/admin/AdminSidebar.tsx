import React from "react";
import { 
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { BarChart, Folder, Home, Image, LogOut, MessageSquare, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSession } from "@/models/AdminSession";
import { AdminModeToggle } from "./AdminModeToggle";

interface AdminSidebarProps {
  activeSection: string;
  handleNavigateToSection: (section: string) => void;
  adminInfo: AdminSession | null;
  handleLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection, 
  handleNavigateToSection, 
  adminInfo, 
  handleLogout 
}) => {
  return (
    <div> {/* Wrap in a single div */}
      <SidebarHeader>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <img 
              src="/logo_header.png" // Use the new logo directly
              alt="LYCKA Logo" 
              className="h-8"
            />
            <h2 className="text-xl font-bold font-heading bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 bg-clip-text text-transparent dark:text-white">LYCKA Admin</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gestion de contenu</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("overview")}
              isActive={activeSection === "overview"}
            >
              <div className="flex items-center">
                <Home className="mr-2" size={18} />
                <span>Tableau de bord</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("statistics")}
              isActive={activeSection === "statistics"}
              tooltip="Statistiques"
            >
              <div className="flex items-center">
                <BarChart className="mr-2" size={18} />
                <span>Statistiques</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("services")}
              isActive={activeSection === "services"}
              tooltip="Services"
            >
              <div className="flex items-center">
                <Folder className="mr-2" size={18} />
                <span>Services</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("projects")}
              isActive={activeSection === "projects"}
              tooltip="Projets"
            >
              <div className="flex items-center">
                <Image className="mr-2" size={18} />
                <span>Projets</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("lycka-home")}
              isActive={activeSection === "lycka-home"}
              tooltip="LYCKA Home"
            >
              <div className="flex items-center">
                <Home className="mr-2" size={18} />
                <span>LYCKA Home</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("lycka-home-comments")}
              isActive={activeSection === "lycka-home-comments"}
              tooltip="Avis Lycka Home"
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                <span>Avis Lycka Home</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("media-interactions")}
              isActive={activeSection === "media-interactions"}
              tooltip="Commentaires & Interactions Galerie"
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                <span>Commentaires & Interactions Galerie</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleNavigateToSection("testimonials")}
              isActive={activeSection === "testimonials"}
              tooltip="Témoignages"
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                <span>Témoignages</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigateToSection("lycka-blog")}
              isActive={activeSection === "lycka-blog"}
              tooltip="Lycka Blog"
            >
              <div className="flex items-center">
                <Sparkles className="mr-2" size={18} />
                <span>Lycka Blog</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleNavigateToSection("blog-comments")}
              isActive={activeSection === "blog-comments"}
              tooltip="Gestion des commentaires"
            >
              <div className="flex items-center">
                <MessageSquare className="mr-2" size={18} />
                <span>Commentaires du Blog</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {adminInfo && (
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Connecté en tant que</div>
            <div className="font-medium dark:text-white">{adminInfo.name}</div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button 
            className="w-full flex items-center justify-center" 
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
          <AdminModeToggle />
        </div>
      </SidebarFooter>
    </div>
  );
};