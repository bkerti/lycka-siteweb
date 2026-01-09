
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDetail from "@/components/projects/ProjectDetail";
import CategoryFilters from "@/components/projects/CategoryFilters";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { useProjectsPage, ProjectType } from "@/hooks/useProjectsPage";
import { useProjects } from "@/hooks/useProjects";
import { carouselImages } from "@/data/projects";

const Projects = () => {
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();

    const handleFocus = () => {
      fetchProjects();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProjects]);

  const { 
    filter, 
    setFilter, 
    projectType, 
    setProjectType,
    selectedProject, 
    categoryFilters, 
    filteredProjects,
    handleProjectClick,
    handleCloseProject
  } = useProjectsPage(projects);

  // Handle project type change from string to ProjectType
  const handleProjectTypeChange = (value: string) => {
    setProjectType(value as ProjectType);
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="Nos Projets"
          subtitle="Découvrez nos réalisations et nos concepts architecturaux"
          backgroundImage="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          carouselImages={carouselImages}
        />

        <section className="section bg-background">
          <div className="container mx-auto">
            <div className="flex flex-col space-y-6 mb-8">
              <h2 className="text-center">Nos projets</h2>
              
              {/* Tabs for Réalisations/Conceptions */}
              <Tabs defaultValue="realisations" className="w-full" onValueChange={handleProjectTypeChange}>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="realisations">Réalisations</TabsTrigger>
                  <TabsTrigger value="conceptions">Conceptions</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Category Filters */}
              <CategoryFilters 
                filters={categoryFilters}
                activeFilter={filter}
                onFilterChange={setFilter}
              />
            </div>

            {/* Projects Grid */}
            <ProjectGrid 
              projects={filteredProjects}
              onProjectClick={handleProjectClick}
            />
          </div>
        </section>
        
        {/* Project Detail Modal */}
        <ProjectDetail 
          project={selectedProject} 
          onClose={handleCloseProject} 
        />
      </main>
      <Footer />
    </>
  );
};

export default Projects;
