
import { useState } from "react";
import { Project } from "@/models/Project";

export type ProjectType = "realisations" | "conceptions";

export interface CategoryFilter {
  name: string;
  value: string;
}

export const useProjectsPage = (projects: Project[]) => {
  const [filter, setFilter] = useState("all");
  const [projectType, setProjectType] = useState<ProjectType>("realisations");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categoryFilters: CategoryFilter[] = [
    { name: "Tous", value: "all" },
    { name: "Résidentiel", value: "residentiel" },
    { name: "Commercial", value: "commercial" },
    { name: "Institutionnel", value: "institutionnel" },
    { name: "Industriel", value: "industriel" },
  ];

  // Filtrer par type de projet (réalisations ou conceptions) et par catégorie
  const filteredProjects = projects.filter(project => {
    const typeMatch = project.status === projectType;

    if (filter === "all") {
      return typeMatch;
    } else {
      const categoryMatch = project.category === filter;
      return categoryMatch && typeMatch;
    }
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value as ProjectType);
  };

  return {
    filter,
    setFilter,
    projectType,
    setProjectType: handleProjectTypeChange,
    selectedProject,
    categoryFilters,
    filteredProjects,
    handleProjectClick,
    handleCloseProject,
  };
};
