import { ReactNode } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsContext } from '../contexts/ProjectsContext';

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const projectsData = useProjects();

  return (
    <ProjectsContext.Provider value={projectsData}>
      {children}
    </ProjectsContext.Provider>
  );
};