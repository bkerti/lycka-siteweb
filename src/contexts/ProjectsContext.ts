import { createContext } from 'react';
import { Project } from '@/models/Project';

type ProjectsContextType = {
  projects: Project[];
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
  handleSubmit: (data: Omit<Project, "id" | "media">, media: { url: string; type: string }[]) => Promise<boolean>;
  handleCancel: () => void;
  fetchProjects: () => void;
};

export const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);