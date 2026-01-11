
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
    <div>hello</div>
  );
};
