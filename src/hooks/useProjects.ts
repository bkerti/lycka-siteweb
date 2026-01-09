import { useState, useEffect, useCallback } from "react";
import { Project } from "@/models/Project";
import { useToast } from "@/hooks/use-toast";

const API_URL = '/api';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast({ title: "Erreur d'authentification", description: "Token non trouvé.", variant: "destructive" });
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la récupération des projets.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleDelete = async (id: string) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': headers.Authorization },
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter(project => project.id !== id));
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
      toast({ title: "Projet supprimé", description: "Le projet a été supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({ title: "Erreur", description: "Erreur lors de la suppression du projet.", variant: "destructive" });
    }
  };

  const handleSubmit = async (data: Omit<Project, "id" | "media">, media: { url: string; type: string }[]): Promise<boolean> => {
    const headers = getAuthHeaders();
    if (!headers) return false;

    const projectData = {
        ...data,
        media: media,
    };

    console.log("Submitting project data:", projectData);

    try {
      let updatedProject: Project;
      if (editingProject) {
        // Update existing project
        const response = await fetch(`${API_URL}/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(projectData),
        });
        if (!response.ok) throw new Error('Failed to update project');
        updatedProject = await response.json();
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        toast({ title: "Projet mis à jour", description: "Le projet a été mis à jour avec succès" });
      } else {
        // Create new project
        const response = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(projectData),
        });
        if (!response.ok) throw new Error('Failed to create project');
        updatedProject = await response.json();
        setProjects([...projects, updatedProject]);
        toast({ title: "Projet ajouté", description: "Le projet a été ajouté avec succès" });
      }
      setEditingProject(null);
      return true;
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({ title: "Erreur", description: "Erreur lors de la soumission du projet.", variant: "destructive" });
      return false;
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  return {
    projects,
    editingProject,
    setEditingProject,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel,
    fetchProjects, // Export fetchProjects so it can be called externally
  };
};