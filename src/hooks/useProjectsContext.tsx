import { useContext } from 'react';
import { ProjectsContext } from '../contexts/ProjectsContext';

export const useProjectsContext = () => {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
        throw new Error('useProjectsContext must be used within a ProjectsProvider');
    }
    return context;
};