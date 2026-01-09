
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Folder, Home, Image } from "lucide-react";
import AdminDashboardChart from "@/components/admin/AdminDashboardChart";

// Import the hooks
import { useGalleryItems } from "@/hooks/useGalleryItems";
import { useProjectsContext } from "@/hooks/useProjectsContext";
import { useServicesContext } from "@/hooks/useServicesContext";
import { useHomeModelsContext } from "@/hooks/useHomeModelsContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

import RecentTestimonials from "./RecentTestimonials";

const AdminOverview = () => {
  const navigate = useNavigate();

  // Call the hooks to get data
  const { services } = useServicesContext();
  const { projects } = useProjectsContext();
  const { homeModels } = useHomeModelsContext();
  const { mediaItems } = useGalleryItems("all", "all"); // Use "all" for filter and category for total count

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 hidden md:block">Tableau de bord administrateur</h1>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Folder className="mr-2" size={20} />
                Services
              </CardTitle>
              <CardDescription>Gestion des services de LYCKA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-bold">{services?.length || 0}</p> {/* Dynamic count */}
              <p className="text-sm text-gray-500">services actifs</p>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate("/admin", { state: { section: "services" } })}
              >
                Gérer les services
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2" size={20} />
                Projets
              </CardTitle>
              <CardDescription>Gestion des projets réalisés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-bold">{projects?.length || 0}</p> {/* Dynamic count */}
              <p className="text-sm text-gray-500">projets publiés</p>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate("/admin", { state: { section: "projects" } })}
              >
                Gérer les projets
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2" size={20} />
                LYCKA Home
              </CardTitle>
              <CardDescription>Gestion des modèles de maisons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-4xl font-bold">{homeModels?.length || 0}</p> {/* Dynamic count */}
              <p className="text-sm text-gray-500">modèles disponibles</p>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate("/admin", { state: { section: "lycka-home" } })}
              >
                Gérer les modèles
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2" size={20} />
                Galerie média
              </CardTitle>
              <CardDescription>Gestion des médias (images)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-4 justify-around">
                <div className="text-center">
                  <p className="text-3xl font-bold">{mediaItems?.length || 0}</p> {/* Dynamic count */}
                  <p className="text-sm text-gray-500">images</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold">4</p>
                  <p className="text-sm text-gray-500">catégories</p>
                </div>
              </div>
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate("/gallery")}
              >
                Voir la galerie
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-8">
        <RecentTestimonials />
      </div>
      
      <p className="mt-8 text-center text-gray-500 text-sm md:text-base">
        Bienvenue dans l'interface d'administration de LYCKA. Utilisez le menu latéral pour gérer le contenu du site.
      </p>

      <AdminDashboardChart />
    </div>
  );
};

export default AdminOverview;
