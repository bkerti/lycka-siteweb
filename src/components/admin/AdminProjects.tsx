
import ProjectHeader from "./projects/ProjectHeader";
import ProjectList from "./projects/ProjectList";
import ProjectFormCard from "./projects/ProjectFormCard";
import { useProjectsContext } from "@/hooks/useProjectsContext";

const AdminProjects = () => {
  const {
    projects,
    editingProject,
    setEditingProject,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCancel
  } = useProjectsContext();

  return (
    <div>
      <ProjectHeader onNewProject={() => setEditingProject(null)} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des projets existants */}
        <ProjectList
          key={projects.length} // Add key to force re-mount when projects change
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Formulaire d'édition */}
        <ProjectFormCard
          editingProject={editingProject}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AdminProjects;
